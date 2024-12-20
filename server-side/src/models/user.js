const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const validator = require('validator');

const userSchema = mongoose.Schema({
    platform: {
        type: String,
        required: [true, 'Platform is required.'],
        trim: true,
        validate: {
            validator: v => validator.isAlpha(v, 'en-US', {ignore: ' '}),
            message: 'Platform must contain only letters.'
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format.'
        }
    },
    userName: {
        type: String, 
        trim: true, 
         
    },
    password: {
        type: String, 
        
    },
    fullName: {
        type: String, 
        trim: true,
         
    },
    profileUrl: {
        type: String,
        trim: true,
        validate: {
            validator: v => !v || validator.isURL(v),
            message: 'Invalid URL format for profile URL.'
        }
    }
});
userSchema.methods.get10mJWT = async function get10mJWT() { 
         
    const token = await jwt.sign({_id : this._id},process.env.SECRET,{expiresIn : '1d'});
    return token;
     } 

userSchema.methods.getJWT = async function getJWT() { 
         
let token = await jwt.sign({_id : this._id},process.env.SECRET,{expiresIn : '1d'});

token = String(token);  
return token;
 } 
module.exports = mongoose.model(`user`,userSchema);