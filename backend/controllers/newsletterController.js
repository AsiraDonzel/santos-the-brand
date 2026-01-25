import EmailService from "../service/emailService.js";
import { Newsletter, Settings, Subscriber } from "../models/index.js";

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeToNewsletter = async (req, res) => {
  try {
    const { email, name, source = 'website', metadata = {} } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email address is required.'
      });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter.'
        });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.unsubscribedAt = null;
        existingSubscriber.source = source;
        existingSubscriber.metadata = { ...existingSubscriber.metadata, ...metadata };
        if (name) existingSubscriber.name = name;
        await existingSubscriber.save();

        return res.status(200).json({
          success: true,
          message: 'Your subscription has been reactivated!'
        });
      }
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
      name: name || '',
      source,
      metadata
    });

    // TODO: Send welcome email
    // await sendWelcomeEmail(subscriber.email, subscriber.name);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      data: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again.'
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
export const unsubscribeFromNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.'
      });
    }

    const subscriber = await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { 
        isActive: false,
        unsubscribedAt: new Date()
      },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed from our newsletter.'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe. Please try again.'
    });
  }
};

// @desc    Get all subscribers (Admin only)
// @route   GET /api/admin/newsletter/subscribers
// @access  Private (Admin only)
export const getAllSubscribers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status = 'active',
      source,
      search,
      sortBy = 'subscribedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    if (source) {
      filter.source = source;
    }

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute queries
    const [subscribers, total, stats] = await Promise.all([
      Subscriber.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select('-metadata')
        .lean(),
      Subscriber.countDocuments(filter),
      Subscriber.getStats()
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        subscribers,
        pagination: {
          total,
          totalPages,
          currentPage: Number(page),
          limit: Number(limit)
        },
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Get all subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers.'
    });
  }
};

// @desc    Create newsletter campaign (Admin only)
// @route   POST /api/admin/newsletter/campaigns
// @access  Private (Admin only)
export const createCampaign = async (req, res) => {
  try {
    const {
      title,
      subject,
      content,
      template = 'default',
      scheduledFor,
      recipients = 'all',
      segmentCriteria = {},
      previewText,
      tags = [],
      isTest = false,
      testEmails = []
    } = req.body;

    if (!title || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject, and content are required.'
      });
    }

    // Validate scheduled date
    let scheduledDate = null;
    if (scheduledFor) {
      scheduledDate = new Date(scheduledFor);
      if (isNaN(scheduledDate.getTime()) || scheduledDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Scheduled date must be a valid future date.'
        });
      }
    }

    // Create campaign
    const campaign = await NewsletterCampaign.create({
      title,
      subject,
      content,
      template,
      status: scheduledFor ? 'scheduled' : 'draft',
      scheduledFor: scheduledDate,
      recipients,
      segmentCriteria,
      previewText,
      tags,
      isTest,
      testEmails: isTest ? testEmails : [],
      sentBy: req.admin._id
    });

    res.status(201).json({
      success: true,
      message: `Campaign created ${scheduledFor ? 'and scheduled' : 'as draft'}.`,
      data: campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create campaign.'
    });
  }
};

// @desc    Get all campaigns (Admin only)
// @route   GET /api/admin/newsletter/campaigns
// @access  Private (Admin only)
export const getAllCampaigns = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute queries
    const [campaigns, total] = await Promise.all([
      NewsletterCampaign.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('sentBy', 'email')
        .lean(),
      NewsletterCampaign.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        campaigns,
        pagination: {
          total,
          totalPages,
          currentPage: Number(page),
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns.'
    });
  }
};

// @desc    Send test email (Admin only)
// @route   POST /api/admin/newsletter/campaigns/:id/test
// @access  Private (Admin only)
export const sendTestEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { testEmails } = req.body;

    if (!testEmails || !Array.isArray(testEmails) || testEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one test email is required.'
      });
    }

    const campaign = await NewsletterCampaign.findById(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found.'
      });
    }

    const settings = await Settings.getSettings();
    
    // Send test emails
    const results = [];
    for (const email of testEmails) {
      try {
        await EmailService.sendNewsletterTest(
          email,
          campaign.subject,
          campaign.content,
          settings
        );
        results.push({ email, success: true });
      } catch (error) {
        results.push({ email, success: false, error: error.message });
      }
    }

    // Update campaign with test emails
    campaign.testEmails = testEmails;
    await campaign.save();

    res.status(200).json({
      success: true,
      message: 'Test emails sent successfully.',
      data: { results }
    });
  } catch (error) {
    console.error('Send test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test emails.'
    });
  }
};

