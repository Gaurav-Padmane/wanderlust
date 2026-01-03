const mongoose = require('mongoose');
const User = require('../models/user');
const Listing = require('../models/listing');
const Review = require('../models/review');
const initData = require('../init/data');

const mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/wanderlust';

async function reset() {
  try {
    await mongoose.connect(mongoURL);
    console.log('Connected to DB for reset (', mongoURL, ')');

    // Delete existing data
    await Review.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});

    // Create a seeded admin user which will be the owner of seeded listings
    const adminUser = new User({ username: 'seedadmin', email: 'seed@wanderlust.local' });
    await User.register(adminUser, 'ChangeMe123!');

    const ownerId = adminUser._id;

    // Prepare listings with owner assigned
    const docs = initData.data.map(obj => ({ ...obj, owner: ownerId }));
    await Listing.insertMany(docs);

    console.log('Database reset complete. Inserted', docs.length, 'listings.');
    console.log('Seed admin created:', adminUser.username, adminUser.email);
  } catch (err) {
    console.error('Reset DB error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

reset();
