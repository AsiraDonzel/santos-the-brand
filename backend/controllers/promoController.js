import { PromoCode, Order } from "../models/index.js";

// @desc    Validate promo code
// @route   POST /api/promo/validate
// @access  Public
export const validatePromoCode = async (req, res) => {
  try {
    const { code, orderAmount, items = [], customerEmail } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Promo code is required.'
      });
    }

    if (!orderAmount || orderAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid order amount is required.'
      });
    }

    const promo = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true
    });

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code.'
      });
    }

    // Validate promo
    const validation = promo.validateAndApply(orderAmount, items, customerEmail);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promo code applied successfully.',
      data: {
        code: promo.code,
        description: promo.description,
        discountAmount: validation.discountAmount,
        finalAmount: validation.finalAmount,
        discountType: validation.type,
        discountValue: validation.value,
        minPurchaseAmount: promo.minPurchaseAmount,
        maxDiscountAmount: promo.maxDiscountAmount
      }
    });
  } catch (error) {
    console.error('Validate promo code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate promo code.'
    });
  }
};

// @desc    Create promo code (Admin only)
// @route   POST /api/admin/promo
// @access  Private (Admin only)
export const createPromoCode = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType = 'percentage',
      discountValue,
      minPurchaseAmount = 0,
      maxDiscountAmount,
      startDate,
      endDate,
      usageLimit,
      perUserLimit = 1,
      applicableCategories = [],
      excludedCategories = [],
      applicableProducts = [],
      excludedProducts = [],
      customerEmail,
      isSingleUse = false
    } = req.body;

    // Validate required fields
    if (!code || !discountValue) {
      return res.status(400).json({
        success: false,
        message: 'Code and discount value are required.'
      });
    }

    if (discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Discount value must be greater than 0.'
      });
    }

    // Validate discount type specific rules
    if (discountType === 'percentage' && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: 'Percentage discount cannot exceed 100%.'
      });
    }

    // Check if code already exists
    const existingCode = await PromoCode.findOne({ 
      code: code.toUpperCase() 
    });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'Promo code already exists.'
      });
    }

    // Validate dates
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date.'
      });
    }

    // Create promo code
    const promo = await PromoCode.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      usageLimit,
      perUserLimit,
      applicableCategories,
      excludedCategories,
      applicableProducts,
      excludedProducts,
      customerEmail: customerEmail ? customerEmail.toLowerCase() : null,
      isSingleUse,
      createdBy: req.admin._id
    });

    res.status(201).json({
      success: true,
      message: 'Promo code created successfully.',
      data: promo
    });
  } catch (error) {
    console.error('Create promo code error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create promo code.'
    });
  }
};

// @desc    Get all promo codes (Admin only)
// @route   GET /api/admin/promo
// @access  Private (Admin only)
export const getAllPromoCodes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = 'active',
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    if (status === 'active') {
      filter.isActive = true;
      filter.$or = [
        { endDate: { $exists: false } },
        { endDate: { $gt: new Date() } }
      ];
      filter.$or = filter.$or || [];
      filter.$or.push({ startDate: { $lte: new Date() } });
    } else if (status === 'inactive') {
      filter.isActive = false;
    } else if (status === 'expired') {
      filter.endDate = { $lt: new Date() };
    } else if (status === 'upcoming') {
      filter.startDate = { $gt: new Date() };
    }

    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute queries
    const [promoCodes, total, stats] = await Promise.all([
      PromoCode.find(filter)
        .populate('createdBy', 'email')
        .populate('applicableProducts', 'title')
        .populate('excludedProducts', 'title')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      PromoCode.countDocuments(filter),
      PromoCode.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalPromos: { $sum: 1 },
            activePromos: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            totalUses: { $sum: '$usedCount' },
            totalDiscount: { $sum: { $multiply: ['$discountValue', '$usedCount'] } }
          }
        }
      ])
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        promoCodes,
        pagination: {
          total,
          totalPages,
          currentPage: Number(page),
          limit: Number(limit)
        },
        statistics: stats[0] || {
          totalPromos: 0,
          activePromos: 0,
          totalUses: 0,
          totalDiscount: 0
        }
      }
    });
  } catch (error) {
    console.error('Get all promos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promo codes.'
    });
  }
};

// @desc    Get promo code by ID (Admin only)
// @route   GET /api/admin/promo/:id
// @access  Private (Admin only)
export const getPromoCodeById = async (req, res) => {
  try {
    const promo = await PromoCode.findById(req.params.id)
      .populate('createdBy', 'email')
      .populate('applicableProducts', 'title images price')
      .populate('excludedProducts', 'title images price');

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found.'
      });
    }

    // Get usage statistics
    const usageStats = await Order.aggregate([
      {
        $match: {
          'promoCode.code': promo.code
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalDiscount: { $sum: '$promoCode.discountAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        promo,
        usage: usageStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          totalDiscount: 0,
          avgOrderValue: 0
        }
      }
    });
  } catch (error) {
    console.error('Get promo by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid promo code ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promo code.'
    });
  }
};

