const otpCount = require("../models/otpLimiter"); 

async function  otpLimiter( email){

    let toDay = getToday();
   
    const userToUpdateount = await otpCount.findOne( { email : email} );
    
    if(!userToUpdateount ){ 
        const data = { email : email,times : 1 ,date : toDay}; 
        const otp = await new otpCount(data);
        await otp.save();  
    }
        else if(!isToday(userToUpdateount.date)){
            await otpCount.findByIdAndUpdate(userToUpdateount._id,{ times : 1 , date : getToday()});
            }
                else{
                    let count = userToUpdateount.times;
                    count+=1;
                        if(count>3 ){ 
                            throw new Error("Out of otp request Limit for today");
                        }  
                    await otpCount.findByIdAndUpdate(userToUpdateount._id,{times : count}) ;
                    }
}
 





function getToday() {
        let d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
    
function isToday(date) {
        return date === getToday();
    }

module.exports = otpLimiter;