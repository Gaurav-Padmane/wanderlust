const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

const reviweController = require("../controllers/review.js")
// middleware 

// Post Route
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(reviweController.crateRoute));

// Delete Review Route

router.delete("/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(reviweController.destroyRoute)
);


module.exports = router;