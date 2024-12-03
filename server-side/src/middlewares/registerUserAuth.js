
const jwt = require("jsonwebtoken");
const User = require("../models/user"); 
async function registerUserAuth(req,res,next) { 
    try{
    const {userName , password } = req.query;
       
    const findUserName = await User.findOne({userName : userName});

    if(findUserName){
   throw new Error("userNameAlreadyExist");
    }else{
       
      const tokenByUser = req.cookies?.token;
      if(!tokenByUser){
        throw new Error("Token Not Found");
      }
     const userid = await jwt.verify(tokenByUser , process.env.SECRET);
      const user = await User.findById( userid );
       if(!user){
        throw new Error("login with github or google")
       }
req.user=user;
       next();
    }
}
catch(err){
     
    res.redirect(`/signup?status=failed&message=${err.message}`);

   }
}

module.exports=registerUserAuth;