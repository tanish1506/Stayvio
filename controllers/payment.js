const Razorpay = require('razorpay');
const crypto = require('crypto');//nodejs built-in method for signature verification 
const Booking = require("../models/booking")
const Payment = require("../models/payment")

const razorpay = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
});

module.exports.createOrder = async(req,res) => {
    const {id} = req.params;

    const booking = await Booking.findById(id);
    if(!booking){
        return res.status(404).json({error : "Booking Not Found!!"});
    }

    if(booking.status !== 'pending_payment'){
        return res.status(400).json({error : "Booking is not pending payment"});
    }

    const amount = booking.totalPrice * 100;

    //order create hua for razorpay
    const order = await razorpay.orders.create({
        amount : amount,
        currency : 'INR',
        receipt : `booking_${booking._id}`,
        notes :{
            booking_id : booking._id.toString(),
            user_id : req.user._id.toString()
        }
    });

    //payment recordd
    const payment = new Payment({
        booking : booking._id,
        amount : booking.totalPrice,
        razorpay_order_id : order.id,
        status : 'created'
    })

    await payment.save();

    booking.payment = payment._id;
    await booking.save();

    res.json({
        order_id : order.id,
        amount : order.amount,
        currency : order.currency,
        key_id : process.env.RAZORPAY_KEY_ID,
        booking_id : booking._id,
        user_name : req.user.username,
        user_email : req.user.email,
    });
}

module.exports.verifyPayment = async(req,res)=>{
    const {razorpay_order_id , razorpay_payment_id , razorpay_signature , booking_id} = req.body;

    //signature verify 
    const generated_signature = crypto
        .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');
    
    const payment = await Payment.findOne({razorpay_order_id});
    const booking = await Booking.findById(booking_id);

    if(generated_signature === razorpay_signature){
        payment.razorpay_payment_id = razorpay_payment_id;
        payment.razorpay_signature = razorpay_signature;
        payment.status = 'success';
        await payment.save();

        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        await booking.save();

        res.json({success : true,redirect : `/bookings/${booking._id}`});
    } else {
        payment.status = 'failed';
        await payment.save();

        booking.status = 'cancelled';
        booking.paymentStatus = 'failed';
        await booking.save();

        res.json({success : false , redirect : `/bookings/${booking._id}`});
    }

}