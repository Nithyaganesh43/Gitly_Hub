const jwt = require("jsonwebtoken");
require('dotenv').config();

const User = require("../models/user"); 
async function auth(req,res,next) {  
  try{
    const tokenByUser = req.cookies?.token;
    if(!tokenByUser){ 
      throw new Error("Token Not Found");
    }
    const userid = await jwt.verify(tokenByUser , process.env.SECRET);
    const user = await User.findById( userid );
    if(!user){
      throw new Error("login with github or google")
    }else if(!user.userName){
        
const token = await user.getJWT();
res.cookie("temp_token",token);
        res.redirect(`/newUserInfo?fullname=${user.fullName}&email=${user.email}&platform=${user.platform}&profileUrl=${user.profileUrl}`);
 
       }else{ 
        
req.user=user; 

       next(); 
       }
    }
catch(err){  
    res.redirect(`/userAuth`);
 
    }
}

async function tempAuth(req, res, next) {
  try {
    const tokenByUser = req.cookies?.temp_token; 
    console.log("Token: ", tokenByUser);
    if (!tokenByUser) {
      throw new Error("Token Not Found");
    }
    const userid = await jwt.verify(tokenByUser, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log("JWT Verification Error: ", err);
        throw new Error("Token verification failed");
      }
      return decoded;
    });
    

    const user = await User.findById(userid);
    console.log("User found: ", user);


    if (!user) {
      throw new Error("Login with GitHub or Google");
    }

    console.log("tempAuth success");
    req.user = user; 
    next(); 
  } catch (err) {
    console.log("tempAuth failed redirecting to userAuth"); 
    return res.redirect(`/userAuth`);
  }
}

module.exports={ auth , tempAuth };