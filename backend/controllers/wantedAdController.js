import WantedAd from '../models/WantedAd.js';

// @desc    Get all wanted ads
// @route   GET /api/wanted-ads
// @access  Public
export const getAllWantedAds = async (req, res) => {
  try {
    const { 
      businessType,
      minBedrooms,
      location,
      wheelchairAccessible
    } = req.query;
    
    // Build filter object
    let filter = { isActive: true };
    
    if (businessType) filter.businessType = businessType;
    if (minBedrooms) filter.minBedrooms = { $gte: parseInt(minBedrooms) };
    if (location) filter.preferredLocation = new RegExp(location, 'i');
    if (wheelchairAccessible === 'true') filter.needsWheelchairAccessible = true;
    
    const wantedAds = await WantedAd.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: wantedAds.length,
      data: wantedAds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wanted ads',
      error: error.message
    });
  }
};

// @desc    Get single wanted ad
// @route   GET /api/wanted-ads/:id
// @access  Public
export const getWantedAdById = async (req, res) => {
  try {
    const wantedAd = await WantedAd.findById(req.params.id);
    
    if (!wantedAd) {
      return res.status(404).json({
        success: false,
        message: 'Wanted ad not found'
      });
    }
    
    res.json({
      success: true,
      data: wantedAd
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wanted ad',
      error: error.message
    });
  }
};

// @desc    Create new wanted ad
// @route   POST /api/wanted-ads
// @access  Private (Businesses only)
export const createWantedAd = async (req, res) => {
  try {
    // Add userId from auth middleware
    const wantedAdData = {
      ...req.body,
      userId: req.userId
    };
    
    // Validate required fields
    if (!wantedAdData.userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
        error: 'Authentication required'
      });
    }
    
    if (!wantedAdData.businessName || !wantedAdData.businessEmail || !wantedAdData.companyName) {
      return res.status(400).json({
        success: false,
        message: 'Business name, email, and company name are required',
        error: 'Missing business information'
      });
    }
    
    if (!wantedAdData.businessType || !wantedAdData.preferredLocation) {
      return res.status(400).json({
        success: false,
        message: 'Business type and preferred location are required',
        error: 'Missing required wanted ad information'
      });
    }
    
    // Ensure numbers are properly formatted
    if (wantedAdData.minBedrooms) wantedAdData.minBedrooms = parseInt(wantedAdData.minBedrooms) || 0;
    if (wantedAdData.minEnSuites) wantedAdData.minEnSuites = parseInt(wantedAdData.minEnSuites) || 0;
    if (wantedAdData.minStudioRooms) wantedAdData.minStudioRooms = parseInt(wantedAdData.minStudioRooms) || 0;
    if (wantedAdData.minKitchens) wantedAdData.minKitchens = parseInt(wantedAdData.minKitchens) || 0;
    if (wantedAdData.minReceptionRooms) wantedAdData.minReceptionRooms = parseInt(wantedAdData.minReceptionRooms) || 0;
    if (wantedAdData.hmoLicenceFor) wantedAdData.hmoLicenceFor = parseInt(wantedAdData.hmoLicenceFor) || 0;
    
    const wantedAd = await WantedAd.create(wantedAdData);
    
    res.status(201).json({
      success: true,
      message: 'Wanted ad created successfully',
      data: wantedAd
    });
  } catch (error) {
    console.error('Error creating wanted ad:', error);
    console.error('Request body:', req.body);
    console.error('User ID:', req.userId);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      console.error('Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: validationErrors
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating wanted ad',
      error: error.message,
      errorName: error.name
    });
  }
};

// @desc    Update wanted ad
// @route   PUT /api/wanted-ads/:id
// @access  Private (Owner only)
export const updateWantedAd = async (req, res) => {
  try {
    let wantedAd = await WantedAd.findById(req.params.id);
    
    if (!wantedAd) {
      return res.status(404).json({
        success: false,
        message: 'Wanted ad not found'
      });
    }
    
    // Check if user owns this wanted ad
    if (wantedAd.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this wanted ad'
      });
    }
    
    wantedAd = await WantedAd.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Wanted ad updated successfully',
      data: wantedAd
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating wanted ad',
      error: error.message
    });
  }
};

// @desc    Delete wanted ad
// @route   DELETE /api/wanted-ads/:id
// @access  Private (Owner only)
export const deleteWantedAd = async (req, res) => {
  try {
    const wantedAd = await WantedAd.findById(req.params.id);
    
    if (!wantedAd) {
      return res.status(404).json({
        success: false,
        message: 'Wanted ad not found'
      });
    }
    
    // Check if user owns this wanted ad
    if (wantedAd.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this wanted ad'
      });
    }
    
    await WantedAd.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Wanted ad deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting wanted ad',
      error: error.message
    });
  }
};

// @desc    Get user's wanted ads
// @route   GET /api/wanted-ads/my/listings
// @access  Private
export const getMyWantedAds = async (req, res) => {
  try {
    const wantedAds = await WantedAd.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: wantedAds.length,
      data: wantedAds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your wanted ads',
      error: error.message
    });
  }
};

