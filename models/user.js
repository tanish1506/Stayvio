const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default

const userSchema = new Schema({
    email : {
        type : String,
        require : true,
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