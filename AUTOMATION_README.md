# The Corner - Social Media Automation Agent

Automated business posting to Facebook, Instagram, TikTok, and WhatsApp.

## 🚀 Quick Start

### 1. Set Environment Variables

Create a `.env` file or add these secrets to GitHub Actions:

```bash
FACEBOOK_TOKEN=your_facebook_token
FACEBOOK_PAGE_ID=your_page_id
INSTAGRAM_TOKEN=your_instagram_token
INSTAGRAM_ACCOUNT_ID=your_account_id
TIKTOK_TOKEN=your_tiktok_token
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_ID=your_phone_id
WHATSAPP_RECIPIENT=27812345678
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Scheduler

```bash
npm start
```

## 📅 Scheduling

The scheduler automatically posts businesses at optimal times:

- **Facebook**: 6 AM, 12 PM, 7 PM (Wed, Thu, Fri)
- **Instagram**: 6 AM, 12 PM, 6 PM (Mon, Wed, Fri)
- **TikTok**: 7 AM, 12 PM, 7 PM (Tue, Thu, Sat)
- **WhatsApp**: 8 AM, 2 PM, 6 PM (Weekdays)

## 🔄 Automation Flow

```
The-Corner- (Businesses)
        ↓
Business Scheduler
        ↓
Generate Captions + Hashtags
        ↓
Post to Platforms
        ↓
Log Results
```

## 📊 Features

✅ Automatic business fetching from The-Corner-
✅ AI-generated captions per platform
✅ Optimal posting time calculation
✅ Multi-platform support (Facebook, Instagram, TikTok, WhatsApp)
✅ Daily scheduled execution via GitHub Actions
✅ Error handling & retry logic
✅ Posting statistics & reporting

## 🛠 API Configuration

### Facebook
1. Create Facebook App
2. Generate Page Access Token
3. Add `FACEBOOK_TOKEN` and `FACEBOOK_PAGE_ID`

### Instagram
1. Use Facebook App credentials
2. Get Instagram Business Account ID
3. Add `INSTAGRAM_TOKEN` and `INSTAGRAM_ACCOUNT_ID`

### TikTok
1. Apply for TikTok Developer Access
2. Create Business Account
3. Add `TIKTOK_TOKEN`

### WhatsApp
1. Set up WhatsApp Business Account
2. Get Phone Number ID
3. Add `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_ID`

## 📈 Statistics

```
📊 Posting Statistics:
- Total Scheduled: 0
- Posted: 0
- Success Rate: N/A
```

## 🐛 Troubleshooting

**Missing token error**: Ensure all environment variables are set
**API rate limits**: Scheduler respects platform rate limits
**Failed posts**: Check logs in GitHub Actions or console

## 📞 Support

For issues or questions, contact @KINGNOA99
