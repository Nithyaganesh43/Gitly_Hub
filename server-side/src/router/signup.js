// D:\projects\Gitly\Gitly\server-side\src\router\signup.js

const express = require("express");
const passport = require("passport"); 
require('dotenv').config();
const GitHubStrategy = require("passport-github2").Strategy; 
const User = require("../models/user"); 
const cookieParser = require("cookie-parser");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const signup = express.Router();   
 

const fetchPrimaryEmail = require("../helper/fetchPrimaryEmailForGitHub");
const {auth , tempAuth }= require("../middlewares/loginAuth");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;   
const validator = require("validator");
const mail = require("../helper/mail");
const validateUserInfromations = require("../helper/validateUserInfromations");
const jwt = require("jsonwebtoken");
signup.use(cookieParser());
signup.use(passport.initialize()); 
   
  
signup.use(express.json());
  
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "https://ng-dmcz.onrender.com/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => { 
      let email = await fetchPrimaryEmail(accessToken); 
       
      email=email.trim().toLowerCase();
      const userData = {
        fullName: profile.displayName || profile.username,
        email,
        profileUrl: profile.photos[0].value, 
        platform : "github", 
      }; 
      done(null, userData);  
    }
  )
); 

//auth/github- route that called to connect with github auth fromm client
signup.get(
  "/auth/github", 
  passport.authenticate("github", {
     scope: ["user:email"], session: false
     })
);

//github/callback-callback rount when the github return message
signup.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/", session: false }),
  async (req, res) => { 
     try{
  const userData = req.user; 
  const user = await User.findOne({email:userData.email,platform:userData.platform});
if(user){
 
const token = await user.getJWT();
res.cookie("token",token);

res.redirect(`/home`); 
}else{ 
const newUser = new User(userData);
const token = await newUser.getJWT();
res.cookie("temp_token",token);
await newUser.save();
res.redirect(`/newUserInfo?fullname=${userData.fullName}&email=${userData.email}&platform=${userData.platform}&profileUrl=${userData.profileUrl}`);

} }catch(err){
  res.redirect(`/userAuth`);
} }
);

//GoogleStrategy 
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://ng-dmcz.onrender.com/auth/google/callback",
    }, 
    async (accessToken, refreshToken, profile, done) => {
      
       
      const userData = {
        fullName: `${profile.name.givenName} ${(profile.name.familyName!=undefined)?profile.name.familyName:""}`,
        email: profile.emails[0].value,
        profileUrl: profile.photos[0].value, 
        platform : "google"
      };
      done(null, userData); 
       
    
 
    }
  )
);

///auth/google
signup.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

//auth/google/callback
signup.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }), 
   async (req, res) => {  
    try{
    const userData = req.user; 
    const user = await User.findOne({email:userData.email,platform:userData.platform});
if(user){
   
const token = await user.getJWT();
res.cookie("token",token);

res.redirect(`/home`); 
}else{ 
const newUser = new User(userData);
const token = await newUser.getJWT();
res.cookie("temp_token",token);
await newUser.save();
res.redirect(`/newUserInfo?fullname=${userData.fullName}&email=${userData.email}&platform=${userData.platform}&profileUrl=${userData.profileUrl}`);
 
}
 
  }catch(err){
    res.redirect(`/userAuth?error=${err}`);
  } 
}
);

//this is the api which is called to check the otp is correct we store the otp in client machine as jwt token and
// verify the otp provided by the user and the jwt is same. if both the otp are same we create a user in db 
//and send a temp-token for new user information page new user cannot created without giving user informations
signup.post("/auth/gitly/verifyotp",async (req,res)=>{
try{
  let {token} = req.cookies;
  let {otp}=req.body;
   
    if(!otp){
      throw new Error("otp not found");
    }
    if(otp.length!=6)
    {
      throw new Error("Invalid otp")
    } 
  const bothAreSame = await jwt.verify(token,process.env.SECRET);
 
  if(bothAreSame.jwtOTP!=otp){
throw new Error("Invalid OTP");
  }
   
const userData = {
  email : bothAreSame.email,
  platform: "gitly", 
  profileUrl : "https://res.cloudinary.com/dmini3yl9/image/upload/v1730714916/di75th4l9fqebilewtur.avif",

}
 
  const newUser = new User(userData);
   token = await newUser.getJWT();
  res.cookie("temp_token",token);
  await newUser.save(); 
  res.send({status : " success" , message : "SignUp successfull"});
  }catch(err){
    res.status(400).send({ status: "failed", message: err.message });

  }
})   

