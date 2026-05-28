const Listing = require("./models/listing");
const Review = require('./models/review');
const TripPlan = require("./models/tripPlan.js");
const ExpressError = require("./utils/ExpressError")
const {listingSchema , reviewSchema , tripPlanSchema} = require("./schema.js")
const {bookingSchema} = require("./schema.js");
 
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
            //redirectUrl save 
            req.session.redirectUrl = req.originalUrl;
            req.flash("error", "you must be logged In!!");
            return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner =async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Owner of this listing!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let  errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

//validation of review schema
module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review!!");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateBooking = (req,res,next) => {
    const {error} = bookingSchema.validate(req.body);
    if(error){
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400,errMsg);
    }else {
        next();
    }
}

module.exports.isHost = (req,res,next)=>{
    if(req.user.role === 'host' || req.user.role === 'both'){
        next();
    }else{
        req.flash("error","You must be a host to perform this action!");
        res.redirect("/listings");
    }
}

module.exports.isAdmin = (req,res,next)=>{
    if(req.user.role === 'admin'){
        next();
    }
    else{
        req.flash("error","Access denied. Admins only.");
        res.redirect("/listings");
    }
}

module.exports.isTripPlanOwner = async(req,res,next)=>{
    const { id } = req.params;

    const plan = await TripPlan.findById(id); //DB for that plan

    if(!plan){
        throw new ExpressError(404,"Trip plan not found");
    }

    if(!plan.user.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to access this trip plan.")
        return res.redirect("/trip-planner/new");
    }

    next();
}

module.exports.validateTripPlan = (req,res,next)=>{
    const {error} = tripPlanSchema.validate(req.body);
    if(error){
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}