import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: String,  // Using String for now (mock auth), change to ObjectId when implementing real auth
    required: true
  },
  landlordName: {
    type: String,
    required: true
  },
  landlordEmail: {
    type: String,
    required: true
  },
  
  // Property Details
  propertyType: {
    type: String,
    enum: ['Detached', 'Semi-Detached', 'Terraced', 'Block of Flats', 'Other'],
    required: true
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  enSuites: {
    type: Number,
    default: 0
  },
  studioRooms: {
    type: Number,
    default: 0
  },
  kitchens: {
    type: Number,
    default: 0
  },
  receptionRooms: {
    type: Number,
    default: 0
  },
  
  // Features
  hasOutdoorSpace: {
    type: Boolean,
    default: false
  },
  hasParking: {
    type: Boolean,
    default: false
  },
  furnished: {
    type: Boolean,
    default: false
  },
  wheelchairAccessible: {
    type: Boolean,
    default: false
  },
  alterationsAllowed: {
    type: Boolean,
    default: false
  },
  
  // Location
  streetAddress: {
    type: String,
    required: true
  },
  postcode: {
    type: String,
    required: true
  },
  
  // Regulations
  useClass: {
    type: String,
    required: true
  },
  epcRating: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Not Rated']
  },
  hasHMOLicence: {
    type: Boolean,
    default: false
  },
  hmoLicenceFor: {
    type: Number,
    default: 0
  },
  
  // Business Models
  businessModels: [{
    type: String,
    enum: [
      'Rent-to-Rent',
      'Care Home',
      'Assisted Living',
      'Corporate Lets',
      'Emergency Accommodation',
      'Serviced Accommodation',
      'Nursery',
      'Other'
    ]
  }],
  
  // Financial
  desiredRent: {
    type: String
  },
  leaseLength: {
    type: String
  },
  
  // Additional Info
  description: {
    type: String
  },
  
  // Photos & Documents (URLs after upload)
  photos: [{
    type: String
  }],
  floorPlan: {
    type: String
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better query performance
propertySchema.index({ postcode: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ businessModels: 1 });
propertySchema.index({ userId: 1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;

