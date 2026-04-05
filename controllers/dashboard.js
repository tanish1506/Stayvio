const Listing = require('../models/listing');
const Booking = require("../models/booking");

module.exports.getHostDashboard = async(req,res) => {
    //listing fetched
    const listings = await Listing.find({owner : req.user._id}).populate({path : 'reviews',populate : {path : 'author'}});
    //listing ids 
    const listingIds = listings.map(l => l._id);

    // listing fetch hui ids k through
    const bookings = await Booking.find({listing : {$in : listingIds } }).populate('listing').populate('user').sort({createdAt : -1});

    const totalEarnings = bookings.filter(b => b.status === 'confirmed').reduce((sum,b) => sum + b.totalPrice , 0);

    const pendingBookings = bookings.filter(b => b.status === 'pending_payment').length;

    const pendingApprovals = bookings.filter(b => b.status === 'pending_approval');

    const allReviews = listings.flatMap(l => l.reviews.map(r => ({...r._doc, listingTitle : l.title})));

    res.render('users/dashboard', {
        listings,
        bookings,
        totalEarnings,
        pendingBookings,
        pendingApprovals,
        allReviews,
        searchQuery : ''
    })
}