const Listing = require("../models/listing")
const User = require("../models/user")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken})

module.exports.index = async (req,res)=>{
    // Get category and search from query parameters
    // Example: /listings?category=Mountains&search=cabin
    const { category, search ,propertyType , sort} = req.query;
    
    // Build filter object dynamically
    let filter = {};
    
    // Add category filter if provided
    if(category) {
        filter.category = category;
    }
    
    // Add search filter if provided
    if(search) {
        // $or means "match ANY of these conditions"
        // $regex allows partial matching (like SQL LIKE)
        // $options: 'i' makes it case-insensitive
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },           // Search in title
            { description: { $regex: search, $options: 'i' } },     // Search in description
            { location: { $regex: search, $options: 'i' } },        // Search in location
            { country: { $regex: search, $options: 'i' } }          // Search in country
        ];
    }
    
    //propertyType filter
    if(propertyType){
        filter.propertyType = propertyType;
    }

    //sort option
    let sortOption = {};
    if(sort === 'price_asc') sortOption = {price : 1};
    else if(sort === 'price_desc') sortOption = {price : -1};
    else if(sort === 'newest') sortOption = {createdAt : -1};

    const allListings = await Listing.find(filter).sort(sortOption);
    
    // Get user's wishlist if logged in
    let userWishlist = [];
    if(req.user) {
        const user = await User.findById(req.user._id);
        userWishlist = user.wishlist.map(id => id.toString());
    }
    
    // Pass data to view
    res.render("./listings/index.ejs", { 
        allListings, 
        selectedCategory: category || null,
        selectedPropertyType: propertyType || null,
        selectedSort : sort || '',
        searchQuery: search || '',
        currUser: req.user,
        userWishlist: userWishlist
    });
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs", { searchQuery: '' })
}

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested , does not exist!!")
        return res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{listing, searchQuery: ''})
}

module.exports.createListings = async (req,res,next)=>{
    let coordinates = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
        
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = coordinates.body.features[0].geometry;

    // houseRulesText ko array mein convert karo
    if(req.body.listing.houseRulesText){
        newListing.houseRules = req.body.listing.houseRulesText.split('\n').map(r => r.trim()).filter(r => r);
    }
    // amenities array handle
    if(req.body.listing.amenities && !Array.isArray(req.body.listing.amenities)){
        newListing.amenities = [req.body.listing.amenities];
    }
    
    await newListing.save();
    req.flash("sucess", "New Listing Created!!");
    res.redirect("/listings");    
}

module.exports.editListings = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested , does not exist!!")
        return res.redirect("/listings")
    }
    
    //used cloduinary image transformation but if it didnt work added style tag for image size in edit.ejs
    const changedImgUrl = listing.image.url.replace("/upload","/upload/w_250,h_300,c_fill,q_auto,f_auto")
    res.render("listings/edit.ejs",{listing , changedImgUrl, searchQuery: '' });
}

module.exports.updateListings = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    // houseRulesText ko array mein convert karo
    if(req.body.listing.houseRulesText){
        listing.houseRules = req.body.listing.houseRulesText.split('\n').map(r => r.trim()).filter(r => r);
    }
    // amenities array handle
    if(req.body.listing.amenities && !Array.isArray(req.body.listing.amenities)){
        listing.amenities = [req.body.listing.amenities];
    } else if(req.body.listing.amenities) {
        listing.amenities = req.body.listing.amenities;
    }

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
    }
    await listing.save();
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("sucess","Listing Deleted!!")
    res.redirect("/listings")
}