const User = require("../models/user")


module.exports.renderSignupForm = (req,res) => {
    res.redirect("/listings");
}

module.exports.signup = async (req,res) => {
    try{

        let {username,email,password,role} = req.body;
        const newUser = new User({email,username , role : role || 'guest'});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "Welcome to Stayvio!!");
            res.redirect("/listings");
        })
        
    } catch(e){
         req.flash("error",e.message);
         res.redirect("/listings");
    }
    
}

module.exports.renderLoginForm = (req,res)=>{
    res.redirect("/listings");
}


module.exports.login = async (req,res) => {
     req.flash("success" ,"Welcome back to Stayvio!")
     let redirectUrl = res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl); 
}

module.exports.logout = (req,res,next)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}

module.exports.renderProfile = async (req,res)=>{
    const user = await User.findById(req.user._id)
        .populate({path : 'bookings', populate : {path:'listing'}})
        .populate('wishlist');
    const now = new Date();

    const upcomingJourneys = user.bookings.filter(b => 
        b.listing && 
        new Date(b.checkIn) >= now && 
        b.status !== 'cancelled'
    );

    const pastJourneys = user.bookings.filter(b => 
        b.listing && 
        (new Date(b.checkOut) < now || b.status === 'completed' || b.status === 'cancelled')
    );

    // filter out deleted listings from wishlist
    const activeWishlist = user.wishlist ? user.wishlist.filter(l => l !== null) : [];

    res.render('users/profile',{
        profileUser : user,
        upcomingJourneys,
        pastJourneys,
        activeWishlist,
        searchQuery : ''
    })
}

module.exports.renderEditProfile = (req,res) => {
    res.render('users/editProfile',{profileUser : req.user});
};

module.exports.updateProfile = async (req,res) => {
    const {bio , phone , travelType, budget, travelFrequency,interests, preferredDestinations } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
        bio,
        phone,
        travelType : travelType || '',
        budget : budget || '',
        travelFrequency : travelFrequency || '',
        interests : interests ? (Array.isArray(interests) ? interests : [interests]) : [],
        preferredDestinations : preferredDestinations ? preferredDestinations.split(",").map(d => d.trim()).filter(d => d) : [],
    });
    
    req.flash('success',"Profile Updated!");
    res.redirect("/profile");
}

