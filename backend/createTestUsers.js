import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testUsers = [
  {
    email: 'landlord@test.com',
    password: 'password123',
    name: 'John Smith Properties',
    role: 'landlord',
    isPaid: false,
    subscriptionPlan: 'free',
    isVerified: true,
    isActive: true,
  },
  {
    email: 'business@test.com',
    password: 'password123',
    name: 'ABC Care Solutions',
    role: 'business',
    businessName: 'ABC Care Solutions Ltd',
    isPaid: false,
    subscriptionPlan: 'free',
    isVerified: true,
    isActive: true,
  },
  {
    email: 'landlord.pro@test.com',
    password: 'password123',
    name: 'Premium Estates Ltd',
    role: 'landlord',
    isPaid: true,
    subscriptionPlan: 'pro',
    subscriptionStartDate: new Date(),
    subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isVerified: true,
    isActive: true,
  },
  {
    email: 'business.pro@test.com',
    password: 'password123',
    name: 'Elite Corporate Housing',
    role: 'business',
    businessName: 'Elite Corporate Housing Ltd',
    isPaid: true,
    subscriptionPlan: 'pro',
    subscriptionStartDate: new Date(),
    subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isVerified: true,
    isActive: true,
  },
];

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing users (optional - comment out to keep existing)
    console.log('🗑️  Clearing existing test users...');
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });

    // Hash passwords and create users
    console.log('📝 Creating test users...');
    
    for (const userData of testUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      
      console.log(`✅ Created ${user.role}: ${user.email}`);
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 Test Accounts:\n');
    
    console.log('👤 FREE LANDLORD:');
    console.log('   Email: landlord@test.com');
    console.log('   Password: password123');
    console.log('   Role: Landlord (Free Plan)\n');
    
    console.log('💼 FREE BUSINESS:');
    console.log('   Email: business@test.com');
    console.log('   Password: password123');
    console.log('   Role: Business (Free Plan)\n');
    
    console.log('👤 PRO LANDLORD:');
    console.log('   Email: landlord.pro@test.com');
    console.log('   Password: password123');
    console.log('   Role: Landlord (Pro Plan - Paid)\n');
    
    console.log('💼 PRO BUSINESS:');
    console.log('   Email: business.pro@test.com');
    console.log('   Password: password123');
    console.log('   Role: Business (Pro Plan - Paid)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers();

