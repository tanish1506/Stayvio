const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const paymentController = require("../controllers/payment");
const {isLoggedIn} = require("../middlewares");

//create razorpay order
router.post("/bookings/:id/payment/create" , isLoggedIn , wrapAsync(paymentController.createOrder));

//verify
router.post("/payment/verify",isLoggedIn,wrapAsync(paymentController.verifyPayment));

module.exports = router;