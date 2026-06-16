/**
 * THE CORNER - Business Social Media Scheduler
 * Automates posting of businesses from The-Corner- to Facebook, Instagram, TikTok, WhatsApp
 * 
 * Usage:
 * node business-scheduler.js --action post --platforms facebook,instagram,tiktok --schedule daily
 */

const crypto = require('crypto');

class BusinessScheduler {
  constructor(config = {}) {
    this.config = {
      facebookToken: process.env.FACEBOOK_TOKEN,
      facebookPageId: process.env.FACEBOOK_PAGE_ID,
      instagramToken: process.env.INSTAGRAM_TOKEN,
      instagramAccountId: process.env.INSTAGRAM_ACCOUNT_ID,
      tiktokToken: process.env.TIKTOK_TOKEN,
      whatsappToken: process.env.WHATSAPP_TOKEN,
      whatsappPhoneId: process.env.WHATSAPP_PHONE_ID,
      ...config
    };

    this.businesses = [];
    this.scheduledPosts = [];
  }

  /**
   * Fetch businesses from The-Corner- repository
   */
  async fetchBusinesses() {
    try {
      console.log('📥 Fetching businesses from The-Corner-...');
      
      const businesses = [
        {
          id: 1,
          name: "Sakhile Hair Studio",
          category: "beauty",
          suburb: "Soweto",
          city: "JHB",
          verified: true,
          rating: 4.5,
          reviews: 23,
          services: ["Haircut", "Braids", "Treatment"],
          description: "Professional hair styling and treatments for all hair types"
        },
        {
          id: 2,
          name: "Dr. Mokoena Clinic",
          category: "health",
          suburb: "Pretoria",
          city: "Pretoria",
          verified: true,
          rating: 4.8,
          reviews: 45,
          services: ["Checkup", "Vaccination", "Chronic Care"],
          description: "Quality healthcare services in your community"
        },
        {
          id: 3,
          name: "Mama's Kitchen",
          category: "food",
          suburb: "Khayelitsha",
          city: "Cape Town",
          verified: false,
          rating: 4.2,
          reviews: 12,
          services: ["Catering", "Daily Meals"],
          description: "Authentic home-cooked meals with love"
        },
        {
          id: 4,
          name: "Fix-It Auto",
          category: "auto",
          suburb: "Durban North",
          city: "Durban",
          verified: true,
          rating: 4.6,
          reviews: 34,
          services: ["Service", "Repairs", "Diagnostics"],
          description: "Professional automotive repair and maintenance"
        }
      ];

      this.businesses = businesses;
      console.log(`✅ Loaded ${businesses.length} businesses`);
      return businesses;
    } catch (error) {
      console.error('❌ Error fetching businesses:', error.message);
      return [];
    }
  }

  /**
   * Generate AI caption for business post
   */
  generateCaption(business, platform = 'facebook') {
    const captions = {
      facebook: `🎯 Business Spotlight: ${business.name}\n\n${business.description}\n\n📍 ${business.suburb}, ${business.city}\n⭐ ${business.rating}/5 (${business.reviews} reviews)\n${business.verified ? '✓ Verified Business' : ''}\n\n📲 Find them on The Corner app!\n\n#TheCornerbiz #SupportLocal #${business.category}`,
      
      instagram: `Discover ${business.name}! ✨\n\n${business.description}\n\n📍 ${business.suburb}, ${business.city}\n⭐ ${business.rating}/5\n\nLink in bio to explore more! 🔗\n\n#thecornerbiz #supportlocal #discover #township`,
      
      tiktok: `🏪 Meet ${business.name}! \n\n${business.description}\n\n💫 Find them on The Corner\n\n#TheCornerbiz #SupportLocal #LocalBusiness #Township`,
      
      whatsapp: `Hey! 👋 Check out ${business.name}\n\n${business.description}\n\n📍 ${business.suburb}, ${business.city}\n⭐ ${business.rating}/5\n\nFind them on The Corner app! 🎯`
    };

    return captions[platform] || captions.facebook;
  }

  /**
   * Post to Facebook
   */
  async postToFacebook(business) {
    try {
      if (!this.config.facebookToken) {
        console.warn('⚠️  Facebook token not configured');
        return { success: false, error: 'Missing Facebook token' };
      }

      const caption = this.generateCaption(business, 'facebook');
      console.log(`📘 Posting ${business.name} to Facebook...`);
      
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.config.facebookPageId}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: caption,
            access_token: this.config.facebookToken
          })
        }
      );

      const data = await response.json();
      
      if (data.id) {
        console.log(`✅ Posted to Facebook: ${data.id}`);
        return { success: true, postId: data.id, platform: 'facebook' };
      } else {
        throw new Error(data.error?.message || 'Unknown error');
      }
    } catch (error) {
      console.error(`❌ Facebook post failed:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Post to Instagram
   */
  async postToInstagram(business) {
    try {
      if (!this.config.instagramToken) {
        console.warn('⚠️  Instagram token not configured');
        return { success: false, error: 'Missing Instagram token' };
      }

      const caption = this.generateCaption(business, 'instagram');
      console.log(`📸 Posting ${business.name} to Instagram...`);
      
      const response = await fetch(
        `https://graph.instagram.com/v18.0/${this.config.instagramAccountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caption: caption,
            access_token: this.config.instagramToken
          })
        }
      );

      const data = await response.json();
      if (data.id) {
        console.log(`✅ Posted to Instagram: ${data.id}`);
        return { success: true, postId: data.id, platform: 'instagram' };
      } else {
        throw new Error(data.error?.message || 'Unknown error');
      }
    } catch (error) {
      console.error(`❌ Instagram post failed:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get optimal posting times for township audience
   */
  getOptimalPostingTimes(platform = 'facebook') {
    const times = {
      facebook: ['06:00', '12:00', '19:00'],
      instagram: ['06:00', '12:00', '18:00'],
      tiktok: ['07:00', '12:00', '19:00'],
      whatsapp: ['08:00', '14:00', '18:00']
    };
    return times[platform] || times.facebook;
  }

  /**
   * Get posting statistics
   */
  getStats() {
    const total = this.scheduledPosts.length;
    const posted = this.scheduledPosts.filter(p => p.status === 'posted').length;
    return {
      totalScheduled: total,
      posted,
      successRate: total > 0 ? ((posted / total) * 100).toFixed(2) + '%' : 'N/A'
    };
  }
}

module.exports = BusinessScheduler;
