#!/bin/bash

# THE CORNER - Setup Configuration Script
# Initializes environment variables and dependencies

echo "🚀 Setting up The Corner Automation..."
echo ""

# Create .env.example template
cat > .env.example << 'EOF'
# ==============================================
# THE CORNER - Social Media Automation Config
# ==============================================

# FACEBOOK
FACEBOOK_TOKEN=sk-facebook-page-access-token
FACEBOOK_PAGE_ID=your_facebook_page_id

# INSTAGRAM
INSTAGRAM_TOKEN=your_instagram_business_token
INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id

# TIKTOK
TIKTOK_TOKEN=your_tiktok_api_token

# WHATSAPP
WHATSAPP_TOKEN=your_whatsapp_business_token
WHATSAPP_PHONE_ID=your_whatsapp_phone_number_id
WHATSAPP_RECIPIENT=27812345678

# GENERAL
NODE_ENV=production
LOG_LEVEL=info
EOF

echo "✅ Created .env.example"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the template: cp .env.example .env"
echo "2. Fill in your API credentials in .env"
echo "3. Install dependencies: npm install"
echo "4. Test locally: npm start"
echo ""
echo "🔐 For GitHub Actions Automation:"
echo "1. Go to your repo Settings → Secrets and variables → Actions"
echo "2. Add each secret from your .env file"
echo "3. Workflow will run daily at 8 AM SAST"
echo ""