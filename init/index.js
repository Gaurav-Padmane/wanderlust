require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const initData = require("./data.js");

const mongo_url = process.env.MONGO_URI;


async function main() {
  await mongoose.connect(mongo_url);
  console.log("DB connected for seeding");
}

const initDB = async () => {
  // Clear old listings
  await Listing.deleteMany({});

  // Find a real user
  const user = await User.findOne();
  if (!user) {
    console.log("No user found. Create a user first.");
    process.exit(1);
  }

  // Attach real owner to each listing
  const updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: user._id,
  }));

  // Insert listings
  await Listing.insertMany(updatedData);
  console.log("Listings seeded successfully");
};

main()
  .then(initDB)
  .catch((err) => {
    console.error(err);
  });
