const Booking = require('../models/booking');
const Listing = require('../models/listing');
const User = require('../models/user');

module.exports.createBooking = async (req,res) => {
    const {id } = req.params;
    const {checkIn , checkOut, guests} = req.body;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }

    //checkin checkout validation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const today = new Date();
    today.setHours(0,0,0,0);

    if(checkInDate < today){
        req.flash("error","Check-in date cannot be in the past");
        return res.redirect(`/listings/${id}`);
    }
    if(checkOutDate <= checkInDate){
        req.flash("error",'Check-Out date must be after check-in date');
        return res.redirect(`/listings/${id}`);
    }

    //validate guests
    if(guests < 1){
        req.flash("error",'At least 1 guest is required');
        return res.redirect(`/listings/${id}`);
    }
    if(guests > listing.maxGuests){
        req.flash("error",`Maximum ${listing.maxGuests} guests allowed`);
        return res.redirect(`/listings/${id}`);
    }

    //availability checkiinggg
    const overlappingBookings = await Booking.find({
        listing : id,
        status : { $ne : "cancelled"},
        $or : [{
            checkIn : {$lt : checkOutDate},
            checkOut : {$gt : checkInDate},
        }]
    });
    if(overlappingBookings.length > 0){
        req.flash("error","This listing is not available for selected dates");
        return res.redirect(`/listings/${id}`);
    }

    // cal nights
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000*60*60*24));

    //cal price
    const totalPrice = nights*listing.price;

    //create booking
    const newBooking = new Booking({
        user : req.user._id,
        listing : id,
        checkIn : checkInDate,
        checkOut : checkOutDate,
        guests: guests,
        nights : nights,
        totalPrice : totalPrice,
        status : 'pending_approval',
        paymentStatus : 'pending'
    });


    await newBooking.save();

    await User.findByIdAndUpdate(req.user._id,{
        $push: {bookings : newBooking._id}
    });

    await Listing.findByIdAndUpdate(id , {
        $push : {bookings : newBooking._id}
    });

    req.flash("sucess",'Booking created successfully! Please complete payment.');
    res.redirect(`/bookings/${newBooking._id}`);
}

module.exports.getUserBookings = async(req,res) => {
    const bookings = await Booking.find({user : req.user._id}).populate('listing').sort({createdAt : -1});
    res.render("bookings/index.ejs",{bookings});
};

module.exports.showBooking = async(req,res) => {
    const {id} = req.params;

    //booking dhundhna 
    const booking = await Booking.findById(id).populate('user').populate({path : 'listing',populate : {path : 'owner'}});

    if(!booking){
        req.flash('error',"Booking Not Found!!");
        return res.redirect("/bookings");
    }

    res.render("bookings/show.ejs",{booking});
};

module.exports.cancelBooking = async(req,res) => {
    const {id} = req.params;
    const booking = await Booking.findById(id).populate('listing');

    if(!booking){
        req.flash("error","Booking not found");
        return res.redirect("/bookings");
    }

    if(!booking.user.equals(req.user._id)){
        req.flash("error","You don't have permission to cancel this booking");
        return res.redirect("/bookings");
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    if(new Date(booking.checkIn) < today){
        req.flash("error","Cannot cancel past bookings");
        return res.redirect("/bookings");
    }

    booking.status = "cancelled";
    await booking.save();
    req.flash("sucess","Booking cancelled successfully");
    res.redirect("/bookings");
}

module.exports.approveBooking = async (req,res) => {
    const {id} = req.params;
    const booking = await Booking.findById(id).populate('listing');

    if(!booking){
        req.flash("error","Booking not found");
        return res.redirect("/dashboard")
    }

    // checkin listing's owner 
    if(!booking.listing.owner.equals(req.user._id)){
        req.flash("error","You don't have permission to approve this booking");
        return res.redirect("/dashboard");
    }

    booking.status = 'pending_payment';
    await booking.save();

    req.flash("sucess","Booking approved! Guest can now make payment");
    res.redirect("/dashboard");
}

module.exports.rejectBooking = async(req,res)=>{
    const {id} = req.params;
    const booking = await Booking.findById(id).populate('listing');

    if(!booking){
        req.flash("error","Booking not found");
        res.redirect("/dashboard");
    }

    if(!booking.listing.owner.equals(req.user._id)){
        req.flash("error","you don't have permission to reject this booking");
        res.redirect("/dashboard");
    }

    booking.status = 'cancelled';
    await booking.save();

    req.flash("sucess","Booking rejected.");
    res.redirect("/dashboard");
}