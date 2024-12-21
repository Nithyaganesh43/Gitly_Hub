const express = require("express");
const passport = require("passport"); 
require('dotenv').config();
const GitHubStrategy = require("passport-github2").Strategy; 
const User = require("../models/user");  
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const signup = express.Router();   
const cookieParser = require("cookie-parser");
signup.use(cookieParser());

const fetchPrimaryEmail = require("../helper/fetchPrimaryEmailForGitHub");
const { auth, tempAuth } = require("../middlewares/loginAuth");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;   
const validator = require("validator");
const mail = require("../helper/mail");
const validateUserInfromations = require("../helper/validateUserInfromations");
const jwt = require("jsonwebtoken"); 
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
      email = email.trim().toLowerCase();
      const userData = {
        fullName: profile.displayName || profile.username,
        email,
        profileUrl: profile.photos[0].value, 
        platform: "github", 
      }; 
      done(null, userData);  
    }
  )
);

signup.get(
  "/auth/github", 
  passport.authenticate("github", {
     scope: ["user:email"], session: false
  })
);

signup.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/", session: false }),
  async (req, res) => { 
    try {
      console.log("GitHub authentication started...");
      const userData = req.user; 
      console.log("GitHub user data:", userData);

      const user = await User.findOne({ email: userData.email, platform: userData.platform });
      if (user) {
        console.log("Existing user found, generating token...");
        const token = await user.getJWT();
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'Strict',
        });
        console.log("Token set in cookie. Redirecting to home...");
        res.redirect(`/home`); 
      } else { 
        console.log("New user. Creating user and generating temp token...");
        const newUser = new User(userData);
        const token = await newUser.getJWT();
        res.cookie("temp_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        await newUser.save();
        console.log("New user saved. Redirecting to new user info page...");
        res.redirect(`/newUserInfo?fullname=${userData.fullName}&email=${userData.email}&platform=${userData.platform}&profileUrl=${userData.profileUrl}`);
      } 
    } catch (err) {
      console.error("Error during GitHub authentication:", err);
      res.redirect(`/userAuth`);
    }
  }
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://ng-dmcz.onrender.com/auth/google/callback",
    }, 
    async (accessToken, refreshToken, profile, done) => {
      const userData = {
        fullName: `${profile.name.givenName} ${(profile.name.familyName != undefined) ? profile.name.familyName : ""}`,
        email: profile.emails[0].value,
        profileUrl: profile.photos[0].value, 
        platform: "google"
      };
      done(null, userData); 
    }
  )
);

signup.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

signup.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }), 
  async (req, res) => {  
    try {
      console.log("Google authentication started...");
      const userData = req.user; 
      console.log("Google user data:", userData);

      const user = await User.findOne({ email: userData.email, platform: userData.platform });
      if (user) {
        console.log("Existing user found, generating token...");
        const token = await user.getJWT();
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'Strict',
        });
        console.log("Token set in cookie. Redirecting to home...");
        res.redirect(`/home`); 
      } else { 
        console.log("New user. Creating user and generating temp token...");
        const newUser = new User(userData);
        const token = await newUser.getJWT();
        res.cookie("temp_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        await newUser.save();
        console.log("New user saved. Redirecting to new user info page...");
        res.redirect(`/newUserInfo?fullname=${userData.fullName}&email=${userData.email}&platform=${userData.platform}&profileUrl=${userData.profileUrl}`);
      }
    } catch (err) {
      console.error("Error during Google authentication:", err);
      res.redirect(`/userAuth?error=${err}`);
    }
  }
);

signup.post("/auth/gitly/verifyotp", async (req, res) => {
  try {
    console.log("Verifying OTP...");
    let { token } = req.cookies;
    let { otp } = req.body;

    if (!otp) {
      throw new Error("OTP not found");
    }
    if (otp.length != 6) {
      throw new Error("Invalid OTP");
    }

    const bothAreSame = await jwt.verify(token, process.env.SECRET);
    if (bothAreSame.jwtOTP != otp) {
      throw new Error("Invalid OTP");
    }

    const userData = {
      email: bothAreSame.email,
      platform: "gitly", 
      profileUrl: "https://res.cloudinary.com/dmini3yl9/image/upload/v1730714916/di75th4l9fqebilewtur.avif",
    };

    const newUser = new User(userData);
    token = await newUser.getJWT();
    res.cookie("temp_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    await newUser.save(); 
    res.send({ status: "success", message: "SignUp successful" });
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(400).send({ status: "failed", message: err.message });
  }
});

signup.post("/auth/gitly", async (req, res) => {
  try {
    console.log("Starting OTP process...");
    let { email } = req.body;
    if (!email) {
      throw new Error("Email not found"); 
    }
    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email");
    }
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email: email, platform: "gitly" });
    if (user) {
      throw new Error("Email Already Registered");
    }

    function generateOTP() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    let otp = generateOTP();
    await mail(otp, email);

    let jwtOTP = await jwt.sign({ jwtOTP: otp, email: email }, process.env.SECRET, { expiresIn: '10m' });
    res.cookie('token', jwtOTP, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict',
    });
    console.log("OTP sent to email. Returning response...");
    res.send({ message: "OTP sent" });
  } catch (err) {
    console.error("Error during OTP process:", err);
    res.status(400).send({ message: err.message });
  }
});

signup.post("/signupSuccessful", tempAuth, (req, res) => {
  console.log("User signup successful. Validating information...");
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  res.status(200).json({ message: 'Signup successful!' });
});

signup.post("/userLogedIn", async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log(`Login attempt for username: ${userName}`);
    
    if (!userName || !password) {
      throw new Error("Username or Password not found");
    }

    const user = await User.findOne({ userName: userName, password: password });
    if (user) {
      console.log("User found. Generating JWT token...");
      let token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict',
      });
      res.send({ message: "Successfully logged in" });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    console.error("Error during user login:", err);
    res.status(400).send({ status: "failed", message: err.message });
  }
});

module.exports = signup;
