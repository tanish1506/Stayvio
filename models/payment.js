const  mongoose = require("mongoose")
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    booking : {
        type : Schema.Types.ObjectId,
        ref : 'Booking',
        required : true,
    },
    amount : {
        type : Number,
        required : true,
    },
    currency : {
        type : String,
        default : "INR",
    },
    razorpay_order_id : {
        type : String,
        required : true,
    },
    razorpay_payment_id : {
        type : String,
    },
    razorpay_signature : {
        type : String,
    },
    status : {
        type : String,
        enum : ['created','success','failed'],
        default : 'created',
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model("Payment",paymentSchema);