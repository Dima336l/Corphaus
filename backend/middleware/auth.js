// Simple authentication middleware
// In production, use JWT tokens
export const authenticate = (req, res, next) => {
  // For now, accept a user ID in headers (mock auth)
  // In production, verify JWT token here
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  req.userId = userId;
  next();
};

// Middleware to check if user is paid subscriber
export const requirePaidSubscription = (req, res, next) => {
  const isPaid = req.headers['x-user-ispaid'] === 'true';
  
  if (!isPaid) {
    return res.status(403).json({
      success: false,
      message: 'This feature requires a paid subscription',
      upgradeUrl: '/pricing'
    });
  }
  
  next();
};

// Check if user can post more listings (free tier limit)
export const checkListingLimit = async (Model) => {
  return async (req, res, next) => {
    const isPaid = req.headers['x-user-ispaid'] === 'true';
    
    if (isPaid) {
      return next(); // Paid users have no limits
    }
    
    // Check if free user has reached limit (1 listing)
    const userListingsCount = await Model.countDocuments({ userId: req.userId });
    
    if (userListingsCount >= 1) {
      return res.status(403).json({
        success: false,
        message: 'Free users can only post 1 listing. Upgrade to Pro for unlimited listings.',
        upgradeUrl: '/pricing'
      });
    }
    
    next();
  };
};

