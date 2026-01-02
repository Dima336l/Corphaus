import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const fixUserPasswords = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`📋 Found ${users.length} users in database\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found in database');
      process.exit(0);
    }

    const defaultPassword = 'password123'; // Default password for all users

    for (const user of users) {
      try {
        // Check if password is already a valid bcrypt hash (starts with $2a$, $2b$, or $2y$)
        const isAlreadyHashed = user.password && (
          user.password.startsWith('$2a$') ||
          user.password.startsWith('$2b$') ||
          user.password.startsWith('$2y$')
        );

        if (isAlreadyHashed) {
          // Test if the current password works
          const testResult = await bcrypt.compare(defaultPassword, user.password);
          if (testResult) {
            console.log(`✅ ${user.email} - Password already correctly hashed`);
            continue;
          }
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        console.log(`✅ ${user.email} - Password reset to: ${defaultPassword}`);
      } catch (error) {
        console.error(`❌ Error updating ${user.email}:`, error.message);
      }
    }

    console.log('\n🎉 Password fix complete!');
    console.log('\n📋 All users now have password: password123');
    console.log('\nYou can now log in with any user email and password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing passwords:', error);
    process.exit(1);
  }
};

fixUserPasswords();

