import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';
import WantedAd from './models/WantedAd.js';
import User from './models/User.js';

dotenv.config();

const seedWithUserData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Get test users
    const landlordFree = await User.findOne({ email: 'landlord@test.com' });
    const landlordPro = await User.findOne({ email: 'landlord.pro@test.com' });
    const businessFree = await User.findOne({ email: 'business@test.com' });
    const businessPro = await User.findOne({ email: 'business.pro@test.com' });

    if (!landlordFree || !landlordPro || !businessFree || !businessPro) {
      console.error('❌ Test users not found. Run createTestUsers.js first!');
      process.exit(1);
    }

    console.log('✅ Found all test users');

    // Clear existing data
    console.log('🗑️  Clearing existing properties and wanted ads...');
    await Property.deleteMany({});
    await WantedAd.deleteMany({});

    // Properties for Free Landlord (1 property - at limit)
    console.log('📝 Adding property for Free Landlord...');
    await Property.create({
      userId: landlordFree._id.toString(),
      landlordName: landlordFree.name,
      landlordEmail: landlordFree.email,
      propertyType: 'Semi-Detached',
      bedrooms: 6,
      enSuites: 4,
      studioRooms: 0,
      kitchens: 1,
      receptionRooms: 2,
      hasOutdoorSpace: true,
      hasParking: true,
      streetAddress: '45 Oak Avenue',
      postcode: 'SW15 3QR',
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
      description: 'Well-maintained HMO property. This is my first listing as a free user!',
    });

    // Properties for Pro Landlord (3 properties - showing unlimited)
    console.log('📝 Adding properties for Pro Landlord...');
    await Property.insertMany([
      {
        userId: landlordPro._id.toString(),
        landlordName: landlordPro.name,
        landlordEmail: landlordPro.email,
        propertyType: 'Detached',
        bedrooms: 8,
        enSuites: 6,
        studioRooms: 2,
        kitchens: 2,
        receptionRooms: 3,
        hasOutdoorSpace: true,
        hasParking: true,
        streetAddress: '123 Riverside Drive',
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
        description: 'Spacious detached property perfect for care home use. Pro account - unlimited listings!',
      },
      {
        userId: landlordPro._id.toString(),
        landlordName: landlordPro.name,
        landlordEmail: landlordPro.email,
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
        description: 'Purpose-built block with multiple self-contained units. Second property.',
      },
      {
        userId: landlordPro._id.toString(),
        landlordName: landlordPro.name,
        landlordEmail: landlordPro.email,
        propertyType: 'Terraced',
        bedrooms: 5,
        enSuites: 3,
        studioRooms: 0,
        kitchens: 1,
        receptionRooms: 2,
        hasOutdoorSpace: true,
        hasParking: false,
        streetAddress: '89 Park Lane',
        postcode: 'M1 4BT',
        useClass: 'C3 - Dwelling Houses',
        alterationsAllowed: false,
        businessModels: ['Corporate Lets', 'Rent-to-Rent'],
        epcRating: 'D',
        furnished: true,
        wheelchairAccessible: false,
        hasHMOLicence: false,
        hmoLicenceFor: 0,
        desiredRent: '2800',
        leaseLength: '1 year',
        description: 'Fully furnished terraced house in city center. Third property - Pro unlimited!',
      },
    ]);

    // Wanted Ad for Free Business (1 ad - at limit)
    console.log('📝 Adding wanted ad for Free Business...');
    await WantedAd.create({
      userId: businessFree._id.toString(),
      businessName: businessFree.businessName,
      businessEmail: businessFree.email,
      businessType: 'Care Home',
      companyName: businessFree.businessName,
      propertyType: 'Detached',
      minBedrooms: 6,
      minEnSuites: 4,
      minStudioRooms: 0,
      minKitchens: 1,
      minReceptionRooms: 2,
      needsOutdoorSpace: true,
      needsParking: true,
      preferredLocation: 'London, South West',
      preferredPostcodes: 'SW15, SW19, KT1',
      useClass: 'C2 - Residential Institutions',
      needsAlterationsAllowed: false,
      minEpcRating: 'C',
      preferFurnished: false,
      needsWheelchairAccessible: true,
      needsHMOLicence: false,
      maxBudget: '5000',
      desiredLeaseLength: '5 years',
      description: 'Looking for suitable property for our care home. This is my first wanted ad on the free plan!',
    });

    // Wanted Ads for Pro Business (3 ads - showing unlimited)
    console.log('📝 Adding wanted ads for Pro Business...');
    await WantedAd.insertMany([
      {
        userId: businessPro._id.toString(),
        businessName: businessPro.businessName,
        businessEmail: businessPro.email,
        businessType: 'Corporate Lets',
        companyName: businessPro.businessName,
        propertyType: 'Block of Flats',
        minBedrooms: 8,
        minEnSuites: 6,
        minStudioRooms: 2,
        minKitchens: 2,
        minReceptionRooms: 1,
        needsOutdoorSpace: false,
        needsParking: true,
        preferredLocation: 'London, Central',
        preferredPostcodes: 'EC1, EC2, E1',
        useClass: 'C3 - Dwelling Houses',
        needsAlterationsAllowed: false,
        minEpcRating: 'B',
        preferFurnished: true,
        needsWheelchairAccessible: false,
        needsHMOLicence: false,
        maxBudget: '8000',
        desiredLeaseLength: '2 years',
        description: 'Seeking modern properties for corporate housing. Pro account - first of many!',
      },
      {
        userId: businessPro._id.toString(),
        businessName: businessPro.businessName,
        businessEmail: businessPro.email,
        businessType: 'Rent-to-Rent',
        companyName: businessPro.businessName,
        propertyType: 'Semi-Detached',
        minBedrooms: 4,
        minEnSuites: 2,
        minStudioRooms: 0,
        minKitchens: 1,
        minReceptionRooms: 1,
        needsOutdoorSpace: false,
        needsParking: false,
        preferredLocation: 'Manchester, Birmingham',
        preferredPostcodes: 'M1, M2, B1, B2',
        useClass: 'C4 - HMO (up to 6 people)',
        needsAlterationsAllowed: false,
        minEpcRating: 'D',
        preferFurnished: false,
        needsWheelchairAccessible: false,
        needsHMOLicence: true,
        hmoLicenceFor: 5,
        maxBudget: '2500',
        desiredLeaseLength: '3 years',
        description: 'Expanding our rent-to-rent portfolio. Second wanted ad!',
      },
      {
        userId: businessPro._id.toString(),
        businessName: businessPro.businessName,
        businessEmail: businessPro.email,
        businessType: 'Nursery',
        companyName: businessPro.businessName,
        propertyType: 'Detached',
        minBedrooms: 4,
        minEnSuites: 1,
        minStudioRooms: 0,
        minKitchens: 1,
        minReceptionRooms: 3,
        needsOutdoorSpace: true,
        needsParking: true,
        preferredLocation: 'London, West',
        preferredPostcodes: 'W1, W2, W3',
        useClass: 'C3 - Dwelling Houses',
        needsAlterationsAllowed: true,
        minEpcRating: 'B',
        preferFurnished: false,
        needsWheelchairAccessible: true,
        needsHMOLicence: false,
        maxBudget: '4000',
        desiredLeaseLength: 'Negotiable',
        description: 'Looking for property to convert to nursery. Pro unlimited - third ad!',
      },
    ]);

    // Add some general marketplace listings (no specific user)
    console.log('📝 Adding general marketplace listings...');
    await Property.create({
      userId: 'marketplace',
      landlordName: 'General Marketplace Listing',
      landlordEmail: 'marketplace@corphaus.com',
      propertyType: 'Semi-Detached',
      bedrooms: 5,
      enSuites: 3,
      studioRooms: 0,
      kitchens: 1,
      receptionRooms: 1,
      hasOutdoorSpace: true,
      hasParking: true,
      streetAddress: '234 High Street',
      postcode: 'LS1 2AB',
      useClass: 'C3 - Dwelling Houses',
      alterationsAllowed: true,
      businessModels: ['Corporate Lets', 'Serviced Accommodation'],
      epcRating: 'C',
      furnished: false,
      wheelchairAccessible: false,
      hasHMOLicence: false,
      hmoLicenceFor: 0,
      desiredRent: '2200',
      leaseLength: 'Negotiable',
      description: 'Available property on the marketplace - contact us for details!',
    });

    await WantedAd.create({
      userId: 'marketplace',
      businessName: 'Marketplace Business',
      businessEmail: 'business@corphaus.com',
      businessType: 'Emergency Accommodation',
      companyName: 'Emergency Housing Services',
      propertyType: '',
      minBedrooms: 3,
      minEnSuites: 2,
      minStudioRooms: 0,
      minKitchens: 1,
      minReceptionRooms: 1,
      needsOutdoorSpace: false,
      needsParking: true,
      preferredLocation: 'London, Any',
      preferredPostcodes: '',
      useClass: '',
      needsAlterationsAllowed: false,
      minEpcRating: 'D',
      preferFurnished: false,
      needsWheelchairAccessible: false,
      needsHMOLicence: false,
      maxBudget: '3000',
      desiredLeaseLength: '1 year',
      description: 'Urgently seeking properties for emergency accommodation program.',
    });

    // Update user listing counts
    await User.findByIdAndUpdate(landlordFree._id, { listingsCount: 1 });
    await User.findByIdAndUpdate(landlordPro._id, { listingsCount: 3 });
    await User.findByIdAndUpdate(businessFree._id, { listingsCount: 1 });
    await User.findByIdAndUpdate(businessPro._id, { listingsCount: 3 });

    const propertiesCount = await Property.countDocuments();
    const wantedAdsCount = await WantedAd.countDocuments();

    console.log('\n🎉 Database seeded with user-specific data!');
    console.log('\n📊 Summary:');
    console.log(`   Total Properties: ${propertiesCount}`);
    console.log(`   Total Wanted Ads: ${wantedAdsCount}`);
    console.log('\n👤 User Listings:');
    console.log(`   Free Landlord (landlord@test.com): 1 property (at free limit)`);
    console.log(`   Pro Landlord (landlord.pro@test.com): 3 properties (unlimited)`);
    console.log(`   Free Business (business@test.com): 1 wanted ad (at free limit)`);
    console.log(`   Pro Business (business.pro@test.com): 3 wanted ads (unlimited)`);
    console.log(`   Marketplace: 1 property + 1 wanted ad (general listings)`);

    console.log('\n✅ Ready to test! Log in and see your dashboard with listings!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedWithUserData();

