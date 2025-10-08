require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express(); // Initialize app once

// Middleware
app.use(cors());
app.use(express.json());

// ======================
// CONFIG
// ======================
const CONFIG = {
    PORT: process.env.PORT || 3000,
    WARNING_THRESHOLD: (process.env.WARNING_MINUTES || 5) * 60 * 1000,
    CRITICAL_THRESHOLD: (process.env.CRITICAL_MINUTES || 15) * 60 * 1000,
    EMAIL_ALERTS: process.env.EMAIL_ALERTS_ENABLED !== 'false',
    EMAIL_FROM: process.env.EMAIL_FROM || 'alerts@justinsuranceco.com',
    EMAIL_TO: process.env.EMAIL_TO ? process.env.EMAIL_TO.split(',') : ['support@justinsurance.com'],
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
    SMTP_SECURE: process.env.SMTP_SECURE === 'true' || false,
    SMTP_USER: process.env.SMTP_USER || 'support@yourinsurancelicense.com',
    SMTP_PASS: process.env.SMTP_PASS || 'Telesales123$',
    ASSIGNED_USER_FILTER: 'Support Team',
    BUSINESS_HOURS: {
        monday: { start: 8, end: 22 },
        tuesday: { start: 8, end: 22 },
        wednesday: { start: 8, end: 22 },
        thursday: { start: 8, end: 22 },
        friday: { start: 8, end: 22 },
        saturday: { start: 8, end: 18 },
        sunday: { start: 8, end: 18 }
    },
    TIMEZONE: 'America/New_York'
};

// ======================
// EMAIL SETUP
// ======================
let emailTransporter = null;
if (CONFIG.EMAIL_ALERTS) {
    try {
        emailTransporter = nodemailer.createTransport({
            host: CONFIG.SMTP_HOST,
            port: CONFIG.SMTP_PORT,
            secure: CONFIG.SMTP_SECURE,
            auth: {
                user: CONFIG.SMTP_USER,
                pass: CONFIG.SMTP_PASS
            }
        });
        console.log('✅ Email transporter configured');
    } catch (error) {
        console.error('❌ Error configuring email:', error);
        CONFIG.EMAIL_ALERTS = false;
    }
}

// ======================
// STORAGE
// ======================
const conversations = new Map();
const alertsSent = new Map();

// ======================
// BUSINESS HOURS LOGIC
// ======================
function isWithinBusinessHours() {
    const now = new Date();
    const estTime = new Date(now.toLocaleString('en-US', { timeZone: CONFIG.TIMEZONE }));
    const day = estTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hour = estTime.getHours();
    const hours = CONFIG.BUSINESS_HOURS[day];
    if (!hours) return false;
    return hour >= hours.start && hour < hours.end;
}

function getNextBusinessHoursTime() {
    const now = new Date();
    const estTime = new Date(now.toLocaleString('en-US', { timeZone: CONFIG.TIMEZONE }));
    const day = estTime.toLocaleDateString('en-US', { weekday: 'long' });
    const hour = estTime.getHours();
    return `Next: ${day} ${hour < 12 ? hour : hour - 12}:00 ${hour < 12 ? 'AM' : 'PM'} EST`;
}

// ======================
// ROUTES
// ======================
app.get('/', (req, res) => res.send('JustInsurance Tracker is running!'));

// Incoming messages
app.post('/webhook/incoming-message', (req, res) => {
    const { conversationId, contactId, contactName, dateAdded, assignedTo, messageBody, type, locationId } = req.body;
    if (!conversationId || !contactId) return res.status(400).json({ error: 'Missing required fields' });

    if (assignedTo !== CONFIG.ASSIGNED_USER_FILTER) return res.json({ success: true, skipped: true, reason: `Not assigned to ${CONFIG.ASSIGNED_USER_FILTER}` });

    let conversation = conversations.get(conversationId) || {
        conversationId,
        contactId,
        contactName: contactName || 'Unknown Contact',
        locationId,
        assignedTo,
        messages: [],
        lastInbound: null,
        lastResponse: null,
        needsResponse: false
    };
    conversations.set(conversationId, conversation);

    const timestamp = dateAdded ? new Date(dateAdded).getTime() : Date.now();
    conversation.messages.push({ id: `msg_${Date.now()}`, type: 'inbound', body: messageBody, channel: type, timestamp });
    conversation.lastInbound = timestamp;
    conversation.needsResponse = true;

    console.log(`✅ Tracked Support Team message: ${contactName} (${conversationId})`);
    res.json({ success: true, conversationId, assignedTo });
});

// Outgoing messages
app.post('/webhook/outgoing-message', (req, res) => {
    const { conversationId, messageBody, dateAdded } = req.body;
    if (!conversationId) return res.status(400).json({ error: 'Missing conversationId' });

    const conversation = conversations.get(conversationId);
    if (!conversation) return res.json({ success: true, note: 'Conversation not tracked' });

    const timestamp = dateAdded ? new Date(dateAdded).getTime() : Date.now();
    conversation.messages.push({ id: `msg_${Date.now()}`, type: 'outbound', body: messageBody, timestamp });
    conversation.lastResponse = timestamp;
    conversation.needsResponse = false;

    alertsSent.delete(`${conversationId}-warning`);
    alertsSent.delete(`${conversationId}-critical`);

    console.log(`✅ Response recorded for Support Team: ${conversationId}`);
    res.json({ success: true, conversationId });
});

// Pending messages
app.get('/api/pending-messages', (req, res) => {
    const now = Date.now();
    const pending = [];
    for (const [conversationId, conversation] of conversations.entries()) {
        if (!conversation.needsResponse || conversation.assignedTo !== CONFIG.ASSIGNED_USER_FILTER) continue;
        const lastMessage = conversation.messages.filter(m => m.type === 'inbound').sort((a, b) => b.timestamp - a.timestamp)[0];
        const elapsed = now - conversation.lastInbound;
        pending.push({ id: conversationId, conversationId, contactName: conversation.contactName, preview: lastMessage ? lastMessage.body : 'No preview', timestamp: conversation.lastInbound, elapsed });
    }
    pending.sort((a, b) => b.elapsed - a.elapsed);
    res.json({ success: true, count: pending.length, messages: pending });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, status: 'running', pending: Array.from(conversations.values()).filter(c => c.needsResponse).length });
});

// ======================
// START SERVER
// ======================
const server = app.listen(CONFIG.PORT, () => console.log(`Server running on port ${CONFIG.PORT}`));

// Graceful shutdown
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));

module.exports = app;
