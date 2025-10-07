# ⚡ JustInsurance Message Tracker - Quick Start

## 🎯 Custom Features for JustInsurance

✅ **Filters by "Support Team"** - Only tracks messages assigned to Support Team (ignores recruiting)  
✅ **Business Hours Alerts** - Mon-Fri 8am-10pm, Sat-Sun 8am-6pm EST  
✅ **Your Brand Colors** - Dark blue theme matching your logo  
✅ **Logo Included** - JustInsurance branding on dashboard  

---

## 🚀 Get Running in 10 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email
Create your `.env` file:
```bash
cp justinsurance.env.template .env
```

Edit `.env` and update these settings:
```env
EMAIL_TO=your-support-team@justinsurance.com
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password
```

**Get Gmail App Password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Generate password for "JustInsurance Alerts"
3. Copy to `.env`

### 3. Start the Server
```bash
node justinsurance-backend.js
```

✅ You should see:
```
╔════════════════════════════════════════════════════╗
║     JustInsurance Message Response Tracker         ║
╚════════════════════════════════════════════════════╝

🟢 STATUS: BUSINESS HOURS - Alerts ACTIVE
Assigned User Filter: "Support Team"
```

### 4. Make It Accessible (Testing)
```bash
# In a new terminal:
npx ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 5. Configure GHL Webhooks

**In GHL → Settings → Webhooks:**

#### Webhook 1: Incoming Messages
- **Name:** "Support Team - Incoming Messages"
- **URL:** `https://your-ngrok-url.ngrok.io/webhook/incoming-message`
- **Event:** "Inbound Message"
- **Fields to send:** (CRITICAL - Include all these!)
  - `contactId`
  - `conversationId`
  - `locationId`
  - `messageBody`
  - `type`
  - `contactName`
  - `dateAdded`
  - **`assignedTo`** ⭐ **REQUIRED** - This filters for "Support Team"

#### Webhook 2: Outgoing Messages
- **Name:** "Support Team - Outgoing Messages"
- **URL:** `https://your-ngrok-url.ngrok.io/webhook/outgoing-message`
- **Event:** "Outbound Message" or "Message Sent"
- **Fields to send:**
  - `conversationId`
  - `messageBody`
  - `userId`
  - `dateAdded`

### 6. Open Dashboard

1. **Copy the logo file:**
   - Put `JustInsurance_Logo.png` in the same folder as `justinsurance-dashboard.html`

2. **Open the dashboard:**
   - Double-click `justinsurance-dashboard.html`

3. **Configure API URL:**
   - Enter your ngrok URL: `https://your-ngrok-url.ngrok.io`
   - Click "Update"

4. **Enable notifications:**
   - Click "Enable Notifications" when prompted

---

## ✅ Test It

### Test 1: Support Team Message
1. **In GHL:** Assign a conversation to "Support Team"
2. **Send a message** to that conversation
3. **Check dashboard** - message should appear ✅
4. **Check backend console** - should see: `✅ Tracked Support Team message`

### Test 2: Non-Support Team Message (Should Be Ignored)
1. **In GHL:** Assign a conversation to "Recruiting" or any other team
2. **Send a message** to that conversation
3. **Check dashboard** - message should NOT appear ✅
4. **Check backend console** - should see: `⏭️ Skipping - Not assigned to Support Team`

### Test 3: Business Hours
1. **During business hours** (Mon-Fri 8am-10pm, Sat-Sun 8am-6pm EST):
   - Dashboard shows: 🟢 Business Hours
   - Send message, wait 5 mins → Get email alert ✅

2. **After hours:**
   - Dashboard shows: 🔴 After Hours (Alerts Paused)
   - Messages still tracked but NO email alerts sent ✅
   - Alerts resume during business hours

### Test 4: Reply Handling
1. **Send message** from customer
2. **Reply in GHL** as Support Team
3. **Message disappears** from dashboard ✅

---

## 🎯 How the Support Team Filter Works

```
Message arrives → GHL webhook sends data
                        ↓
                Is assignedTo = "Support Team"?
                        ↓
                    YES ✅ → Track it
                    NO ❌ → Skip it
```

**Only messages assigned to "Support Team" are tracked!**

Messages from recruiting, sales, or any other team are automatically ignored.

---

## 🕐 Business Hours Explained

**Alerts are ONLY sent during:**
- **Monday-Friday:** 8:00 AM - 10:00 PM EST
- **Saturday-Sunday:** 8:00 AM - 6:00 PM EST

**What happens after hours:**
- ✅ Messages are still tracked
- ✅ Dashboard still shows them
- ❌ Email alerts are paused
- ❌ No notifications sent

