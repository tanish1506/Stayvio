const TripPlan = require("../models/tripPlan");
const User = require("../models/user");
const Listing = require("../models/listing");
const geminiClient = require("../utils/geminiClient");
const weatherClient = require("../utils/weatherClient");
const ExpressError = require("../utils/ExpressError");


//Get /trip-planner/new - form view
module.exports.newForm = async (req, res) => {
    //user ki wishlist se suggestions nikalana destination ke
    const user = await User.findById(req.user._id).populate('wishlist');

    const wishlistDestinations = user.wishlist.map(listing => listing.location);

    res.render("tripPlanner/new", { wishlistDestinations });
};

//post /trip-planner - AI se plan banana or save krna 
module.exports.createPlan = async (req, res) => {
    const { destination, totalBudget, duration, travelers, interests, sourceCity, transportPreference, checkIn, checkOut, label } = req.body;

    //input ek obje m pack kr rhe h
    const inputs = {
        destination,
        totalBudget: Number(totalBudget),
        duration: Number(duration),
        travelers: Number(travelers),
        interests: Array.isArray(interests) ? interests : [interests],
        sourceCity: sourceCity || null,
        transportPreference: transportPreference || null,
        travelDates: checkIn ? { checkIn, checkOut } : null,
    };

    //step1 : weather fetch krna
    let weatherSummary = null;
    if (checkIn && checkOut) {
        const coords = await weatherClient.geocode(destination);
        if (coords) {
            weatherSummary = await weatherClient.getForecast(coords.lat, coords.lon, checkIn, checkOut);
        };
        if (!weatherSummary) {
            req.flash("error", 'Weather data unavailable, continuing without it!!');
        }
    }

    // step 2 : Gemini se itinerary banana
    const itinerary = await geminiClient.generateItinerary(inputs, weatherSummary);

    //step3 : packing list banana
    let packingList = [];
    try {
        packingList = await geminiClient.generatePackingList(inputs);
    } catch (e) {
        req.flash("error", 'packing list generation failed , you can regenrate later.');
    }

    //step 4 : DB se matching listing dhundhna jo budget mei fit ho 

    const perNightBudget = (Number(totalBudget) * 0.40) / Number(duration);
    const suggestedListings = await Listing.find({
        $or: [
            { location: { $regex: destination, $options: 'i' } },
            { country: { $regex: destination, $options: 'i' } }
        ],
        price: { $lte: perNightBudget }
    }).sort({ price: 1 }).limit(5);

    //step 5 : Tripplan DB mein save kro
    const newPlan = new TripPlan({
        user: req.user._id,
        destination,
        totalBudget: Number(totalBudget),
        duration: Number(duration),
        travelers: Number(travelers),
        interests: Array.isArray(interests) ? interests : [interests],
        sourceCity: sourceCity || null,
        travelDates: checkIn ? { checkIn, checkOut } : {},
        label: label || null,
        itinerary,
        suggestedListings: suggestedListings.map(l => l._id),
        packingList,
        weatherSummary,
        status: 'draft',
    });

    await newPlan.save();

    //step 6 : User k tripPlans array mein add krna
    await User.findByIdAndUpdate(req.user._id, {
        $push: { tripPlans: newPlan._id }
    });

    req.flash("success", "Trip plan generated successfully");
    res.redirect(`/trip-planner/${newPlan._id}`);
}


// get /trip-planner/:id
module.exports.showPlan = async(req,res) => {
    const plan = await TripPlan.findById(req.params.id).populate("suggestedListings");
    if(!plan) throw new ExpressError(404,"Trip Plan not found");
    res.render("tripPlanner/show",{plan, host: req.get('host'),protocol : req.protocol });
};

// Patch /trip-planner/:id/save
module.exports.savePlan = async(req,res) => {
    await TripPlan.findByIdAndUpdate(req.params.id , {status : "saved"});
    req.flash("success","Trip plan saved!");
    res.redirect(`/trip-planner/${req.params.id}`);
};

// DELETE /trip-planner/:id
module.exports.deletePlan = async(req,res) => {
    const {id} = req.params;
    await TripPlan.findByIdAndDelete(id);
    await User.findByIdAndUpdate(req.user._id, {$pull : {tripPlans : id}});
    req.flash("success","Trip Plan Deleted.");
    res.redirect("/dashboard");
}