// @desc    Send newsletter campaign (Admin only)
// @route   POST /api/admin/newsletter/campaigns/:id/send
// @access  Private (Admin only)
export const sendCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { immediate = false } = req.body;

    const campaign = await NewsletterCampaign.findById(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found.'
      });
    }

    if (campaign.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Campaign has already been sent.'
      });
    }

    if (campaign.status === 'sending') {
      return res.status(400).json({
        success: false,
        message: 'Campaign is currently being sent.'
      });
    }

    if (campaign.isTest) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send a test campaign.'
      });
    }

    if (campaign.scheduledFor && campaign.scheduledFor > new Date() && !immediate) {
      return res.status(400).json({
        success: false,
        message: 'Campaign is scheduled for a future date. Use immediate=true to send now.'
      });
    }

    // Get recipients based on campaign settings
    let recipientsFilter = { isActive: true };
    
    if (campaign.recipients === 'segment' && campaign.segmentCriteria) {
      // Apply segment criteria
      // This is a simplified version - expand based on your needs
      if (campaign.segmentCriteria.source) {
        recipientsFilter.source = campaign.segmentCriteria.source;
      }
      if (campaign.segmentCriteria.minEmails) {
        recipientsFilter.emailCount = { $gte: campaign.segmentCriteria.minEmails };
      }
    }

    const subscribers = await Subscriber.find(recipientsFilter)
      .select('email name')
      .lean();

    if (subscribers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No recipients found for this campaign.'
      });
    }

    // Update campaign status
    campaign.status = 'sending';
    campaign.stats.totalRecipients = subscribers.length;
    await campaign.save();

    // Send emails in background (you might want to use a queue like Bull)
    sendCampaignEmailsInBackground(campaign, subscribers, req.admin._id);

    res.status(200).json({
      success: true,
      message: `Campaign is being sent to ${subscribers.length} subscribers.`,
      data: {
        totalRecipients: subscribers.length,
        campaignId: campaign._id
      }
    });
  } catch (error) {
    console.error('Send campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send campaign.'
    });
  }
};

// Background email sending (simplified)
const sendCampaignEmailsInBackground = async (campaign, subscribers, adminId) => {
  try {
    const settings = await Settings.getSettings();
    let sentCount = 0;
    let deliveredCount = 0;
    let openCount = 0;
    let clickCount = 0;

    for (const subscriber of subscribers) {
      try {
        // Generate tracking pixel and links
        const trackingId = `${campaign._id}-${subscriber._id}`;
        const trackingPixel = `${process.env.BACKEND_URL}/api/newsletter/track/open/${trackingId}`;
        const trackedContent = injectTracking(campaign.content, trackingId);

        // Send email
        await EmailService.sendNewsletter(
          subscriber.email,
          subscriber.name,
          campaign.subject,
          trackedContent,
          settings,
          trackingId
        );

        sentCount++;
        deliveredCount++;

        // Update subscriber stats
        await Subscriber.findByIdAndUpdate(subscriber._id, {
          $inc: { emailCount: 1 },
          lastEmailSent: new Date()
        });

        // Update campaign stats every 10 emails
        if (sentCount % 10 === 0) {
          campaign.stats.sentCount = sentCount;
          campaign.stats.deliveredCount = deliveredCount;
          campaign.stats.openCount = openCount;
          campaign.stats.clickCount = clickCount;
          await campaign.save();
        }
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error.message);
        campaign.stats.bounceCount++;
      }
    }

    // Final update
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    campaign.stats.sentCount = sentCount;
    campaign.stats.deliveredCount = deliveredCount;
    campaign.stats.openCount = openCount;
    campaign.stats.clickCount = clickCount;
    await campaign.save();

    console.log(`Campaign ${campaign.title} sent to ${sentCount} subscribers.`);
  } catch (error) {
    console.error('Background email sending error:', error);
    campaign.status = 'failed';
    await campaign.save();
  }
};

// Helper: Inject tracking into content
const injectTracking = (content, trackingId) => {
  // Add tracking pixel
  const trackingPixel = `<img src="${process.env.BACKEND_URL}/api/newsletter/track/open/${trackingId}" width="1" height="1" alt="" style="display:none;">`;
  
  // Add tracking to links (simplified)
  let trackedContent = content.replace(/href="(.*?)"/g, (match, url) => {
    if (url.startsWith('http') && !url.includes('track/click')) {
      return `href="${process.env.BACKEND_URL}/api/newsletter/track/click/${trackingId}?url=${encodeURIComponent(url)}"`;
    }
    return match;
  });

  return trackingPixel + trackedContent;
};

