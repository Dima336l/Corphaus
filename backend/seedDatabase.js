import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';
import WantedAd from './models/WantedAd.js';

dotenv.config();

// Mock data from frontend
const mockProperties = [
  {
    userId: 'system',
    landlordName: 'John Smith Properties',
    landlordEmail: 'john@smithproperties.co.uk',
    propertyType: 'Detached',
    bedrooms: 8,
    enSuites: 6,
    studioRooms: 2,
    kitchens: 2,
    receptionRooms: 3,
    hasOutdoorSpace: true,
    hasParking: true,
    streetAddress: '45 Riverside Drive',
    postcode: 'SW15 2JQ',
    useClass: 'C2 - Residential Institutions',
    alterationsAllowed: true,
    businessModels: ['Care Home', 'Assisted Living'],
    epcRating: 'B',
    furnished: false,
    wheelchairAccessible: true,
    hasHMOLicence: true,
    hmoLicenceFor: 8,
    desiredRent: '4500',
    leaseLength: '5 years',
    description: 'Spacious detached property perfect for care home use. Recently renovated with modern facilities, wheelchair ramps, and accessible bathrooms throughout. Located in a quiet residential area with excellent transport links.',
  },
  {
    userId: 'system',
    landlordName: 'Metropolitan Estates',
    landlordEmail: 'info@metroestates.com',
    propertyType: 'Semi-Detached',
    bedrooms: 6,
    enSuites: 4,
    studioRooms: 0,
    kitchens: 1,
    receptionRooms: 2,
    hasOutdoorSpace: true,
    hasParking: true,
    streetAddress: '128 Park Lane',
    postcode: 'M1 4BT',
    useClass: 'C4 - HMO (up to 6 people)',
    alterationsAllowed: false,
    businessModels: ['Rent-to-Rent', 'Corporate Lets'],
    epcRating: 'C',
    furnished: true,
    wheelchairAccessible: false,
    hasHMOLicence: true,
    hmoLicenceFor: 6,
    desiredRent: '3200',
    leaseLength: '2 years',
    description: 'Well-maintained HMO property in Manchester city center. Fully furnished and ready for immediate occupancy. Close to universities and major employers.',
  },
  {
    userId: 'system',
    landlordName: 'Capital Properties Ltd',
    landlordEmail: 'lettings@capitalproperties.co.uk',
    propertyType: 'Block of Flats',
    bedrooms: 12,
    enSuites: 8,
    studioRooms: 4,
    kitchens: 3,
    receptionRooms: 2,
    hasOutdoorSpace: false,
    hasParking: true,
    streetAddress: '67 Victoria Street',
    postcode: 'E14 5LQ',
    useClass: 'Sui Generis - HMO (7+ people)',
    alterationsAllowed: true,
    businessModels: ['Emergency Accommodation', 'Serviced Accommodation', 'Corporate Lets'],
    epcRating: 'B',
    furnished: false,
    wheelchairAccessible: true,
    hasHMOLicence: true,
    hmoLicenceFor: 15,
    desiredRent: '6800',
    leaseLength: '3 years',
    description: 'Purpose-built block with multiple self-contained units. Ideal for emergency accommodation or corporate housing. Lift access, CCTV, and on-site parking available.',
  },
];

const mockWantedAds = [
  {
    userId: 'system',
    businessName: 'Sunrise Care Solutions Ltd',
    businessEmail: 'enquiries@sunrisecare.co.uk',
    businessType: 'Care Home',
    companyName: 'Sunrise Care Solutions Ltd',
    propertyType: 'Detached',
    minBedrooms: 6,
    minEnSuites: 4,
    minStudioRooms: 0,
    minKitchens: 1,
    minReceptionRooms: 2,
    needsOutdoorSpace: true,
    needsParking: true,
    preferredLocation: 'London, South West',
    preferredPostcodes: 'SW15, SW19, KT1, KT2',
    useClass: 'C2 - Residential Institutions',
    needsAlterationsAllowed: false,
    minEpcRating: 'C',
    preferFurnished: false,
    needsWheelchairAccessible: true,
    needsHMOLicence: false,
    maxBudget: '5000',
    desiredLeaseLength: '5 years',
    description: 'Established care provider seeking suitable property for new care home facility. We require ground floor access or lift, wide doorways, and space for communal areas. Looking for long-term partnership with understanding landlord.',
  },
  {
    userId: 'system',
    businessName: 'Urban Living Co.',
    businessEmail: 'properties@urbanliving.co.uk',
    businessType: 'Rent-to-Rent',
    companyName: 'Urban Living Co.',
    propertyType: 'Semi-Detached',
    minBedrooms: 4,
    minEnSuites: 2,
    minStudioRooms: 0,
    minKitchens: 1,
    minReceptionRooms: 1,
    needsOutdoorSpace: false,
    needsParking: false,
    preferredLocation: 'Birmingham, Manchester, Leeds',
    preferredPostcodes: 'B1, B2, M1, M2, LS1, LS2',
    useClass: 'C4 - HMO (up to 6 people)',
    needsAlterationsAllowed: false,
    minEpcRating: 'D',
    preferFurnished: false,
    needsWheelchairAccessible: false,
    needsHMOLicence: true,
    hmoLicenceFor: 5,
    maxBudget: '2800',
    desiredLeaseLength: '3 years',
    description: 'Professional rent-to-rent operator with 50+ properties under management. Excellent track record, guaranteed rent, and comprehensive insurance. Looking to expand portfolio in major cities.',
  },
  {
    userId: 'system',
    businessName: 'Excel Corporate Housing',
    businessEmail: 'lettings@excelhousing.com',
    businessType: 'Corporate Lets',
    companyName: 'Excel Corporate Housing',
    propertyType: 'Block of Flats',
    minBedrooms: 8,
    minEnSuites: 6,
    minStudioRooms: 2,
    minKitchens: 2,
    minReceptionRooms: 1,
    needsOutdoorSpace: false,
    needsParking: true,
    preferredLocation: 'London, Central',
    preferredPostcodes: 'EC1, EC2, E1, E14',
    useClass: 'C3 - Dwelling Houses',
    needsAlterationsAllowed: false,
    minEpcRating: 'B',
    preferFurnished: true,
    needsWheelchairAccessible: false,
    needsHMOLicence: false,
    maxBudget: '8000',
    desiredLeaseLength: '2 years',
    description: 'Providing high-quality corporate accommodation for international business travelers and relocating professionals. Seeking modern, well-maintained properties in prime locations with good transport links.',
  },
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Property.deleteMany({});
    await WantedAd.deleteMany({});

    // Insert mock data
    console.log('📝 Inserting mock properties...');
    const properties = await Property.insertMany(mockProperties);
    console.log(`✅ Inserted ${properties.length} properties`);

    console.log('📝 Inserting mock wanted ads...');
    const wantedAds = await WantedAd.insertMany(mockWantedAds);
    console.log(`✅ Inserted ${wantedAds.length} wanted ads`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Total Properties: ${properties.length}`);
    console.log(`📊 Total Wanted Ads: ${wantedAds.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

