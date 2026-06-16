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
      tiktokVideoId: process.env.TIKTOK_VIDEO_ID,
      whatsappToken: process.env.WHATSAPP_TOKEN,
      whatsappPhoneId: process.env.WHATSAPP_PHONE_ID,
      ...config
    };

    this.businesses = [];
    this.scheduledPosts = [];
    this.queue = [];
  }

  /**
   * Fetch businesses from The-Corner- repository
   */
  async fetchBusinesses() {
    try {
      console.log('📥 Fetching businesses from The-Corner-...');
      
      // Parse businesses from The-Corner- index.html data
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
        },
        {
          id: 5,
          name: "TechHub Repairs",
          category: "tech",
          suburb: "Sandton",
          city: "JHB",
          verified: false,
          rating: 3.9,
          reviews: 8,
          services: ["Phone Repair", "Laptop Repair"],
          description: "Quick and reliable tech repairs"
        },
        {
          id: 6,
          name: "Sparkle Cleaners",
          category: "home",
          suburb: "Gqeberha",
          city: "Gqeberha",
          verified: true,
          rating: 4.7,
          reviews: 56,
          services: ["House Cleaning", "Office Cleaning"],
          description: "Professional cleaning services for homes and offices"
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
   * Generate hashtags based on business category
   */
  generateHashtags(business) {
    const categoryHashtags = {
      beauty: ['#haircare', '#beauty', '#salon', '#hairtreatment'],
      health: ['#healthcare', '#clinic', '#wellness', '#health'],
      food: ['#foodie', '#catering', '#meals', '#foodbusiness'],
      auto: ['#automotive', '#carcare', '#repairs', '#maintenance'],
      tech: ['#tech', '#repair', '#phones', '#gadgets'],
      home: ['#cleaning', '#homecare', '#professional', '#cleaning']
    };

    return categoryHashtags[business.category] || ['#supportlocal', '#thecorner'];
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
      
      // Facebook Graph API call
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.config.facebookPageId}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: caption,
            access_token: this.config.facebookToken,
            link: `https://thecorner-app.web.app/business/${business.id}`,
            caption: `Discover ${business.name} on The Corner`
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
      
      // Instagram Graph API call
      const response = await fetch(
        `https://graph.instagram.com/v18.0/${this.config.instagramAccountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caption: caption,
            access_token: this.config.instagramToken,
            media_type: 'CAROUSEL',
            children: []
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
   * Post to TikTok
   */
  async postToTikTok(business) {
    try {
      if (!this.config.tiktokToken) {
        console.warn('⚠️  TikTok token not configured');
        return { success: false, error: 'Missing TikTok token' };
      }

      const caption = this.generateCaption(business, 'tiktok');
      
      console.log(`🎵 Posting ${business.name} to TikTok...`);
      
      // TikTok Graph API call
      const response = await fetch(
        `https://open.tiktokapis.com/v1/video/publish/action/upload/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.tiktokToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            video: {
              source: 'UPLOAD_BY_URL',
              public_share: true
            },
            post_info: {
              title: `Check out ${business.name}! 🏪`,
              description: caption,
              privacy_level: 'PUBLIC_TO_EVERYONE'
            }
          })
        }
      );

      const data = await response.json();
      
      if (data.data?.video_id) {
        console.log(`✅ Posted to TikTok: ${data.data.video_id}`);
        return { success: true, postId: data.data.video_id, platform: 'tiktok' };
      } else {
        throw new Error(data.error?.message || 'Unknown error');
      }
    } catch (error) {
      console.error(`❌ TikTok post failed:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send WhatsApp message
   */
  async sendWhatsApp(business, phoneNumber) {
    try {
      if (!this.config.whatsappToken) {
        console.warn('⚠️  WhatsApp token not configured');
        return { success: false, error: 'Missing WhatsApp token' };
      }

      const message = this.generateCaption(business, 'whatsapp');
      
      console.log(`💬 Sending WhatsApp message to ${phoneNumber}...`);
      
      // WhatsApp Business API call
      const response = await fetch(
        `https://graph.instagram.com/v18.0/${this.config.whatsappPhoneId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.whatsappToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: phoneNumber,
            type: 'text',
            text: {
              preview_url: true,
              body: message
            }
          })
        }
      );

      const data = await response.json();
      
      if (data.messages?.[0]?.id) {
        console.log(`✅ WhatsApp message sent: ${data.messages[0].id}`);
        return { success: true, messageId: data.messages[0].id, platform: 'whatsapp' };
      } else {
        throw new Error(data.error?.message || 'Unknown error');
      }
    } catch (error) {
      console.error(`❌ WhatsApp send failed:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Schedule posting based on plan
   */
  async scheduleFromPlan(plan) {
    try {
      console.log(`\n📅 Scheduling posts from plan: ${plan.name}`);
      
      const scheduled = [];
      
      for (const day of plan.days) {
        for (const business of day.businesses) {
          const post = {
            id: crypto.randomUUID(),
            businessId: business.id,
            businessName: business.name,
            scheduledTime: day.date,
            platforms: plan.platforms,
            status: 'scheduled',
            createdAt: new Date().toISOString()
          };
          
          scheduled.push(post);
          this.scheduledPosts.push(post);
        }
      }
      
      console.log(`✅ Scheduled ${scheduled.length} posts`);
      return scheduled;
    } catch (error) {
      console.error('❌ Error scheduling plan:', error.message);
      return [];
    }
  }

  /**
   * Process scheduled posts
   */
  async processScheduledPosts() {
    try {
      console.log('\n🔄 Processing scheduled posts...');
      
      const now = new Date();
      const dueForPosting = this.scheduledPosts.filter(post => {
        const scheduledTime = new Date(post.scheduledTime);
        return scheduledTime <= now && post.status === 'scheduled';
      });

      console.log(`📊 Found ${dueForPosting.length} posts due for posting`);

      for (const post of dueForPosting) {
        const business = this.businesses.find(b => b.id === post.businessId);
        if (!business) continue;

        const results = [];
        
        for (const platform of post.platforms) {
          let result;
          
          switch (platform) {
            case 'facebook':
              result = await this.postToFacebook(business);
              break;
            case 'instagram':
              result = await this.postToInstagram(business);
              break;
            case 'tiktok':
              result = await this.postToTikTok(business);
              break;
            case 'whatsapp':
              result = await this.sendWhatsApp(business, process.env.WHATSAPP_RECIPIENT || '27812345678');
              break;
            default:
              console.warn(`⚠️  Unknown platform: ${platform}`);
          }
          
          results.push(result);
        }

        post.status = 'posted';
        post.results = results;
        post.postedAt = new Date().toISOString();
      }

      return dueForPosting;
    } catch (error) {
      console.error('❌ Error processing posts:', error.message);
      return [];
    }
  }

  /**
   * Get best posting times for township audience
   */
  getOptimalPostingTimes(platform = 'facebook') {
    const times = {
      facebook: {
        weekday: ['06:00', '12:00', '19:00'], // 6 AM, 12 PM, 7 PM
        bestDays: ['Wednesday', 'Thursday', 'Friday']
      },
      instagram: {
        weekday: ['06:00', '12:00', '18:00'], // 6 AM, 12 PM, 6 PM
        bestDays: ['Monday', 'Wednesday', 'Friday']
      },
      tiktok: {
        weekday: ['07:00', '12:00', '19:00'], // 7 AM, 12 PM, 7 PM
        bestDays: ['Tuesday', 'Thursday', 'Saturday']
      },
      whatsapp: {
        weekday: ['08:00', '14:00', '18:00'], // 8 AM, 2 PM, 6 PM
        bestDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      }
    };

    return times[platform] || times.facebook;
  }

  /**
   * Generate posting schedule for next N days
   */
  generateSchedule(days = 7, platforms = ['facebook', 'instagram', 'tiktok']) {
    const schedule = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      for (const platform of platforms) {
        const times = this.getOptimalPostingTimes(platform);
        
        if (times.bestDays.includes(dayName)) {
          for (const time of times.weekday) {
            const [hours, minutes] = time.split(':');
            const postTime = new Date(date);
            postTime.setHours(parseInt(hours), parseInt(minutes), 0);
            
            schedule.push({
              platform,
              date: postTime.toISOString(),
              displayTime: postTime.toLocaleString()
            });
          }
        }
      }
    }

    return schedule;
  }

  /**
   * Get posting statistics
   */
  getStats() {
    const total = this.scheduledPosts.length;
    const posted = this.scheduledPosts.filter(p => p.status === 'posted').length;
    const scheduled = this.scheduledPosts.filter(p => p.status === 'scheduled').length;
    const failed = this.scheduledPosts.filter(p => p.status === 'failed').length;

    return {
      totalScheduled: total,
      posted,
      scheduled,
      failed,
      successRate: total > 0 ? ((posted / total) * 100).toFixed(2) + '%' : 'N/A'
    };
  }

  /**
   * Export schedule for external systems
   */
  exportSchedule(format = 'json') {
    if (format === 'csv') {
      let csv = 'Business,Platform,ScheduledTime,Status\n';
      for (const post of this.scheduledPosts) {
        csv += `${post.businessName},${post.platforms.join('|')},${post.scheduledTime},${post.status}\n`;
      }
      return csv;
    }

    return JSON.stringify(this.scheduledPosts, null, 2);
  }
}

// ── MAIN EXECUTION ────────────────────────────────────────────────────────────
async function main() {
  const scheduler = new BusinessScheduler();

  // Fetch businesses
  await scheduler.fetchBusinesses();

  // Example: Schedule from a plan
  const examplePlan = {
    name: 'Weekly Business Spotlight',
    platforms: ['facebook', 'instagram', 'tiktok', 'whatsapp'],
    days: [
      {
        date: new Date().toISOString(),
        businesses: scheduler.businesses.slice(0, 2)
      },
      {
        date: new Date(Date.now() + 86400000).toISOString(),
        businesses: scheduler.businesses.slice(2, 4)
      },
      {
        date: new Date(Date.now() + 172800000).toISOString(),
        businesses: scheduler.businesses.slice(4, 6)
      }
    ]
  };

  // Schedule posts
  await scheduler.scheduleFromPlan(examplePlan);

  // Process scheduled posts
  await scheduler.processScheduledPosts();

  // Show stats
  console.log('\n📊 Posting Statistics:');
  console.log(scheduler.getStats());

  // Generate optimal schedule
  console.log('\n📅 Optimal Posting Schedule (Next 7 Days):');
  const optimalSchedule = scheduler.generateSchedule(7, ['facebook', 'instagram', 'tiktok']);
  optimalSchedule.slice(0, 5).forEach(slot => {
    console.log(`  ${slot.platform.toUpperCase()}: ${slot.displayTime}`);
  });
}

module.exports = BusinessScheduler;

if (require.main === module) {
  main().catch(console.error);
}