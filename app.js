


require("dotenv").config();


  // CORE IMPORTS

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");


  // MIDDLEWARE

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");


  // AUTH

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


  // ROUTES

const listingsRouter = require("./routes/listings");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");


  // CONFIG

const PORT = 8080;
const DB_URL = process.env.ATLASDB_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;


  // BASIC SAFETY CHECKS

if (!DB_URL) {
  console.error(" ATLASDB_URL is missing in .env");
  process.exit(1);
}

if (!SESSION_SECRET) {
  console.error("SESSION_SECRET is missing in .env");
  process.exit(1);
}


  // DATABASE CONNECTION

mongoose
  .connect(DB_URL)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => {
    console.error(" MongoDB error:", err);
    process.exit(1);
  });


  // VIEW ENGINE

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


  // APP MIDDLEWARE

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


  // SESSION STORE

const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret: SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.error(" Session store error:", err);
});


  // SESSION CONFIG

app.use(
  session({
    store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  })
);

app.use(flash());


  // PASSPORT CONFIG

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


  // GLOBAL LOCALS

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


  // ROUTES

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


  // 404 HANDLER

app.use((req, res) => {
  res.status(404).render("listings/notFound.ejs");
});


  // ERROR HANDLER

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


  // SERVER

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

module.exports = app;
