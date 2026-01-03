if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ quiet: true });
}


const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");

const Listing = require("../models/listing");
const listingController = require("../controllers/listings");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { storage } = require("../cluodConfig.js");

const upload = multer({ storage });

// ------------------- ROUTES -------------------

// All listings
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing)
    );

// Render new listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Search listings
router.get("/search", async (req, res, next) => {
    try {
        // read query from req.query (form method="get" sends params on the query string)
        const query = (req.query && req.query.query) ? String(req.query.query).trim() : "";

        // If query is empty, return no results (do not return all listings)
        if (!query) {
            return res.render("listings/searchResult.ejs", { results: [], query });
        }

        // escape user input for use in a RegExp
        const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const q = new RegExp(escapeRegex(query), "i");

        const filter = {
            $or: [
                { title: q },
                { description: q },
                { location: q }
            ]
        };

        const results = await Listing.find(filter);
        res.render("listings/searchResult.ejs", { results, query });
    } catch (err) {
        // delegate to express error handler
        return next(err);
    }
});

// Show, update, delete single listing
router.route("/:id")
    .get(wrapAsync(listingController.showPage))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        wrapAsync(listingController.destroyListing)
    );

// Render edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;
