import { Settings, Subscriber } from "../models/index.js";

// @desc    Get website lock status
// @route   GET /api/lock/status
// @access  Public
export const getLockStatus = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    res.status(200).json({
      success: true,
      data: {
        isLocked: settings.isWebsiteLocked,
        message: settings.lockMessage,
        image: settings.lockImage,
        updatedAt: settings.updatedAt
      }
    });
  } catch (error) {
    console.error('Get lock status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get lock status.'
    });
  }
};

// @desc    Toggle website lock (Admin only)
// @route   PUT /api/admin/lock/toggle
// @access  Private (Admin only)
export const toggleWebsiteLock = async (req, res) => {
  try {
    const { isLocked, lockMessage, lockImage } = req.body;
    
    const settings = await Settings.getSettings();
    
    // Update lock status
    const updateData = {};
    
    if (typeof isLocked !== 'undefined') {
      updateData.isWebsiteLocked = isLocked;
    }
    
    if (lockMessage) {
      updateData.lockMessage = lockMessage;
    }
    
    if (lockImage) {
      updateData.lockImage = lockImage;
    }
    
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true }
    );
    
    // Log the lock action
    console.log(`Website lock ${updatedSettings.isWebsiteLocked ? 'enabled' : 'disabled'} by admin: ${req.admin.email}`);
    
    res.status(200).json({
      success: true,
      message: `Website lock ${updatedSettings.isWebsiteLocked ? 'enabled' : 'disabled'} successfully.`,
      data: {
        isLocked: updatedSettings.isWebsiteLocked,
        message: updatedSettings.lockMessage,
        image: updatedSettings.lockImage,
        updatedAt: updatedSettings.updatedAt
      }
    });
  } catch (error) {
    console.error('Toggle website lock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update website lock status.'
    });
  }
};

// @desc    Subscribe to newsletter during lock
// @route   POST /api/lock/subscribe
// @access  Public
export const subscribeDuringLock = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email address is required.'
      });
    }
    
    // Check if website is locked
    const settings = await Settings.getSettings();
    if (!settings.isWebsiteLocked) {
      return res.status(400).json({
        success: false,
        message: 'Website is not locked. Newsletter subscription available on main site.'
      });
    }
    
    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: 'You are already subscribed to our newsletter.'
        });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();
        
        return res.status(200).json({
          success: true,
          message: 'Your subscription has been reactivated!'
        });
      }
    }
    
    // Create new subscriber
    await Subscriber.create({
      email: email.toLowerCase(),
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter! We\'ll notify you when we\'re back online.'
    });
  } catch (error) {
    console.error('Subscribe during lock error:', error);
    
    if (error.code === 11000) { // Duplicate key error
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

// @desc    Get lock page data
// @route   GET /api/lock/page-data
// @access  Public
export const getLockPageData = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    // Get subscriber count for display
    const subscriberCount = await Subscriber.countDocuments({ isActive: true });
    
    res.status(200).json({
      success: true,
      data: {
        isLocked: settings.isWebsiteLocked,
        lockMessage: settings.lockMessage,
        lockImage: settings.lockImage,
        subscriberCount,
        storeName: settings.storeName,
        socialLinks: settings.socialLinks || {},
        contactEmail: settings.storeEmail,
        contactPhone: settings.contactPhone
      }
    });
  } catch (error) {
    console.error('Get lock page data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get lock page data.'
    });
  }
};

// @desc    Get website settings (Admin only)
// @route   GET /api/admin/settings
// @access  Private (Admin only)
export const getWebsiteSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get website settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get website settings.'
    });
  }
};

// @desc    Update website settings (Admin only)
// @route   PUT /api/admin/settings
// @access  Private (Admin only)
export const updateWebsiteSettings = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Remove protected fields
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    const settings = await Settings.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Website settings updated successfully.',
      data: settings
    });
  } catch (error) {
    console.error('Update website settings error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update website settings.'
    });
  }
};