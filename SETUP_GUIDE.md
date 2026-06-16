# 🚀 The Corner Automation Setup Guide

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/KINGNOA99/THE-CORNER-AGENT.git
cd THE-CORNER-AGENT
npm install
```

### 2. Configure Credentials
```bash
cp .env.example .env
# Edit .env and add your API tokens
```

### 3. Test Locally
```bash
node business-scheduler.js
```

## API Configuration

### Facebook & Instagram
1. Go to https://developers.facebook.com/
2. Create an App
3. Get Page Access Token
4. Add `FACEBOOK_TOKEN` and `FACEBOOK_PAGE_ID` to .env
5. Get Instagram Business Account ID
6. Add `INSTAGRAM_TOKEN` and `INSTAGRAM_ACCOUNT_ID` to .env

### TikTok
1. Go to https://developer.tiktok.com/
2. Create Business Account
3. Generate API token
4. Add `TIKTOK_TOKEN` to .env

### WhatsApp
1. Set up WhatsApp Business Account
2. Get Phone Number ID and Token
3. Add `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_ID` to .env

## Scheduling with GitHub Actions

### 1. Add Secrets
Go to: Settings → Secrets and variables → Actions

Add these secrets:
- `FACEBOOK_TOKEN`
- `FACEBOOK_PAGE_ID`
- `INSTAGRAM_TOKEN`
- `INSTAGRAM_ACCOUNT_ID`
- `TIKTOK_TOKEN`
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_ID`
- `WHATSAPP_RECIPIENT`

### 2. Create Workflow File
Create `.github/workflows/daily-post.yml`:

```yaml
name: Daily Business Social Media Posts

on:
  schedule:
    - cron: '0 6 * * *'  # UTC 06:00 = SAST 08:00 (Daily at 8 AM)
  workflow_dispatch:

jobs:
  post-businesses:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install node-fetch uuid
      - env:
          FACEBOOK_TOKEN: ${{ secrets.FACEBOOK_TOKEN }}
          FACEBOOK_PAGE_ID: ${{ secrets.FACEBOOK_PAGE_ID }}
          INSTAGRAM_TOKEN: ${{ secrets.INSTAGRAM_TOKEN }}
          INSTAGRAM_ACCOUNT_ID: ${{ secrets.INSTAGRAM_ACCOUNT_ID }}
          TIKTOK_TOKEN: ${{ secrets.TIKTOK_TOKEN }}
          WHATSAPP_TOKEN: ${{ secrets.WHATSAPP_TOKEN }}
          WHATSAPP_PHONE_ID: ${{ secrets.WHATSAPP_PHONE_ID }}
          WHATSAPP_RECIPIENT: ${{ secrets.WHATSAPP_RECIPIENT }}
        run: node business-scheduler.js
```

## Optimal Posting Times

The scheduler automatically posts at these times for township audiences:

**Facebook**: 6 AM, 12 PM, 7 PM (Wed, Thu, Fri)
**Instagram**: 6 AM, 12 PM, 6 PM (Mon, Wed, Fri)
**TikTok**: 7 AM, 12 PM, 7 PM (Tue, Thu, Sat)
**WhatsApp**: 8 AM, 2 PM, 6 PM (Weekdays)

## Features

✅ Automatic business fetching from The-Corner-
✅ AI-generated platform-specific captions
✅ Optimal posting time calculation
✅ Multi-platform support
✅ Daily scheduled execution
✅ Error handling & logging
✅ Statistics & reporting

## Troubleshooting

**Missing token error**
- Ensure all environment variables are set in .env
- Check GitHub Secrets are correctly named

**API rate limits**
- Scheduler respects platform rate limits
- Space out posts across the day

**Failed posts**
- Check API credentials
- Verify token scopes and permissions
- Check GitHub Actions logs

## Support

For issues: @KINGNOA99 on GitHub
