# 📨 JustInsurance Message Response Tracking System

## 🎯 Custom Built for JustInsurance

This system is specifically configured for your Support Team with:

✅ **"Support Team" Filter** - Only tracks messages assigned to Support Team, automatically ignores recruiting messages  
✅ **Business Hours Alerts** - Mon-Fri 8am-10pm, Sat-Sun 8am-6pm EST only  
✅ **Your Branding** - Logo and dark blue colors matching your brand  
✅ **5 & 15 Minute Alerts** - Email + browser + sound notifications  

---

## 📦 Your Custom Files

| File | What It Does |
|------|--------------|
| **`JUSTINSURANCE-QUICKSTART.md`** | **START HERE** - Setup in 10 minutes |
| `justinsurance-backend.js` | Server with Support Team filter & business hours |
| `justinsurance-dashboard.html` | Your branded dashboard with logo |
| `JustInsurance_Logo.png` | Your logo (included) |
| `justinsurance.env.template` | Configuration template |
| `package.json` | Dependencies |

---

## 🚀 Quick Start (3 Steps)

### 1. Install
```bash
npm install
cp justinsurance.env.template .env
# Edit .env with your Gmail info
```

### 2. Start
```bash
node justinsurance-backend.js
```

### 3. Configure
- Set up GHL webhooks (details in JUSTINSURANCE-QUICKSTART.md)
- Open `justinsurance-dashboard.html` in browser
- Enable notifications

**Full instructions:** Read `JUSTINSURANCE-QUICKSTART.md`

---

## 🎯 How It Works for You

### Support Team Filter

```
Message arrives in GHL
        ↓
Is it assigned to "Support Team"?
        ↓
    YES → Track it, alert if needed
    NO  → Ignore it (recruiting, etc.)
```

**Only Support Team messages are tracked!** Recruiting and other teams won't clutter your dashboard.

### Business Hours

```
Support Team message arrives
        ↓
Is it during business hours?
  Mon-Fri 8am-10pm EST
  Sat-Sun 8am-6pm EST
        ↓
    YES → Send alerts at 5 & 15 min
    NO  → Track but don't alert
```

**Alerts pause after hours** and resume during business hours. Your CSRs won't get woken up!

---

## 📊 What Your CSRs See

### Dashboard Status
- **🟢 Business Hours** - Alerts active, ready to notify
- **🔴 After Hours** - Tracking but alerts paused
- **Support Team Pending** - Only your team's messages

### Message Cards
- **Blue** - New (0-5 min) - No alert yet
- **Orange** - Warning (5 min) - Email + notification sent
- **Red** - Critical (15 min) - Urgent alert sent

### Features
- Live countdown timers
- "Open in GHL" button
- "Mark Done" manual override
- Sound alerts (different for 5 vs 15 min)
- Browser notifications

---

## ⏰ Business Hours Details

**When Alerts Are ACTIVE:**
| Day | Hours (EST) |
|-----|-------------|
| Monday | 8:00 AM - 10:00 PM |
| Tuesday | 8:00 AM - 10:00 PM |
| Wednesday | 8:00 AM - 10:00 PM |
| Thursday | 8:00 AM - 10:00 PM |
| Friday | 8:00 AM - 10:00 PM |
| Saturday | 8:00 AM - 6:00 PM |
| Sunday | 8:00 AM - 6:00 PM |

**What Happens After Hours:**
- ✅ Messages still tracked
- ✅ Dashboard still works
- ❌ NO email alerts
- ❌ NO browser notifications
- ✅ Resumes automatically during business hours

---

## 🔐 GHL Webhook Setup

### Critical: Include `assignedTo` Field!

When setting up your GHL webhooks, you **MUST** include the `assignedTo` field. This is how the system knows to only track Support Team messages.

**Incoming Message Webhook:**
- Include: `contactId`, `conversationId`, `locationId`, `messageBody`, `type`, `contactName`, `dateAdded`
- **CRITICAL:** `assignedTo` ⭐

**Outgoing Message Webhook:**
- Include: `conversationId`, `messageBody`, `userId`, `dateAdded`

---

## 📧 Email Alerts

Your Support Team receives emails at:
- ⚠️ **5 minutes** - Warning alert
- 🚨 **15 minutes** - Urgent alert

**Email includes:**
- Customer name
- Message preview
- Time elapsed
- Channel (SMS, email, etc.)
- Direct link to open in GHL
- JustInsurance branding