//Export PDF
module.exports.exportPdf = async(req,res) => {
    const PDFDocument = require("pdfkit");

    const plan = await TripPlan.findById(req.params.id);
    if(!plan) throw new ExpressError(404 , "Trip Plan not found");

    //PDF document banao
    const doc = new PDFDocument({margin : 50});

    //response header setting - browser kp btao ye pdf h
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition',`attachment; filename="trip-plan-${plan.destination}.pdf"`)

    //pdf response connect
    doc.pipe(res);

    // PDF CONTENT 
    // title
    doc.fontSize(24).font('Helvetica-Bold').text(`Trip Plan : ${plan.destination}`,{align : 'center'});
    doc.moveDown(0.5);
    //basic info
    doc.fontSize(12).font("Helvetica")
        .text(`Budget : Rs.${plan.totalBudget.toLocaleString('en-IN')}`)
        .text(`Duration : ${plan.duration} days`)
        .text(`Travelers: ${plan.travelers}`)
        .text(`Status: ${plan.status}`);
    doc.moveDown(1);

    //Budget breakdown
    doc.fontSize(16).font('Helvetica-Bold').text('Budget Breakdown');
    doc.moveDown(0.3);
    const budget = plan.itinerary.budgetBreakdown;
    doc.fontSize(11).font('Helvetica');
    if (budget.travel) doc.text(`Travel: Rs.${budget.travel}`);
    doc.text(`Accommodation: Rs.${budget.accommodation}`);
    doc.text(`Food: Rs.${budget.food}`);
    doc.text(`Activities: Rs.${budget.activities}`);
    doc.text(`Local Transport: Rs.${budget.localTransport}`);
    doc.moveDown(1);

    //day wise itinerary
    doc.fontSize(16).font('Helvetica-Bold').text('Day-wise Itinerary');
    doc.moveDown(0.3);

    plan.itinerary.dailyItinerary.forEach(day => {
        doc.fontSize(13).font('Helvetica-Bold').text(`Day ${day.day}: ${day.title}`);
        doc.moveDown(0.2);

        if (day.activities && day.activities.length > 0) {
            doc.fontSize(11).font('Helvetica-Bold').text('Activities:');
            day.activities.forEach(act => {
                doc.fontSize(10).font('Helvetica')
                    .text(`  - ${act.name} (${act.duration || ''}) — Rs.${act.cost}`);
            });
        }

        if (day.food && day.food.length > 0) {
            doc.fontSize(11).font('Helvetica-Bold').text('Food:');
            day.food.forEach(f => {
                doc.fontSize(10).font('Helvetica')
                    .text(`  - ${f.place} (${f.meal}) — Rs.${f.cost}`);
            });
        }

        if (day.localTransport) {
            doc.fontSize(10).font('Helvetica').text(`Transport: ${day.localTransport}`);
        }
        doc.moveDown(0.8);
    });

    // Tips
    if (plan.itinerary.tips && plan.itinerary.tips.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('Money Saving Tips');
        doc.moveDown(0.3);
        plan.itinerary.tips.forEach((tip, i) => {
            doc.fontSize(10).font('Helvetica').text(`${i + 1}. ${tip}`);
        });
        doc.moveDown(1);
    }

    // Packing List
    if (plan.packingList && plan.packingList.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('Packing List');
        doc.moveDown(0.3);
        plan.packingList.forEach(item => {
            doc.fontSize(10).font('Helvetica').text(`  [ ] ${item}`);
        });
    }

    // PDF complete karo
    doc.end();
}

//patch regenerate of trip planning
module.exports.regeneratePlan = async(req,res) => {
    const {id} = req.params;

    //existing plan lo
    const plan = await TripPlan.findById(id);
    if(!plan) throw new ExpressError(404, "Trip Plan not found");

    //form se jo fields aaye unhe existing plan k saath merge kro
    const updatedInputs = {
        destination: req.body.destination || plan.destination,
        totalBudget : Number(req.body.totalBudget) || plan.totalBudget,
        duration: Number(req.body.duration) || plan.duration,
        travelers: Number(req.body.travelers) || plan.travelers,
        interests: req.body.interests 
            ? (Array.isArray(req.body.interests) ? req.body.interests : [req.body.interests])
            : plan.interests,
        sourceCity: req.body.sourceCity || plan.sourceCity || null,
        transportPreference: req.body.transportPreference || plan.transportPreference || null,
    };

    //gemini se naya itinerary 
    const newItinerary = await geminiClient.generateItinerary(updatedInputs,null);

    //DB update
    await TripPlan.findByIdAndUpdate(id, {
        ...updatedInputs,
        itinerary : newItinerary,
        status : 'draft',
    })

    //AJAX response
    return res.json({success : true});

}

//patch     toggle share 
module.exports.toggleShare = async(req,res) => {
    const plan = await TripPlan.findById(req.params.id);
    if(!plan) throw new ExpressError(404 , "Trip Plan not found");

    if(!plan.isPublic){
        //share ON karao random token banao
        const crypto = require('crypto');
        const shareToken = crypto.randomBytes(20).toString('hex');
        plan.isPublic = true;
        plan.shareToken = shareToken;
        await plan.save();
        return res.json({
            shareUrl : `/trip-planner/share/${shareToken}`
        });
    }else {
        //share off
        plan.isPublic = false;
        plan.shareToken = null;
        await plan.save();
        return res.json({revoked : true});
    }
}

//get public view
module.exports.shareView = async(req,res) => {
    const plan = await TripPlan.findOne({shareToken : req.params.token}).populate('suggestedListings');
    if(!plan) throw new ExpressError(404, "Shared plan not found or link has been revoked");
    res.render("tripPlanner/share",{plan});
}