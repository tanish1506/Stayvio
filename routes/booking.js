const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const bookingController = require("../controllers/booking")
const {isLoggedIn , validateBooking} = require("../middlewares");

//create new booking
router.post("/listings/:id/bookings",isLoggedIn ,validateBooking, wrapAsync(bookingController.createBooking));

//show all bookings
router.get("/bookings",isLoggedIn,wrapAsync(bookingController.getUserBookings));

//particular booking details by ID
router.get("/bookings/:id",isLoggedIn,wrapAsync(bookingController.showBooking));

//delete or cancel booking
router.delete("/bookings/:id",isLoggedIn,wrapAsync(bookingController.cancelBooking));

module.exports = router;