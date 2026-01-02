import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { email, password, name, role, businessName } = req.body;

    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      businessName: role === 'business' ? businessName : undefined,
      isPaid: false,
      subscriptionPlan: 'free',
      isVerified: true,
      isActive: true,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password field exists and is a valid hash
    if (!user.password) {
      console.error(`[Login] User ${user._id} has no password field`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (error) {
      console.error('[Login] Error comparing password:', error.message);
      console.error('[Login] Password field type:', typeof user.password);
      console.error('[Login] Password field length:', user.password?.length);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!isPasswordValid) {
      console.log(`[Login] Password mismatch for user ${user.email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Upgrade to paid subscription (legacy - now redirects to payment)
// @route   POST /api/auth/upgrade
// @access  Private
// @note    This endpoint is deprecated. Use /api/payments/create-order instead.
export const upgradeToPaid = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already paid
    if (user.isPaid && user.subscriptionEndDate > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'User already has an active subscription'
      });
    }

    // Legacy: For backward compatibility, allow direct upgrade if REVOLUT_API_KEY is not set
    // In production, this should always go through payment flow
    if (!process.env.REVOLUT_API_KEY) {
      // Update subscription (development/testing only)
      user.isPaid = true;
      user.subscriptionPlan = 'pro';
      user.subscriptionStartDate = new Date();
      user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      return res.json({
        success: true,
        message: 'Successfully upgraded to Pro! (Development mode - no payment processed)',
        user: userResponse
      });
    }

    // In production, redirect to payment flow
    return res.status(400).json({
      success: false,
      message: 'Please use /api/payments/create-order to initiate payment',
      redirectTo: '/api/payments/create-order'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error upgrading subscription',
      error: error.message
    });
  }
};

