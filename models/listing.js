const mongoose = require('mongoose');
const  Review = require("./review");
const { string, required } = require('joi');
const schema =  mongoose.Schema;

const listingSchema = new schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        url : String,
        filename : String
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : schema.Types.ObjectId,
        ref : "User",
    },
    geometry : {
        type : { 
            type : String,
            enum: ['Point'],
            required : true,
        },
        coordinates : {
            type : [Number],
            required : true
        } 
    },
    // New fields for enhanced functionality
    category : {
        type : String,
        enum: ['Trending', 'Rooms', 'Mountains', 'Iconic Cities', 'Castles', 
               'Amazing Pools', 'Camping', 'Farms', 'Arctic', 'Domes', 'Boats'],
        default : 'Trending'
    },
    amenities : {
        type : [String],
        default : []
    },
    propertyType : {
        type : String,
        enum: ['Apartment', 'House', 'Villa', 'Cottage', 'Cabin', 'Hotel', 'Resort', 'Boat', 'Castle', 'Tent'],
        default : 'House'
    },
    maxGuests : {
        type : Number,
        default : 2
    },
    bedrooms : {
        type : Number,
        default : 1
    },
    bathrooms : {
        type : Number,
        default : 1
    },
    bookings : [
        {
            type : schema.Types.ObjectId,
            ref : 'Booking',
        }
    ]
})

listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})


const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing;