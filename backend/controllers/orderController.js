import { Order, Product, Settings } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

// @desc    Create a new order (Guest checkout)
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      promoCode,
      notes,
    } = req.body;

    // Basic validation
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      !items ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, email, phone, address, items, or payment method.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items must be a non-empty array.",
      });
    }

    // Validate shipping address
    const { street, city, state, country, postalCode } = shippingAddress;
    if (!street || !city || !state || !country || !postalCode) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required.",
      });
    }

    // Validate payment method
    if (!["paystack", "delivery"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Use "paystack" or "delivery".',
      });
    }

    // Calculate total and validate items
    let totalAmount = 0;
    const validatedItems = [];
    const productUpdates = [];

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Each item must have a productId and quantity (min 1).",
        });
      }

      // Get product details
      const product = await Product.findOne({
        _id: productId,
        isActive: true,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found or unavailable.`,
        });
      }

      // Check stock availability (you can add stock field later)
      if (product.stock !== undefined && product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}`,
        });
      }

      // Calculate item total
      const itemTotal = product.price * quantity;
      totalAmount += itemTotal;

      // Add to validated items
      validatedItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity,
        image: product.images[0] || null,
      });

      // Track product updates for stock reduction
      if (product.stock !== undefined) {
        productUpdates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { stock: -quantity } },
          },
        });
      }
    }

    // Validate and apply promo code
    let discountAmount = 0;
    let promoValidation = null;

    if (promoCode) {
      // Get promo code from database
      const promo = await PromoCode.findOne({
        code: promoCode.toUpperCase(),
        isActive: true,
      });

      if (promo) {
        // Validate promo code
        promoValidation = promo.validateAndApply(
          totalAmount,
          validatedItems,
          customerEmail,
        );

        if (promoValidation.valid) {
          discountAmount = promoValidation.discountAmount;
          totalAmount -= discountAmount;

          // Check per user limit
          if (promo.perUserLimit) {
            const userUsage = await Order.countDocuments({
              customerEmail: customerEmail.toLowerCase(),
              "promoCode.code": promo.code,
            });

            if (userUsage >= promo.perUserLimit) {
              return res.status(400).json({
                success: false,
                message:
                  "You have reached the usage limit for this promo code.",
              });
            }
          }

          // Increment promo usage
          promo.usedCount += 1;
          await promo.save();
        }
      }
    }

    // Round total to 2 decimal places
    totalAmount = Math.round(totalAmount * 100) / 100;

    // Create order
    const orderData = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.toLowerCase().trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress,
      items: validatedItems,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "delivery" ? "pending" : "pending",
      orderStatus: "processing",
      notes: notes || "",
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    // Add promo code data if valid
    if (promoValidation && promoValidation.valid) {
      orderData.promoCode = {
        code: promoCode,
        discountAmount,
        discountType: promoValidation.type,
        discountValue: promoValidation.value,
      };
    }

    // Update product stock if needed
    if (productUpdates.length > 0) {
      await Product.bulkWrite(productUpdates);
    }

    // Prepare response based on payment method
    let responseData = {
      success: true,
      message: "Order created successfully.",
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
        },
      },
    };

    // If Paystack payment, initiate payment
    if (paymentMethod === "paystack") {
      const paymentData = await initiatePaystackPayment(order, customerEmail);
      responseData.data.payment = paymentData;
    }

    // TODO: Send order confirmation email

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Create order error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create order. Please try again.'
    });
  }
};

// Helper: Initiate Paystack payment
// const initiatePaystackPayment = async (order, email) => {
//   
//   
  
//   const paystackReference = `PSK-${Date.now()}-${uuidv4().slice(0, 8)}`;
  
//   // Mock Paystack response
//   return {
//     reference: paystackReference,
//     authorizationUrl: `https://paystack.com/pay/${paystackReference}`,
//     amount: order.totalAmount * 100, // Paystack uses kobo (100 kobo = 1 NGN)
//     currency: 'NGN',
//     email: email,
//     metadata: {
//       orderId: order._id.toString(),
//       orderNumber: order.orderNumber
//     }
//   };
// };

// @desc    Get order by ID or order number
// @route   GET /api/orders/:identifier
// @access  Public (with email verification)
export const getOrder = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required to view order details.'
      });
    }

    // Find order by ID or order number
    const order = await Order.findOne({
      $or: [
        { _id: identifier },
        { orderNumber: identifier }
      ],
      customerEmail: email.toLowerCase()
    }).populate('items.productId', 'title images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or email does not match.'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order identifier.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details.'
    });
  }
};

// @desc    Verify Paystack payment
// @route   POST /api/orders/verify-payment
// @access  Public (Paystack webhook)
export const verifyPayment = async (req, res) => {
  try {
    const { reference, status, metadata } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required.'
      });
    }

    
    // const signature = req.headers['x-paystack-signature'];
    // const isValid = verifyPaystackSignature(signature, req.body);
    
    // if (!isValid) {
    //   return res.status(401).json({ success: false, message: 'Invalid signature' });
    // }

    // Find order by Paystack reference (you'd store this when initiating payment)
    const order = await Order.findOne({
      'paystackReference': reference
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found for this payment reference.'
      });
    }

    // Update payment status based on Paystack response
    let paymentStatus = 'failed';
    let orderStatus = order.orderStatus;

    if (status === 'success') {
      paymentStatus = 'completed';
      orderStatus = 'processing';
    } else if (status === 'failed') {
      paymentStatus = 'failed';
      orderStatus = 'cancelled';
    }

    order.paymentStatus = paymentStatus;
    order.orderStatus = orderStatus;
    await order.save();

    // TODO: Send payment confirmation email

    res.status(200).json({
      success: true,
      message: `Payment ${paymentStatus}.`,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus,
        orderStatus
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment.'
    });
  }
};

