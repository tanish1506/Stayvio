const User = require("../models/user")


module.exports.renderSignupForm = (req,res) => {
    res.redirect("/listings");
}

module.exports.signup = async (req,res) => {
    try{

        let {username,email,password,role} = req.body;
        const newUser = new User({email,username , role : role || 'guest'});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("sucess", "Welcome to Stayvio!!");
            res.redirect("/listings");
        })
        
    } catch(e){
         req.flash("error",e.message);
         res.redirect("/listings");
    }
    
}

module.exports.renderLoginForm = (req,res)=>{
    res.redirect("/listings");
}


module.exports.login = async (req,res) => {
     req.flash("sucess" ,"Welcome back to Stayvio!")
     let redirectUrl = res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl); 
}

module.exports.logout = (req,res,next)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("sucess","you are logged out!");
        res.redirect("/listings");
    })
}