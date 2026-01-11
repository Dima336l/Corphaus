import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Basic Info
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    // Will be hashed with bcrypt before saving
  },
  name: {
    type: String,
    required: true
  },
  
  // Role
  role: {
    type: String,
    enum: ['landlord', 'business'],
    required: true
  },
  
  // Subscription
  isPaid: {
    type: Boolean,
    default: false
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'expired'
  },
  subscriptionStartDate: {
    type: Date
  },
  subscriptionEndDate: {
    type: Date
  },
  subscriptionCancelAt: {
    type: Date // When subscription will be cancelled (end of billing period)
  },
  
  // Revolut Payment Integration
  revolutCustomerId: {
    type: String
  },
  revolutOrderId: {
    type: String
  },
  revolutPaymentId: {
    type: String
  },
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Business-specific fields
  businessName: {
    type: String,
    // Only required if role is 'business'
  },
  
  // Profile
  phone: {
    type: String
  },
  avatar: {
    type: String // URL to avatar image
  },
  
  // Stats
  listingsCount: {
    type: Number,
    default: 0
  },
  
  // Security
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes
// Note: email index is automatically created by unique: true, so we don't need to declare it again
userSchema.index({ role: 1 });

// Virtual for checking free plan limits
userSchema.virtual('canPostMore').get(function() {
  // Check if user has active subscription (paid and not expired/cancelled)
  const hasActiveSubscription = this.isPaid && 
    this.subscriptionStatus === 'active' && 
    this.subscriptionEndDate && 
    this.subscriptionEndDate > new Date();
  
  if (hasActiveSubscription) return true;
  return this.listingsCount < 1; // Free users can post 1 listing
});

// Method to check if subscription is active
userSchema.methods.hasActiveSubscription = function() {
  return this.isPaid && 
    this.subscriptionStatus === 'active' && 
    this.subscriptionEndDate && 
    this.subscriptionEndDate > new Date();
};

const User = mongoose.model('User', userSchema);

export default User;