**When business hours resume:**
- ✅ If messages still pending, alerts will trigger
- ✅ Dashboard shows "Business Hours" status

The dashboard automatically shows whether you're in or out of business hours.

---

## 📊 Dashboard Features

### Status Indicators
- 🟢 **Business Hours** - Alerts active
- 🔴 **After Hours** - Alerts paused
- 🟢 **Connected** - Backend working
- 🔴 **Disconnected** - Check backend

### Message Cards
- **Blue** - New message (0-5 min)
- **Orange** - Warning (5-15 min) - triggers alert during business hours
- **Red** - Critical (15+ min) - triggers urgent alert during business hours

### For Your CSR Team
1. Open dashboard at start of shift
2. Keep it running in background
3. Alerts only appear during business hours
4. Click "Open in GHL" to respond
5. Message auto-disappears after reply

---

## 🔧 Customization

### Change Alert Times
Edit `.env`:
```env
WARNING_MINUTES=3   # Alert at 3 min instead of 5
CRITICAL_MINUTES=10 # Alert at 10 min instead of 15
```

### Change Business Hours
Edit `justinsurance-backend.js` around line 29:
```javascript
BUSINESS_HOURS: {
    monday: { start: 7, end: 23 },    // 7am-11pm
    tuesday: { start: 7, end: 23 },
    // ... etc
}
```

### Change Assigned User Filter
Edit `justinsurance-backend.js` around line 26:
```javascript
ASSIGNED_USER_FILTER: 'Support Team',  // Change this
```

### Add More Email Recipients
Edit `.env`:
```env
EMAIL_TO=csr1@ji.com,csr2@ji.com,manager@ji.com,supervisor@ji.com
```

---

## 🐛 Troubleshooting

### "No messages appearing"
**Check:**
- Is message assigned to "Support Team" in GHL?
- Backend console shows: `✅ Tracked Support Team message`?

**If it says "Skipping":**
- Message is not assigned to Support Team
- Assign it to Support Team in GHL

### "Alerts not coming through"
**Check:**
- Are you in business hours? (Mon-Fri 8am-10pm, Sat-Sun 8am-6pm EST)
- Dashboard shows 🟢 Business Hours?
- Check spam folder for emails

**If after hours:**
- Alerts are paused (by design)
- Will resume during business hours

### "Dashboard shows disconnected"
**Check:**
- Backend server running? `node justinsurance-backend.js`
- API URL correct in dashboard?
- If using ngrok, is it still running?

---

## 🌐 Deploy to Production

Once tested with ngrok, deploy to a server:

### Option 1: Heroku (Recommended)
```bash
heroku create justinsurance-tracker
git add .
git commit -m "Deploy"
git push heroku main
heroku config:set SMTP_USER=your@email.com
heroku config:set SMTP_PASS=your-password
```

Your URL: `https://justinsurance-tracker.herokuapp.com`

### Option 2: DigitalOcean / AWS / Azure
- Deploy to a VPS
- Use PM2 to keep it running: `pm2 start justinsurance-backend.js`
- Set up SSL certificate

**After deployment:**
1. Update GHL webhooks with production URL
2. Update dashboard API URL
3. Test thoroughly!

---

## 📱 CSR Daily Usage

### Morning Routine
1. Open `justinsurance-dashboard.html` in Chrome
2. Keep tab open all day (can minimize)
3. Make sure it shows 🟢 Connected

### During Shift
- Alerts will sound/show for pending messages
- Click "Open in GHL" to respond
- Message disappears after you reply

### After Hours
- Dashboard still works
- Shows 🔴 After Hours
- Alerts paused until next business day

---

## 📋 Important Files

| File | Purpose |
|------|---------|
| `justinsurance-backend.js` | Backend server with Support Team filter |
| `justinsurance-dashboard.html` | Branded dashboard with logo |
| `justinsurance.env.template` | Configuration template |
| `JustInsurance_Logo.png` | Your logo (place next to dashboard) |
| `package.json` | Dependencies |

---

## ✨ You're All Set!

Your JustInsurance message tracker is now:
- ✅ Only tracking Support Team messages
- ✅ Only alerting during business hours
- ✅ Branded with your logo and colors
- ✅ Ready for your CSR team!

**Need Help?**
- Check backend console for detailed logs
- Look for `✅` (success) or `⏭️` (skipped) messages
- Test during business hours first

**Questions about:**
- Assigned user filtering? Check backend console when messages arrive
- Business hours? Dashboard shows current status
- Setup? All logs are in the server console

🎉 **Your Support Team will love this!**
