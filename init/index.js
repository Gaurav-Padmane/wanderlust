const mongoose = require("mongoose");
const Listing = require("../models/listing.js")
const initData = require("./data.js");


mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(() => {
        if (process.env.NODE_ENV !== 'production') console.log("Connected to DB");
    })
    .catch((err) => {
        if (process.env.NODE_ENV !== 'production') console.error(err);
    })
async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async () => {
    await Listing.deleteMany({});
      const updatedData = initData.data.map((obj) => ({
        ...obj,
        owner: "68c45366b175101415f9392a",
    }));
     await Listing.insertMany(updatedData)
    // initialization performed; avoid logging large seed data
}


initDB();