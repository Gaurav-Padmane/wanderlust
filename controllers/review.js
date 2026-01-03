const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.crateRoute = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", " Review added");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyRoute = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });  // Remove review reference from the listing        
    await Review.findByIdAndDelete(reviewId); // Delete the actual review
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);

};