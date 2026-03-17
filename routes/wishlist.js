const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middlewares");
const wishlistController = require("../controllers/wishlist");

// View wishlist page
router.get("/", isLoggedIn, wrapAsync(wishlistController.viewWishlist));

// Add to wishlist
router.post("/add/:listingId", isLoggedIn, wrapAsync(wishlistController.addToWishlist));

// Remove from wishlist
router.delete("/remove/:listingId", isLoggedIn, wrapAsync(wishlistController.removeFromWishlist));

// Check if in wishlist (for AJAX)
router.get("/check/:listingId", isLoggedIn, wrapAsync(wishlistController.checkWishlist));

module.exports = router;
