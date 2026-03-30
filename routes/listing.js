const express = require("express")
const router = express.Router()
const Listing = require('../models/listing')
const wrapAsync = require("../utils/wrapAsync");
const {iLoggedIn, isLoggedIn, isOwner , validateListing , isHost} = require("../middlewares.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

const listingController = require("../controllers/listings.js")


router.route("/")
    //index Route
    .get(wrapAsync(listingController.index))
    //create route
    .post(isLoggedIn,isHost, upload.single('listing[image]'),validateListing ,wrapAsync(listingController.createListings))
    
    
//new route
router.get("/new",isLoggedIn,isHost,listingController.renderNewForm)

router.route("/:id")
    //show route
    .get(wrapAsync(listingController.showListings))

    //update route
    .put(isLoggedIn,isHost,isOwner, upload.single('listing[image]'),validateListing ,listingController.updateListings)

    //delete route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListings))

//edit route
router.get("/:id/edit",isLoggedIn,isHost,isOwner,wrapAsync(listingController.editListings))





module.exports = router;