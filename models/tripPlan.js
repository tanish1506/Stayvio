const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripPlanSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    destination : {
        type : String,
        required : true,
    },
    sourceCity : {
        type : String,
    },
    transportPreference : {
        type : String,
        enum : ['cheapest','fastest','no_preference'],
    },
    totalBudget : {
        type : Number,
        required : true,
    },
    duration : {
        type : Number,
        required : true,
    },
    travelers : {
        type : Number,
        required : true,
    },
    interests : [{
        type : String,
    }],
    travelDates : {
        checkIn : {type : Date},
        checkOut : {type : Date},
    },
    label : {
        type : String,
        maxlength : 60,
    },
    itinerary : {
        type : Schema.Types.Mixed,
    },
    suggestedListings : [{
        type : Schema.Types.ObjectId,
        ref : "Listing",
    }],
    packingList : [{
        type : String,
    }],
    weatherSummary : {
        type : Schema.Types.Mixed,
    },
    chatHistory : [{
        role : {
            type : String,
            enum : ['user','ai'],
            required: true,
        },
        message : {
            type : String,
            required : true,
        },
        timestamp : {
            type : Date,
            default : Date.now,
        },
    }],

    //public share link token
    shareToken : {
        type : String,
        unique : true,
        sparse : true,
    },

    isPublic : {
        type : Boolean,
        default : false,
    },

    status : {
        type : String,
        enum : ['draft','saved'],
        default : 'draft',
    },
    rating : {
        type : Number,
        min:1,
        max:5,
    },
    feedbackNote : {
        type : String,
        maxlength : 500,
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
});

module.exports = mongoose.model("TripPlan",tripPlanSchema);