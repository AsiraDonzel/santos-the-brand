import { Review, Product } from "../models/index.js";

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      rating,
      approvedOnly = true
    } = req.query;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Build filter
    const filter = { productId };
    
    if (approvedOnly === 'true' || approvedOnly === true) {
      filter.isApproved = true;
    }
    
    if (rating) {
      filter.rating = Number(rating);
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get reviews with aggregate for stats
    const [reviews, total, ratingStats] = await Promise.all([
      Review.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: { productId, isApproved: true } },
        {
          $group: {
            _id: '$productId',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            ratingDistribution: {
              $push: '$rating'
            }
          }
        }
      ])
    ]);

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (ratingStats.length > 0 && ratingStats[0].ratingDistribution) {
      ratingStats[0].ratingDistribution.forEach(rating => {
        distribution[rating] = (distribution[rating] || 0) + 1;
      });
    }

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          total,
          totalPages,
          currentPage: Number(page),
          limit: Number(limit)
        },
        statistics: {
          averageRating: ratingStats[0]?.averageRating ? 
            parseFloat(ratingStats[0].averageRating.toFixed(1)) : 0,
          totalReviews: ratingStats[0]?.totalReviews || 0,
          ratingDistribution: distribution
        }
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews.'
    });
  }
};

// @desc    Submit a review
// @route   POST /api/products/:productId/reviews
// @access  Public
export const submitReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { customerName, rating, comment } = req.body;

    // Validate input
    if (!customerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and comment are required.'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5.'
      });
    }

    // Validate product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable.'
      });
    }

    // Check if customer has already reviewed this product
    // For guest reviews, we can check by name + product
    const existingReview = await Review.findOne({
      productId,
      customerName: customerName.trim()
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product.'
      });
    }

    // Create review (initially approved for simplicity)
    // You might want to set isApproved: false for admin approval
    const review = await Review.create({
      productId,
      customerName: customerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      isApproved: true // Set to false if you want admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your review!',
      data: review
    });
  } catch (error) {
    console.error('Submit review error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit review.'
    });
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/admin/reviews
// @access  Private (Admin only)
export const getAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      productId,
      isApproved,
      rating,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (productId) {
      filter.productId = productId;
    }
    
    if (isApproved) {
      filter.isApproved = isApproved === 'true';
    }
    
    if (rating) {
      filter.rating = Number(rating);
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get reviews with product details
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('productId', 'title images price')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Review.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    // Get review statistics
    const stats = await Review.aggregate([
      {
        $facet: {
          totalReviews: [{ $count: 'count' }],
          approvedReviews: [{ $match: { isApproved: true } }, { $count: 'count' }],
          pendingReviews: [{ $match: { isApproved: false } }, { $count: 'count' }],
          averageRating: [{ $group: { _id: null, average: { $avg: '$rating' } } }],
          ratingDistribution: [
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          total,
          totalPages,
          currentPage: Number(page),
          limit: Number(limit)
        },
        statistics: {
          totalReviews: stats[0].totalReviews[0]?.count || 0,
          approvedReviews: stats[0].approvedReviews[0]?.count || 0,
          pendingReviews: stats[0].pendingReviews[0]?.count || 0,
          averageRating: stats[0].averageRating[0]?.average ? 
            parseFloat(stats[0].averageRating[0].average.toFixed(1)) : 0,
          ratingDistribution: stats[0].ratingDistribution.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
        }
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews.'
    });
  }
};

// @desc    Update review approval status (Admin only)
// @route   PUT /api/admin/reviews/:id/approve
// @access  Private (Admin only)
export const updateReviewApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isApproved must be a boolean value.'
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    ).populate('productId', 'title');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'unapproved'} successfully.`,
      data: review
    });
  } catch (error) {
    console.error('Update review approval error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID format.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update review.'
    });
  }
};

// @desc    Delete review (Admin only)
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin only)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID format.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete review.'
    });
  }
};

// @desc    Get review statistics (Admin only)
// @route   GET /api/admin/reviews/statistics
// @access  Private (Admin only)
export const getReviewStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get overall statistics
    const overallStats = await Review.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          approvedCount: { 
            $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] } 
          },
          pendingCount: { 
            $sum: { $cond: [{ $eq: ['$isApproved', false] }, 1, 0] } 
          }
        }
      }
    ]);

    // Get top reviewed products
    const topProducts = await Review.aggregate([
      { $match: { ...dateFilter, isApproved: true } },
      {
        $group: {
          _id: '$productId',
          reviewCount: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { reviewCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          productTitle: '$product.title',
          productImage: { $arrayElemAt: ['$product.images', 0] },
          reviewCount: 1,
          averageRating: { $round: ['$averageRating', 1] }
        }
      }
    ]);

    // Get recent reviews
    const recentReviews = await Review.find(dateFilter)
      .populate('productId', 'title images')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        overview: overallStats[0] || {
          totalReviews: 0,
          averageRating: 0,
          approvedCount: 0,
          pendingCount: 0
        },
        topProducts,
        recentReviews
      }
    });
  } catch (error) {
    console.error('Get review statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics.'
    });
  }
};