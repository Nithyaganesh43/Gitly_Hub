const mongoose = require("mongoose");
 
const otpLimiterSchema = mongoose.Schema({
     
    email : { 
        type : String,
        unique : true,
    },
    times : {
        type : Number,
        default : 1,
    },
    date : {
        type : String,
    }
}
);
 

module.exports = mongoose.model(`otpLimiterSchema`,otpLimiterSchema);