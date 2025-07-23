const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdminUser = async () => {
  try {
    console.log('🌱 Seeding admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findByEmail('admin@taskmanager.com');
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    const adminUser = await User.createUser({
      username: 'admin',
      email: 'admin@taskmanager.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@taskmanager.com');
    console.log('🔐 Password: Admin123!');
    
    return adminUser;
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  }
};

const seedDemoUser = async () => {
  try {
    console.log('🌱 Seeding demo user...');
    
    // Check if demo user already exists
    const existingDemo = await User.findByEmail('demo@taskmanager.com');
    if (existingDemo) {
      console.log('✅ Demo user already exists');
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('Demo123!', 12);
    
    const demoUser = await User.createUser({
      username: 'demo',
      email: 'demo@taskmanager.com',
      password: hashedPassword,
      role: 'user'
    });

    console.log('✅ Demo user created successfully');
    console.log('📧 Email: demo@taskmanager.com');
    console.log('🔐 Password: Demo123!');
    
    return demoUser;
  } catch (error) {
    console.error('❌ Error seeding demo user:', error);
    throw error;
  }
};

const seedUsers = async () => {
  try {
    await seedAdminUser();
    await seedDemoUser();
    console.log('🎉 All users seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

module.exports = {
  seedUsers,
  seedAdminUser,
  seedDemoUser
};
