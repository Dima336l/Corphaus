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
  subscriptionStartDate: {
    type: Date
  },
  subscriptionEndDate: {
    type: Date
  },
  
  // Stripe Integration (for future)
  stripeCustomerId: {
    type: String
  },
  stripeSubscriptionId: {
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
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Virtual for checking free plan limits
userSchema.virtual('canPostMore').get(function() {
  if (this.isPaid) return true;
  return this.listingsCount < 1; // Free users can post 1 listing
});

const User = mongoose.model('User', userSchema);

export default User;

