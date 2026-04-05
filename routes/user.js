const express = require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middlewares");

const userController = require("../controllers/user");

router.route("/signup")
    //signup get
    .get(userController.renderSignupForm )
    //signup post the user to DB
    .post(wrapAsync(userController.signup))


router.route("/login")
    //login get
    .get(userController.renderLoginForm)
    //login post
    .post(saveRedirectUrl, passport.authenticate('local' , {failureRedirect : '/login' , failureFlash : true}) ,userController.login)

//logout
router.get("/logout",userController.logout)

//profile
router.get("/profile",isLoggedIn,wrapAsync(userController.renderProfile));

//edit profile
router.route("/profile/edit")
    .get(isLoggedIn , userController.renderEditProfile)
    .post(isLoggedIn , wrapAsync(userController.updateProfile))


module.exports = router;