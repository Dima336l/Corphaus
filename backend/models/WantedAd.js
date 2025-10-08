import mongoose from 'mongoose';

const wantedAdSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: String,  // Using String for now (mock auth), change to ObjectId when implementing real auth
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  businessEmail: {
    type: String,
    required: true
  },
  
  // Business Information
  businessType: {
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
    ],
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  
  // Property Requirements
  propertyType: {
    type: String,
    enum: ['Detached', 'Semi-Detached', 'Terraced', 'Block of Flats', 'Any', '']
  },
  minBedrooms: {
    type: Number,
    default: 0
  },
  minEnSuites: {
    type: Number,
    default: 0
  },
  minStudioRooms: {
    type: Number,
    default: 0
  },
  minKitchens: {
    type: Number,
    default: 0
  },
  minReceptionRooms: {
    type: Number,
    default: 0
  },
  
  // Required Features
  needsOutdoorSpace: {
    type: Boolean,
    default: false
  },
  needsParking: {
    type: Boolean,
    default: false
  },
  preferFurnished: {
    type: Boolean,
    default: false
  },
  needsWheelchairAccessible: {
    type: Boolean,
    default: false
  },
  needsAlterationsAllowed: {
    type: Boolean,
    default: false
  },
  
  // Location Preferences
  preferredLocation: {
    type: String,
    required: true
  },
  preferredPostcodes: {
    type: String
  },
  
  // Regulations
  useClass: {
    type: String
  },
  minEpcRating: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Any']
  },
  needsHMOLicence: {
    type: Boolean,
    default: false
  },
  hmoLicenceFor: {
    type: Number,
    default: 0
  },
  
  // Budget & Terms
  maxBudget: {
    type: String
  },
  desiredLeaseLength: {
    type: String
  },
  
  // Additional Info
  description: {
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
wantedAdSchema.index({ preferredLocation: 1 });
wantedAdSchema.index({ businessType: 1 });
wantedAdSchema.index({ userId: 1 });

const WantedAd = mongoose.model('WantedAd', wantedAdSchema);

export default WantedAd;