//this is the api with takes email and imput and validats it and send a otp to that email and saves the otp in the clients machine 
//as jwt token for verification purpose seen in above api
//auth/gitly
signup.post("/auth/gitly",async (req,res)=>{
  try{ 
    let { email } = req.body;
    if(!email){
      throw new Error("Email not found"); 
    }
    if(!validator.isEmail(email))
    {
      throw new Error("Invalid Email")
    }
      email=email.trim().toLowerCase();
  
  
    const user = await User.findOne({email:email,platform:"gitly"});
    if(user){
       throw new Error("Email Already Registred");
    }

    function generateOTP() {
      return Math.floor(100000 + Math.random() * 900000);
  }

  let otp = generateOTP();
  await mail( otp,email);
  let jwtOTP = await jwt.sign({ jwtOTP: otp , email: email }, process.env.SECRET, { expiresIn: '10m' }); 
 
    res.cookie('token', jwtOTP, { httpOnly: true });
    res.send({  message : "otp send" });
 
  }catch(err){
    
    res.status(400).send({  message: err.message });
  }
}) 

//after the new user giving the information validation takes place then we are updating the user data
//and re-writing the token for next one day

signup.post("/signupSuccessful", tempAuth, async (req, res) => {
  console.log("tempAuth - > signup called success");
  try{     
    
    const {fullName, userName , password  ,platform , email}= req.body;
 const user = req.user;
 console.log(user);
    if(!user){
      throw new Error("user  Not Found...");
    }  

    await validateUserInfromations(fullName , userName , password , platform , email );  
   

  if(user){
    if(user.fullName && user.passport && user.userName){
      throw new Error("Already registed the informations");
    }
    const updatedStatus = await User.findByIdAndUpdate(user._id,{fullName:fullName, userName:userName , password:password});
    if (!updatedStatus) {
      throw new Error("User not found or update failed.");
  }

    
    let token = await user.getJWT();
    res.cookie("token",token);
    res.send({message:"successfully user registred"   });
   
}
else{
  throw new Error("User not found ");
}
}catch(err){
  console.log(err);
  res.status(400).send({message : err.message});
}}); 

//this api works for login is the user gives correct username and password it gives jwt else it say 404
signup.post("/userLogedIn", async (req, res) => { 
  try{ 
    const {userName,password}= req.body; 
    if(!userName){
      throw new Error("User Name Not found");
    }else if(!password){
      throw new Error("Password Not found");
    }else{
     
  const user = await User.findOne( {userName:userName,password:password} );
  if(user){
    let token = await user.getJWT();
    res.cookie("token",token); 
    res.send({message:"successfully user registred"});
  }else{
     
    throw new Error("User Not found");
  }
    }
   
}catch(err){
  
  res.status(404).send({message : err.message});
}
});

//forgotPasswordVerifyOtp-works only for gitly authentication same as that gitly/auth
signup.post("/forgotPasswordVerifyOtp",async (req,res)=>
  {
  try{
    let {token} = req.cookies;
    let {otp,email}=req.body; 
      if(!otp){
        throw new Error("otp not found");
      }
      if(otp.length!=6)
      {
        throw new Error("Invalid otp")
      } 
      
      email=email.trim().toLowerCase();
    const bothAreSame =  jwt.verify(token,process.env.SECRET);
   
    if(bothAreSame.jwtOTP!=otp){
  throw new Error("Invalid OTP");
    }
    const user = await User.findOne({email:email , platform :"gitly"});
     
    if(!user){
      throw new Error("User Not found");
    }
     token = await user.getJWT();
    res.cookie("token",token);  
    res.send({status : " success" , message : "SignUp successfull"});
    }catch(err){
      res.status(400).send({ status: "failed", message: err.message });
  
    }
  })    

