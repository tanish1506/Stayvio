const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default

const userSchema = new Schema({
    email : {
        type : String,
        require : true,
    },
    role : {
        type : String,
        enum : ['guest','host','both','admin'],
        default : 'guest',
    },
    avatar : {
        type : String,
    },
    phone : {
        type : String,
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    hostSince : {
        type : Date,
    },
    superhost : {
        type : Boolean,
        default : false,
    },
    responseRate : {
        type : Number,
    },
    wishlist : {
        type: [
            {
                type : Schema.Types.ObjectId,
                ref : "Listing"
            }
        ],
        default: []
    },
    bookings : {
        type : [
            {
                type : Schema.Types.ObjectId,
                ref : 'Booking',
            }
        ],
        default : []
    }
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User",userSchema);