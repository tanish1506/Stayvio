const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const bookingController = require("../controllers/booking")
const {isLoggedIn , validateBooking , isHost} = require("../middlewares");

//create new booking
router.post("/listings/:id/bookings",isLoggedIn ,validateBooking, wrapAsync(bookingController.createBooking));

//show all bookings
router.get("/bookings",isLoggedIn,wrapAsync(bookingController.getUserBookings));

//particular booking details by ID
router.get("/bookings/:id",isLoggedIn,wrapAsync(bookingController.showBooking));

//delete or cancel booking
router.delete("/bookings/:id",isLoggedIn,wrapAsync(bookingController.cancelBooking));

//approve booking - host only
router.post("/bookings/:id/approve",isLoggedIn,isHost, wrapAsync(bookingController.approveBooking));

//reject booking - host only
router.post("/bookings/:id/reject",isLoggedIn,isHost,wrapAsync(bookingController.rejectBooking));

module.exports = router;