//forgotPasswordGetOtp- same as gitly/auth/verifyotp api
signup.post("/forgotPasswordGetOtp",async (req,res)=>{
    try{ 
      let { email } = req.body;
      if(!email){
        throw new Error("Email not found");
      }
      if(!validator.isEmail(email))
      {
        throw new Error("Invalid Email")
      } 
      
      email=email.trim().toLowerCase();
      const user = await User.findOne({email:email,platform:"gitly"});
     
      if(!user){
         throw new Error("Email not found pls SignUp");
      }
  
      function generateOTP() {
        return Math.floor(100000 + Math.random() * 900000);
    }
  
    let otp = generateOTP();
    await mail( otp,email);
    let jwtOTP = await jwt.sign({ jwtOTP: otp , email: email }, process.env.SECRET, { expiresIn: '10m' }); 
   
      res.cookie('token', jwtOTP, { httpOnly: true });
      res.send({  message : "otp send" });
   
    }
catch(err){
      
      res.status(400).send({  message: err.message });
    }
})
  
// on successfully validated the forgotpasswored api this api used to reset the password by updating it 
signup.post("/resetPassword", async (req, res) => { 
  
  try{ 
    const { password}= req.body;
     if(!password){
      throw new Error("Password Not found");
    }else{
      
  const tokenByUser = req.cookies?.token;
  if(!tokenByUser){
    throw new Error("Token Not Found try again");
  }
 const userid = await jwt.verify(tokenByUser , process.env.SECRET);
  const user = await User.findById( userid );
 
  if(user){
  
    const updatedStatus = await User.findByIdAndUpdate(user._id,{ password:password} , {runValidators : true});
    if (!updatedStatus) {
      throw new Error("User not found or update failed.");
  }

     
    res.send({message:"successfully user password reseted"});
  }else{
    throw new Error("User Not found");
  }
    }
   
}catch(err){
  
  res.status(400).send({message : err.message});
}
});

                                    
//20-12-2024 get number of users 
signup.get(`/getUserCountAndName`,tempAuth ,async (req,res)=>{ 
  const users = await User.find({});
  const count = users.length;
  res.send({count : count , name : req.user.fullName });
});
 //20-12-2024 loading ku ok
signup.get(`/getOk` ,async (req,res)=>{ 
  console.log("console.log(req.cookies)");
  console.log(req.cookies);
  const token = req.cookies?.token;
  const userid = await jwt.verify(token , process.env.SECRET);
   const user = await User.findById( userid );
   console.log(user);
  res.send("ok");
});
 

//api which is called by client for  authentication it just redirects the user to auth page
signup.get("/userAuth",(req,res)=>{
const err = req.query?.err;
if(err){
  
  res.redirect(`https://nithyaganesh.netlify.app/src/authpage/authindex.html`); 
 
}else{
  
  res.redirect(`https://nithyaganesh.netlify.app/src/authpage/authindex.html`); 
 
}
})

//is the user is a new user he/she must give the information about them to create a new account here and 
//user need to be authorized to use this api
signup.get("/newUserInfo",tempAuth,async (req, res) => {
  const { fullname, email, platform, profileUrl } = req.query;  
  const jwt =await req.user.getJWT();
  res.cookie('temp_token',jwt,{ httpOnly: false,   
    secure: false,sameSite: 'None'   }); 
  res.redirect(`https://nithyaganesh.netlify.app/src/authpage/newUserInfo.html?fullname=${fullname}&email=${email}&platform=${platform}&profileUrl=${profileUrl}`);
});

//redirect user to login page
signup.get("/login", (req, res) => {
  res.redirect(`https://nithyaganesh.netlify.app/src/authpage/login.html`); 
   
});

//redirect user to signup page
signup.get("/signup", (req, res) => {
  res.redirect(`https://nithyaganesh.netlify.app/src/authpage/signup.html`); 
    
});
//redirect user to forgotpassword page
signup.get("/forgotPassword", (req, res) => { 
   res.redirect(`https://nithyaganesh.netlify.app/src/authpage/forgotPassword.html`); 
     
});
  
 
//redirect user to home oage if and only the user is authorized
signup.get("/home",auth,async (req,res)=>{ 
 
  res.redirect(`https://nithyaganesh.netlify.app/src/homepage/home.html`); 
});
     
 

 
 
module.exports = signup;