// @desc    Update promo code (Admin only)
// @route   PUT /api/admin/promo/:id
// @access  Private (Admin only)
export const updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating protected fields
    delete updateData._id;
    delete updateData.code;
    delete updateData.usedCount;
    delete updateData.createdBy;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // If updating code, check for duplicates
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
      const existingCode = await PromoCode.findOne({
        code: updateData.code,
        _id: { $ne: id }
      });

      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: 'Promo code already exists.'
        });
      }
    }

    const promo = await PromoCode.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promo code updated successfully.',
      data: promo
    });
  } catch (error) {
    console.error('Update promo code error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid promo code ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update promo code.'
    });
  }
};

// @desc    Toggle promo code status (Admin only)
// @route   PUT /api/admin/promo/:id/toggle
// @access  Private (Admin only)
export const togglePromoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value.'
      });
    }

    const promo = await PromoCode.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Promo code ${isActive ? 'activated' : 'deactivated'} successfully.`,
      data: promo
    });
  } catch (error) {
    console.error('Toggle promo status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid promo code ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update promo code status.'
    });
  }
};

// @desc    Delete promo code (Admin only)
// @route   DELETE /api/admin/promo/:id
// @access  Private (Admin only)
export const deletePromoCode = async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndDelete(req.params.id);

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promo code deleted successfully.'
    });
  } catch (error) {
    console.error('Delete promo code error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid promo code ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete promo code.'
    });
  }
};

// @desc    Get promo code usage statistics (Admin only)
// @route   GET /api/admin/promo/statistics
// @access  Private (Admin only)
export const getPromoStatistics = async (req, res) => {
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

    // Get promo usage over time
    const usageOverTime = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'promoCode.code': { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
            promoCode: '$promoCode.code'
          },
          orderCount: { $sum: 1 },
          totalDiscount: { $sum: '$promoCode.discountAmount' },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get top performing promos
    const topPromos = await Order.aggregate([
      {
        $match: {
          'promoCode.code': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$promoCode.code',
          usageCount: { $sum: 1 },
          totalDiscount: { $sum: '$promoCode.discountAmount' },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { usageCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'promocodes',
          localField: '_id',
          foreignField: 'code',
          as: 'promoDetails'
        }
      },
      { $unwind: '$promoDetails' },
      {
        $project: {
          code: '$_id',
          description: '$promoDetails.description',
          usageCount: 1,
          totalDiscount: 1,
          totalRevenue: 1,
          avgOrderValue: { $round: ['$avgOrderValue', 2] },
          discountType: '$promoDetails.discountType',
          discountValue: '$promoDetails.discountValue'
        }
      }
    ]);

    // Get overall stats
    const overallStats = await PromoCode.aggregate([
      {
        $group: {
          _id: null,
          totalPromos: { $sum: 1 },
          activePromos: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          totalUses: { $sum: '$usedCount' },
          avgUsagePerPromo: { $avg: '$usedCount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        usageOverTime,
        topPromos,
        overall: overallStats[0] || {
          totalPromos: 0,
          activePromos: 0,
          totalUses: 0,
          avgUsagePerPromo: 0
        }
      }
    });
  } catch (error) {
    console.error('Get promo statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promo statistics.'
    });
  }
};

// @desc    Bulk generate promo codes (Admin only)
// @route   POST /api/admin/promo/bulk-generate
// @access  Private (Admin only)
export const bulkGeneratePromoCodes = async (req, res) => {
  try {
    const {
      prefix = 'PROMO',
      count = 10,
      discountType = 'percentage',
      discountValue,
      usageLimit = 1,
      expirationDays = 30,
      ...commonData
    } = req.body;

    if (!discountValue) {
      return res.status(400).json({
        success: false,
        message: 'Discount value is required.'
      });
    }

    const promoCodes = [];
    const failedCodes = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      try {
        // Generate unique code
        const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const code = `${prefix}-${randomSuffix}`;

        // Check if code already exists
        const existingCode = await PromoCode.findOne({ code });
        if (existingCode) {
          failedCodes.push({ code, error: 'Code already exists' });
          continue;
        }

        // Calculate expiration date
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + expirationDays);

        // Create promo code
        const promo = await PromoCode.create({
          code,
          discountType,
          discountValue,
          usageLimit,
          endDate,
          ...commonData,
          createdBy: req.admin._id
        });

        promoCodes.push(promo);
      } catch (error) {
        failedCodes.push({ index: i, error: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Generated ${promoCodes.length} promo codes successfully.`,
      data: {
        generated: promoCodes.length,
        failed: failedCodes.length,
        promoCodes,
        failedCodes
      }
    });
  } catch (error) {
    console.error('Bulk generate promos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate promo codes.'
    });
  }
};