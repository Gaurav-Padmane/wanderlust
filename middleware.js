const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(req.path, ">>", req.originalUrl);
    }
    req.session.redirect = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirect = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);  // missing await!
    if (!listing.owner.equals(res.locals.currUser._id)) {   // ✅ use res.locals.currUser
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {   // ✅ compare with author
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};