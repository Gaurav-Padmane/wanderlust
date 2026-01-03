const mongoose = require("mongoose");
const Listing = require("../models/listing");

// Show all listings
module.exports.index = async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        next(err);
    }
};

// Render form to create new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show single listing with reviews and owner
module.exports.showPage = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "Invalid listing ID");
            return res.redirect("/listings");
        }

        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author" }
            })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        res.render("listings/show.ejs", { listing });
    } catch (err) {
        next(err);
    }
};

// Create a new listing
module.exports.createListing = async (req, res, next) => {
    try {
        const { path: url, filename } = req.file;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        await newListing.save();
        req.flash("success", "New listing created successfully");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

// Render edit form
module.exports.edit = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "Invalid listing ID");
            return res.redirect("/listings");
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        let originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    } catch (err) {
        next(err);
    }
};

// Update listing
module.exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            { new: true }
        );

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (req.file) {
            listing.image = { url: req.file.path, filename: req.file.filename };
            await listing.save();
        }

        req.flash("success", "Listing updated successfully");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};

// Delete listing
module.exports.destroyListing = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "Invalid listing ID");
            return res.redirect("/listings");
        }

        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        req.flash("success", "Listing deleted successfully");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

// Main page function (safe)
module.exports.mainpage = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.redirect("/listings");
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.redirect("/listings");
        }

        res.render("listings/show.ejs", { listing });
    } catch (err) {
        next(err);
    }
};
