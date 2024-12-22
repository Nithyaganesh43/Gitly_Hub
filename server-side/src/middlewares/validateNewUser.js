
const User = require("../models/user");

async function validateNewUser(req,res,next) {
        try {
  const userData = req.user; 

  const isThisUserAlreadyRegistred = await User.findOne({email:userData.email,platform:userData.platform});
  if(isThisUserAlreadyRegistred){
    
    throw new Error(`userAlreadyRegistred`);
  }
    //console.log("New User added to database :validateNewUser.js");
 const newUser = new User(userData);
 await newUser.save();
  const token = await newUser.get10mJWT();
  res.cookie("token",token, { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'None' 
  });
  
  next();

 
   
}catch(err){
     
  res.redirect(`/signup?status=failed&message=${err.message}`);

 }
}
module.exports = validateNewUser;