// @desc    Paystack webhook handler
// @route   POST /api/webhooks/paystack
// @access  Public (Paystack calls this)
export const paystackWebhook = async (req, res) => {
  try {
    // Verify webhook signature
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const signature = req.headers['x-paystack-signature'];
    
    if (!signature) {
      return res.status(401).json({ success: false, message: 'No signature provided' });
    }

    // Verify signature (simplified - use proper verification in production)
    const hash = crypto.createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (hash !== signature) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const event = req.body;
    
    // Handle different Paystack events
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulCharge(event.data);
        break;
      
      case 'charge.failed':
        await handleFailedCharge(event.data);
        break;
      
      case 'transfer.success':
        // Handle successful transfer to vendor
        break;
      
      default:
        console.log(`Unhandled Paystack event: ${event.event}`);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};

// Handle successful charge
const handleSuccessfulCharge = async (chargeData) => {
  try {
    const order = await Order.findOneAndUpdate(
      { paystackReference: chargeData.reference },
      {
        paymentStatus: 'completed',
        orderStatus: 'processing',
        $push: {
          paymentLogs: {
            type: 'charge_success',
            data: chargeData,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    if (order) {
      console.log(`Payment completed for order ${order.orderNumber}`);
      // TODO: Send payment confirmation email
    }
  } catch (error) {
    console.error('Handle successful charge error:', error);
  }
};

// Handle failed charge
const handleFailedCharge = async (chargeData) => {
  try {
    const order = await Order.findOneAndUpdate(
      { paystackReference: chargeData.reference },
      {
        paymentStatus: 'failed',
        orderStatus: 'cancelled',
        $push: {
          paymentLogs: {
            type: 'charge_failed',
            data: chargeData,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    if (order) {
      console.log(`Payment failed for order ${order.orderNumber}`);
      // TODO: Send payment failure email
    }
  } catch (error) {
    console.error('Handle failed charge error:', error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      paymentMethod,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    if (status) {
      filter.orderStatus = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { 'shippingAddress.city': { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute queries
    const [orders, total, stats] = await Promise.all([
      Order.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Order.countDocuments(filter),
      Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
            pendingOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'processing'] }, 1, 0] } },
            completedOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] } },
            averageOrderValue: { $avg: '$totalAmount' }
          }
        }
      ])
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          totalPages,
          currentPage: Number(page),
          limit: Number(limit)
        },
        statistics: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          completedOrders: 0,
          averageOrderValue: 0
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders.'
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, notes } = req.body;

    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Valid order status is required: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus,
        $push: {
          statusHistory: {
            status: orderStatus,
            changedAt: new Date(),
            changedBy: req.admin.email,
            notes: notes || ''
          }
        }
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // TODO: Send status update email to customer

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}.`,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update order status.'
    });
  }
};

// @desc    Update payment status (Admin only)
// @route   PUT /api/admin/orders/:id/payment-status
// @access  Private (Admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Valid payment status is required: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}.`,
      data: order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status.'
    });
  }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/admin/orders/statistics
// @access  Private (Admin only)
export const getOrderStatistics = async (req, res) => {
  try {
    const { period = 'month' } = req.query; // day, week, month, year
    
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

    // Get overall statistics
    const overallStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          pendingOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'processing'] }, 1, 0] } },
          shippedOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'shipped'] }, 1, 0] } },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] } }
        }
      }
    ]);

    // Get recent period statistics
    const recentStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          ordersCount: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          dailyAverage: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Get orders by payment method
    const paymentMethodStats = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get recent orders for dashboard
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customerName totalAmount orderStatus paymentStatus createdAt')
      .lean();

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productTitle: { $first: '$items.title' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: overallStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          pendingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0
        },
        recentPeriod: recentStats[0] || {
          ordersCount: 0,
          revenue: 0,
          dailyAverage: 0
        },
        paymentMethods: paymentMethodStats,
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error('Get order statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics.'
    });
  }
};

// @desc    Get order by ID (Admin only)
// @route   GET /api/admin/orders/:id
// @access  Private (Admin only)
export const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'title images category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get admin order by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order.'
    });
  }
};

// @desc    Export orders (Admin only)
// @route   GET /api/admin/orders/export
// @access  Private (Admin only)
export const exportOrders = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'csv') {
      // Convert to CSV
      const csvData = convertToCSV(orders);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
      return res.send(csvData);
    }

    // Default to JSON
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Export orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export orders.'
    });
  }
};

// Helper: Convert orders to CSV
const convertToCSV = (orders) => {
  const headers = ['Order Number', 'Customer Name', 'Customer Email', 'Total Amount', 'Status', 'Payment Method', 'Payment Status', 'Date'];
  
  let csv = headers.join(',') + '\n';
  
  orders.forEach(order => {
    const row = [
      `"${order.orderNumber}"`,
      `"${order.customerName}"`,
      `"${order.customerEmail}"`,
      order.totalAmount,
      `"${order.orderStatus}"`,
      `"${order.paymentMethod}"`,
      `"${order.paymentStatus}"`,
      `"${new Date(order.createdAt).toISOString().split('T')[0]}"`
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
};