// @desc    Track email open
// @route   GET /api/newsletter/track/open/:trackingId
// @access  Public
export const trackEmailOpen = async (req, res) => {
  try {
    const { trackingId } = req.params;
    
    // Parse tracking ID
    const [campaignId, subscriberId] = trackingId.split('-');
    
    // Update campaign stats
    await NewsletterCampaign.findByIdAndUpdate(campaignId, {
      $inc: { 'stats.openCount': 1 }
    });

    // Update subscriber stats
    await Subscriber.findByIdAndUpdate(subscriberId, {
      $inc: { openCount: 1 }
    });

    // Return transparent 1x1 pixel
    res.set('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  } catch (error) {
    console.error('Track email open error:', error);
    res.status(204).end();
  }
};

// @desc    Track link click
// @route   GET /api/newsletter/track/click/:trackingId
// @access  Public
export const trackLinkClick = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const { url } = req.query;
    
    if (!url) {
      return res.redirect(process.env.FRONTEND_URL || '/');
    }

    // Parse tracking ID
    const [campaignId, subscriberId] = trackingId.split('-');
    
    // Update campaign stats
    await NewsletterCampaign.findByIdAndUpdate(campaignId, {
      $inc: { 'stats.clickCount': 1 }
    });

    // Update subscriber stats
    await Subscriber.findByIdAndUpdate(subscriberId, {
      $inc: { clickCount: 1 }
    });

    // Redirect to original URL
    res.redirect(decodeURIComponent(url));
  } catch (error) {
    console.error('Track link click error:', error);
    res.redirect(process.env.FRONTEND_URL || '/');
  }
};

// @desc    Get newsletter statistics (Admin only)
// @route   GET /api/admin/newsletter/statistics
// @access  Private (Admin only)
export const getNewsletterStatistics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Get subscriber growth
    const subscriberGrowth = await Subscriber.aggregate([
      {
        $match: {
          subscribedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$subscribedAt' },
            month: { $month: '$subscribedAt' },
            day: { $dayOfMonth: '$subscribedAt' }
          },
          newSubscribers: { $sum: 1 },
          unsubscribed: {
            $sum: { $cond: [{ $ne: ['$unsubscribedAt', null] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get campaign performance
    const campaignPerformance = await NewsletterCampaign.aggregate([
      {
        $match: {
          status: 'sent',
          sentAt: { $gte: startDate }
        }
      },
      {
        $project: {
          title: 1,
          subject: 1,
          sentAt: 1,
          'stats.totalRecipients': 1,
          'stats.openCount': 1,
          'stats.clickCount': 1,
          openRate: {
            $cond: [
              { $eq: ['$stats.totalRecipients', 0] },
              0,
              { $multiply: [{ $divide: ['$stats.openCount', '$stats.totalRecipients'] }, 100] }
            ]
          },
          clickRate: {
            $cond: [
              { $eq: ['$stats.totalRecipients', 0] },
              0,
              { $multiply: [{ $divide: ['$stats.clickCount', '$stats.totalRecipients'] }, 100] }
            ]
          }
        }
      },
      { $sort: { sentAt: -1 } },
      { $limit: 10 }
    ]);

    // Get overall stats
    const [subscriberStats, campaignStats] = await Promise.all([
      Subscriber.getStats(),
      NewsletterCampaign.aggregate([
        { $match: { status: 'sent' } },
        {
          $group: {
            _id: null,
            totalCampaigns: { $sum: 1 },
            totalEmailsSent: { $sum: '$stats.sentCount' },
            totalOpens: { $sum: '$stats.openCount' },
            totalClicks: { $sum: '$stats.clickCount' },
            avgOpenRate: { $avg: { $multiply: [{ $divide: ['$stats.openCount', '$stats.sentCount'] }, 100] } },
            avgClickRate: { $avg: { $multiply: [{ $divide: ['$stats.clickCount', '$stats.sentCount'] }, 100] } }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        subscriberGrowth,
        campaignPerformance,
        overall: {
          subscribers: subscriberStats,
          campaigns: campaignStats[0] || {
            totalCampaigns: 0,
            totalEmailsSent: 0,
            totalOpens: 0,
            totalClicks: 0,
            avgOpenRate: 0,
            avgClickRate: 0
          }
        }
      }
    });
  } catch (error) {
    console.error('Get newsletter statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch newsletter statistics.'
    });
  }
};