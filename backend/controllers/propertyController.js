import Property from '../models/Property.js';

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getAllProperties = async (req, res) => {
  try {
    const { 
      propertyType, 
      businessModel, 
      minBedrooms, 
      postcode,
      hasParking,
      wheelchairAccessible,
      furnished 
    } = req.query;
    
    // Build filter object
    let filter = { isActive: true };
    
    if (propertyType) filter.propertyType = propertyType;
    if (businessModel) filter.businessModels = businessModel;
    if (minBedrooms) filter.bedrooms = { $gte: parseInt(minBedrooms) };
    if (postcode) filter.postcode = new RegExp(postcode, 'i');
    if (hasParking === 'true') filter.hasParking = true;
    if (wheelchairAccessible === 'true') filter.wheelchairAccessible = true;
    if (furnished === 'true') filter.furnished = true;
    
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Landlords only)
export const createProperty = async (req, res) => {
  try {
    // Add userId from auth middleware
    const propertyData = {
      ...req.body,
      userId: req.userId
    };
    
    const property = await Property.create(propertyData);
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if user owns this property
    if (property.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }
    
    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner only)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if user owns this property
    if (property.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }
    
    await Property.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
};

// @desc    Get user's properties
// @route   GET /api/properties/my/listings
// @access  Private
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your properties',
      error: error.message
    });
  }
};

