const Listing = require('../models/listing');
const Booking = require("../models/booking");
const TripPlan = require("../models/tripPlan");


module.exports.getHostDashboard = async(req,res) => {
    const role = req.user.role;

    // Trip plans - sabke liye
    const tripPlans = await TripPlan.find({user : req.user._id}).sort({createdAt: -1});

    // My Booking - sabke liye(as a guest / travelers)
    const myBookings = await Booking.find({user : req.user._id}).populate('listing').sort({createdAt : -1});

    // Host-only data
    let listings = [];
    let bookings = [];
    let totalEarnings = 0;
    let pendingBookings = 0;
    let pendingApprovals = [];
    let allReviews = [];

    if(role === 'host' || role === 'both' || role === 'admin'){
        listings = await Listing.find({ owner : req.user._id }).populate({path : 'reviews' , populate : {path : 'author'}});

        const listingIds = listings.map(l => l._id);

        bookings = await Booking.find({listing : {$in : listingIds }}).populate('listing').populate('user').sort({createdAt : -1});

        totalEarnings = bookings.filter(b => b.status === 'confirmed').reduce((sum,b) => sum + b.totalPrice , 0);

        pendingBookings = bookings.filter(b => b.status === 'pending_payment').length;
        pendingApprovals = bookings.filter(b => b.status === 'pending_approval');
        allReviews = listings.flatMap(l => l.reviews.map(r => ({ ...r._doc, listingTitle : l.title}))
    );
    }

    res.render('users/dashboard',{
        listings,
        bookings,
        myBookings,
        totalEarnings,
        pendingBookings,
        pendingApprovals,
        allReviews,
        tripPlans,
        searchQuery : ''
    })

}