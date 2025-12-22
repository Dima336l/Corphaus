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
      search,
      hasParking,
      wheelchairAccessible,
      furnished 
    } = req.query;
    
    // Build filter object
    let filter = { isActive: true };
    
    if (propertyType) filter.propertyType = propertyType;
    // MongoDB will match if the array contains the businessModel value
    if (businessModel) filter.businessModels = businessModel;
    if (minBedrooms) filter.bedrooms = { $gte: parseInt(minBedrooms) };
    
    // Search by postcode or street address (or both)
    if (search) {
      filter.$or = [
        { postcode: new RegExp(search, 'i') },
        { streetAddress: new RegExp(search, 'i') }
      ];
    } else if (postcode) {
      // Legacy support for postcode parameter
      filter.postcode = new RegExp(postcode, 'i');
    }
    
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
    
    // Validate required fields
    if (!propertyData.userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
        error: 'Authentication required'
      });
    }
    
    if (!propertyData.landlordName || !propertyData.landlordEmail) {
      return res.status(400).json({
        success: false,
        message: 'Landlord name and email are required',
        error: 'Missing landlord information'
      });
    }
    
    if (!propertyData.propertyType || !propertyData.streetAddress || !propertyData.postcode || !propertyData.useClass) {
      return res.status(400).json({
        success: false,
        message: 'Property type, address, postcode, and use class are required',
        error: 'Missing required property information'
      });
    }
    
    // Ensure businessModels is an array
    if (!Array.isArray(propertyData.businessModels)) {
      propertyData.businessModels = [];
    }
    
    // Ensure numbers are properly formatted
    if (propertyData.bedrooms) propertyData.bedrooms = parseInt(propertyData.bedrooms) || 0;
    if (propertyData.enSuites) propertyData.enSuites = parseInt(propertyData.enSuites) || 0;
    if (propertyData.studioRooms) propertyData.studioRooms = parseInt(propertyData.studioRooms) || 0;
    if (propertyData.kitchens) propertyData.kitchens = parseInt(propertyData.kitchens) || 0;
    if (propertyData.receptionRooms) propertyData.receptionRooms = parseInt(propertyData.receptionRooms) || 0;
    if (propertyData.hmoLicenceFor) propertyData.hmoLicenceFor = parseInt(propertyData.hmoLicenceFor) || 0;
    
    // Remove empty strings from optional enum fields (epcRating, leaseLength)
    // Empty strings cause validation errors for enum fields
    if (propertyData.epcRating === '' || propertyData.epcRating === null) {
      delete propertyData.epcRating;
    }
    if (propertyData.leaseLength === '' || propertyData.leaseLength === null) {
      delete propertyData.leaseLength;
    }
    
    const property = await Property.create(propertyData);
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    console.error('Request body:', req.body);
    console.error('User ID:', req.userId);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => {
        // Create user-friendly field names
        const fieldNames = {
          'epcRating': 'EPC Rating',
          'propertyType': 'Property Type',
          'streetAddress': 'Street Address',
          'postcode': 'Postcode',
          'useClass': 'Use Class',
          'landlordName': 'Landlord Name',
          'landlordEmail': 'Landlord Email',
          'businessModels': 'Business Models',
          'leaseLength': 'Lease Length'
        };
        
        // Create user-friendly error messages
        let friendlyMessage = err.message;
        if (err.kind === 'enum') {
          friendlyMessage = `Please select a valid ${fieldNames[err.path] || err.path} option`;
        } else if (err.kind === 'required') {
          friendlyMessage = `${fieldNames[err.path] || err.path} is required`;
        }
        
        return {
          field: err.path,
          fieldName: fieldNames[err.path] || err.path,
          message: friendlyMessage,
          value: err.value
        };
      });
      
      console.error('Validation errors:', validationErrors);
      
      // Create a user-friendly error message
      const errorMessages = validationErrors.map(err => `• ${err.fieldName}: ${err.message}`).join('\n');
      
      return res.status(400).json({
        success: false,
        message: 'Please fix the following errors:\n' + errorMessages,
        error: error.message,
        details: validationErrors
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating property',
      error: error.message,
      errorName: error.name
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

