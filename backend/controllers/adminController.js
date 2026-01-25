import { generateToken } from "../utils/generateToken.js";
import { Admin } from "../models/index.js";

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated.'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = generateToken(admin._id, admin.role);

    // Return response with token
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin only)
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// @desc    Create new admin (Superadmin only)
// @route   POST /api/admin
// @access  Private (Superadmin only)
export const createAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists.'
      });
    }

    // Create new admin
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password,
      role: role || 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully.',
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// @desc    Get all admins (Superadmin only)
// @route   GET /api/admin
// @access  Private (Superadmin only)
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// @desc    Update admin status (Superadmin only)
// @route   PUT /api/admin/:id/status
// @access  Private (Superadmin only)
export const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Prevent superadmin from deactivating themselves
    if (id === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own status.'
      });
    }

    const admin = await Admin.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully.`,
      data: admin
    });
  } catch (error) {
    console.error('Update admin status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// @desc    Change password
// @route   PUT /api/admin/change-password
// @access  Private (Admin only)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    // Get admin with password
    const admin = await Admin.findById(req.admin._id);
    
    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// @desc    Logout (client-side token invalidation)
// @route   POST /api/admin/logout
// @access  Private (Admin only)
export const logoutAdmin = async (req, res) => {
  try {
    
    res.status(200).json({
      success: true,
      message: 'Logout successful. Please delete your token on the client side.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};