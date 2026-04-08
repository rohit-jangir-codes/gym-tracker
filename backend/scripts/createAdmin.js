require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function createAdmin() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.argv[4] || process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error('Usage: node createAdmin.js <email> <password> [name]');
    console.error('   or: ADMIN_EMAIL=... ADMIN_PASSWORD=... node createAdmin.js');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gymtracker');

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log(`Updated existing user ${email} to admin role.`);
  } else {
    await User.create({ name, email, password, role: 'admin' });
    console.log(`Admin user created: ${email}`);
  }

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
