const User = require("../models/user");
const validator = require("validator");
async function validateUserInfromations(fullName ,username, password,platform , email ) {
 

   const user = await User.findOne({platform:platform , email:email});

   if(!user){
      throw new Error("User Not Found");
   }

   if(user.userName && user.fullName && user.password){
      throw new Error("UserAlreadyRegistred");
   }
   if(username.length > 20 || username.length < 8 || !/^[a-zA-Z0-9_]+$/.test(username)){
      throw new Error("userName must be 8-20 characters and only contain letters, numbers, or underscores");
   }
   
   
   const isUserNameUnique = await User.findOne({userName : username});
   if(isUserNameUnique){
      throw new Error("UserName already taken choose another one");
   }    

   if(password){        
     if(!validator.isStrongPassword(password,{
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
            }) || password.length < 8 ||  password.length > 20 ){
             throw new Error("Password must be morethen 8 char and less then 20 char have one Upper case , one Lower Case and one spscial symbol and one number");
            }
   }

   if(!validator.isLength(fullName, {min: 3, max: 50})){
        throw new Error("Full name must be between 3 and 50 characters.");
     }

};

module.exports=validateUserInfromations;