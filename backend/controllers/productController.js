import { Product } from "../models/index.js";

// @desc    Get all products (with filtering)
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
      activeOnly = true
    } = req.query;

    // Build filter object
    const filter = {};

    // Only show active products by default
    if (activeOnly === 'true' || activeOnly === true) {
      filter.isActive = true;
    }

    // Filter by category
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages,
      currentPage: Number(page),
      data: products
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products.'
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Check if product is active (unless admin is viewing)
    if (!product.isActive && !req.admin) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product.'
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      category: { $regex: category, $options: 'i' },
      isActive: true
    };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      category,
      count: products.length,
      total,
      totalPages,
      currentPage: Number(page),
      data: products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category.'
    });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories/all
// @access  Public
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true })
      .then(cats => cats.filter(cat => cat && cat.trim() !== ''))
      .then(cats => cats.sort());

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories.'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      images,
      description,
      category,
      isActive = true
    } = req.body;

    // Basic validation
    if (!title || !price || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title, price, and at least one image are required.'
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0.'
      });
    }

    // Create product
    const product = await Product.create({
      title,
      price: Number(price),
      images,
      description: description || '',
      category: category || '',
      isActive
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create product.'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating protected fields
    delete updateData._id;
    delete updateData.rating;
    delete updateData.reviewCount;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Validate price if provided
    if (updateData.price && updateData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0.'
      });
    }

    // Validate images if provided
    if (updateData.images && (!Array.isArray(updateData.images) || updateData.images.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Images must be a non-empty array.'
      });
    }

    // Find and update product
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    
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
      message: 'Failed to update product.'
    });
  }
};

// @desc    Delete product (soft delete by setting isActive to false)
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully.',
      data: product
    });
  } catch (error) {
    console.error('Delete product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete product.'
    });
  }
};

// @desc    Activate product
// @route   PUT /api/products/:id/activate
// @access  Private (Admin only)
export const activateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product activated successfully.',
      data: product
    });
  } catch (error) {
    console.error('Activate product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to activate product.'
    });
  }
};

// @desc    Bulk update products
// @route   PUT /api/products/bulk/update
// @access  Private (Admin only)
export const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, updateData } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required.'
      });
    }

    // Prevent updating protected fields
    delete updateData._id;
    delete updateData.rating;
    delete updateData.reviewCount;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Validate price if provided
    if (updateData.price && updateData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0.'
      });
    }

    // Update products
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updateData,
      { runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} product(s) updated successfully.`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update products error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update products.'
    });
  }
};

// @desc    Get product statistics
// @route   GET /api/products/statistics
// @access  Private (Admin only)
export const getProductStatistics = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          inactiveProducts: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalCategories: { $addToSet: '$category' }
        }
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          activeProducts: 1,
          inactiveProducts: 1,
          averagePrice: { $round: ['$averagePrice', 2] },
          minPrice: 1,
          maxPrice: 1,
          categoryCount: { $size: '$totalCategories' }
        }
      }
    ]);

    // Get category distribution
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true, category: { $ne: '', $exists: true } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          inactiveProducts: 0,
          averagePrice: 0,
          minPrice: 0,
          maxPrice: 0,
          categoryCount: 0
        },
        categories: categoryStats
      }
    });
  } catch (error) {
    console.error('Get product statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product statistics.'
    });
  }
};