**Only sent during business hours!**

---

## 🎨 Your Branding

The dashboard uses your colors:
- **Primary:** Dark blue (#1a3a52) - from your logo
- **Accent:** Lighter blue (#2d5f7f)
- **Logo:** Displayed at top of dashboard

Everything matches your brand!

---

## 🔧 Configuration

All settings in `.env` file:

```env
# Alert timing
WARNING_MINUTES=5
CRITICAL_MINUTES=15

# Email recipients
EMAIL_TO=csr1@justinsurance.com,csr2@justinsurance.com

# Gmail for sending alerts
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Want to change business hours or assigned user filter?**  
Edit `justinsurance-backend.js` (instructions in file)

---

## ✅ Testing Checklist

Before going live, test these scenarios:

### Test 1: Support Team Message ✅
- [ ] Assign conversation to "Support Team" in GHL
- [ ] Send test message
- [ ] Appears in dashboard
- [ ] Backend logs: `✅ Tracked Support Team message`

### Test 2: Non-Support Team Message ✅
- [ ] Assign conversation to "Recruiting" or other team
- [ ] Send test message
- [ ] Does NOT appear in dashboard
- [ ] Backend logs: `⏭️ Skipping - Not assigned to Support Team`

### Test 3: Business Hours (During Hours) ✅
- [ ] Dashboard shows 🟢 Business Hours
- [ ] Send message
- [ ] Wait 5 minutes
- [ ] Receive email alert

### Test 4: After Hours ✅
- [ ] Dashboard shows 🔴 After Hours
- [ ] Send message
- [ ] Message appears in dashboard
- [ ] NO email alert received

### Test 5: Reply Handling ✅
- [ ] Send customer message
- [ ] Reply from GHL
- [ ] Message disappears from dashboard

---

## 🐛 Common Issues

### "Messages not appearing"
**Solution:** Check if message is assigned to "Support Team" in GHL

### "Getting alerts for recruiting messages"
**Solution:** Make sure webhook includes `assignedTo` field

### "No alerts after hours"
**Solution:** This is correct! Alerts pause after hours (by design)

### "Dashboard shows disconnected"
**Solution:** Check backend is running: `node justinsurance-backend.js`

---

## 📱 For Your Support Team

### Daily Usage:
1. **Morning:** Open dashboard in Chrome, keep it running
2. **During day:** Respond when alerts appear
3. **After hours:** Dashboard still works but won't alert you

### What CSRs Need to Know:
- Only Support Team messages appear
- Alerts only during business hours
- Click "Open in GHL" to respond
- Message disappears after reply

---

## 🌐 Production Deployment

For live use (after testing):

1. **Deploy to Heroku/DigitalOcean**
2. **Update GHL webhooks** with production URL
3. **Update dashboard** API URL setting
4. **Train CSR team** on usage

Details in `JUSTINSURANCE-QUICKSTART.md`

---

## 📊 Monitoring

Check system status:
```bash
curl http://localhost:3000/health
```

Shows:
- Pending messages
- Business hours status
- Support Team filter active
- Email alerts enabled

Backend console shows:
- `📨` Incoming messages
- `📤` Outgoing responses
- `✅` Tracked messages
- `⏭️` Skipped messages (not Support Team)
- `📧` Email alerts sent
- `🟢` Business hours / `🔴` After hours

---

## 💡 Why This Solves Your Problem

### Your Old GHL Limitation:
❌ Workflows kept triggering even after CSR replied  
❌ Couldn't filter by assigned user  
❌ No way to detect "already responded"  
❌ Got alerts 24/7 even after hours  

### Your New System:
✅ Instantly knows when CSR replies  
✅ Only tracks Support Team messages  
✅ Accurate detection of response  
✅ Alerts only during business hours  
✅ Clean, branded dashboard  

---

## 🎉 You're Ready!

Everything is configured specifically for JustInsurance:
- ✅ Support Team filtering
- ✅ Business hours (Mon-Fri 8-10, Sat-Sun 8-6 EST)
- ✅ Your branding and logo
- ✅ 5 & 15 minute alerts

**Next Step:** Read `JUSTINSURANCE-QUICKSTART.md` for setup instructions!

---

## 📞 Support

**Setup Questions:** See JUSTINSURANCE-QUICKSTART.md  
**Troubleshooting:** Check backend console logs  
**Customization:** All settings in `.env` and backend file  

**Your system is ready to deploy! 🚀**
