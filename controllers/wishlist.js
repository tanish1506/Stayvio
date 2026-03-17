const User = require("../models/user");
const Listing = require("../models/listing");

// View all wishlist items
module.exports.viewWishlist = async (req, res) => {
    // Get current user and populate wishlist with full listing details
    const user = await User.findById(req.user._id).populate('wishlist');
    
    // Render wishlist page with listings
    res.render("wishlist/index.ejs", { 
        wishlistItems: user.wishlist,
        searchQuery: ''
    });
}

// Add listing to wishlist
module.exports.addToWishlist = async (req, res) => {
    const { listingId } = req.params;
    
    // Find current user
    const user = await User.findById(req.user._id);
    
    // Check if listing already in wishlist
    if(user.wishlist.includes(listingId)) {
        req.flash("error", "Listing already in your wishlist!");
        return res.redirect(req.get('referer') || '/listings');
    }
    
    // Add listing ID to wishlist array
    user.wishlist.push(listingId);
    await user.save();
    
    req.flash("sucess", "Added to wishlist!");
    res.redirect(req.get('referer') || '/listings');
}

// Remove listing from wishlist
module.exports.removeFromWishlist = async (req, res) => {
    const { listingId } = req.params;
    
    // $pull removes item from array
    await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: listingId } }
    );
    
    req.flash("sucess", "Removed from wishlist!");
    res.redirect(req.get('referer') || '/wishlist');
}

// Check if listing is in wishlist (for heart icon state)
module.exports.checkWishlist = async (req, res) => {
    const { listingId } = req.params;
    
    const user = await User.findById(req.user._id);
    const isInWishlist = user.wishlist.includes(listingId);
    
    res.json({ isInWishlist });
}
