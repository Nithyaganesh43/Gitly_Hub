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
res.cookie("token",token, { 
  httpOnly: true, 
  secure: true, 
  sameSite: 'None' 
});
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
    const tokenByUser = req.cookies?.token; 
    //console.log("Token: ", req.cookies);
    

    if (!tokenByUser) {
      throw new Error("Token Not Found");
    }
    const userid = await jwt.verify(tokenByUser, process.env.SECRET, (err, decoded) => {
      if (err) { 
        throw new Error("Token verification failed");
      }
      return decoded;
    });
    

    const user = await User.findById(userid); 


    if (!user) {
      throw new Error("Login with GitHub or Google");
    }
 
    req.user = user; 
    next(); 
  } catch (err) { 
    return res.redirect(`/userAuth`);
  }
}

module.exports={ auth , tempAuth };