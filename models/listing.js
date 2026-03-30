const mongoose = require('mongoose');
const Review = require("./review");
const { string, required } = require('joi');
const schema = mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    // New fields for enhanced functionality
    category: {
        type: String,
        enum: ['Trending', 'Hill Stations', 'Beaches', 'Heritage', 'Backwaters', 'Forests', 'Desert', 'Pilgrimage', 'Farms', 'Houseboats'],
        default: 'Trending'
    },
    amenities: {
        type: [String],
        default: []
    },
    propertyType: {
        type: String,
        enum: ['Villa', 'Homestay', 'Cabin', 'Beach House', 'Heritage Haveli', 'Apartment', 'Farm Stay', 'Treehouse', 'Houseboat', 'Tent/Glamping'],
        default: 'Homestay'
    },
    maxGuests: {
        type: Number,
        default: 2
    },
    bedrooms: {
        type: Number,
        default: 1
    },
    bathrooms: {
        type: Number,
        default: 1
    },
    images: [
        {
            url: String,
            filename: String,
        }
    ],
    houseRules: {
        type: [String],
        default: []
    },
    cancellationPolicy: {
        type: String,
        enum: ['Flexible', 'Moderate', 'Strict'],
        default: 'Flexible',
    },
    cleaningFee: {
        type: Number,
        default: 0,
    },
    serviceFee: {
        type: Number,
        default: 0,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    accessibilityNotes : {
        type : String,
    },
    checkInInstructions : {
        type : String,
    },
    bookings: [
        {
            type: schema.Types.ObjectId,
            ref: 'Booking',
        }
    ]
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})


const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;