const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.getAdminDashboard = async (req,res)=>{
    const users = await User.find({}).sort({createdAt : -1});
    const listings = await Listing.find({}).populate('owner').sort({createdAt : -1});
    const bookings = await Booking.find({}).populate('listing').populate("user").sort({createdAt : -1});

    const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((sum,b) => sum + b.totalPrice,0 );

    const totalHosts = users.filter(u => u.role === 'host' || u.role === 'both').length;

    //bookings by status
    const bookingStats = {
        confirmed : bookings.filter(b => b.status === 'confirmed' ).length,
        pending : bookings.filter(b => b.status === 'pending_payment').length,
        cancelled : bookings.filter(b => b.status === 'cancelled').length,
        completed : bookings.filter(b => b.status === 'completed').length,
    };

    //users by role
    const userStats = {
        guest : users.filter(u => u.role === 'guest').length,
        host : users.filter(u => u.role === 'host').length,
        both : users.filter(u => u.role === 'both').length,
        admin : users.filter(u => u.role === 'admin').length,
    };

    //revenue by 6 months
    const monthlyRevenue = [];
    const monthLabels = [];

    for(let i=5;i>=0;i--){
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString('default' , {month : 'short'});
        const year = date.getFullYear();
        monthLabels.push(`${month} ${year}`);
        const revenue = bookings.filter(b => {
            const d = new Date(b.createdAt);
            return d.getMonth() === date.getMonth() && d.getFullYear() === year && b.status === 'confirmed';
        }).reduce((sum,b) => sum + b.totalPrice , 0);
        
        monthlyRevenue.push(revenue);
    }

    res.render('users/admin',{users,listings,bookings,totalRevenue,totalHosts,monthlyRevenue,monthLabels,userStats,bookingStats,searchQuery : ''});
};
module.exports.deleteUser = async(req,res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        req.flash('error','User not found');
        return res.redirect("/admin");
    }

    //delete listing if host
    if(user.role === 'host' || user.role ==='both'){
        await Listing.deleteMany({owner : user._id});
    }

    //delete their bookings
    await Booking.deleteMany({user : user._id});
    await User.findByIdAndDelete(req.params.id);
    req.flash('success','User deleted Successfully');
    res.redirect("/admin");
};