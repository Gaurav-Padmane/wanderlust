const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

// SignUp

router.route("/signup")
     .get(userController.signupRender)
     .post(wrapAsync(userController.signup));

// logout

router.route("/login")
     .get(userController.loginRender)
     .post(
          saveRedirectUrl,
          passport.authenticate('local', {
               failureRedirect: "/login",
               failureFlash: true
          }),
          userController.logIn
     );


router.get("/logout", userController.logout);
module.exports = router;
