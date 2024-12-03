const User = require("../models/user") 
async function deleteAll(id){
    const deletedInfo = await User.findByIdAndDelete(id);
    
    return deletedInfo;
    }

module.exports = deleteAll; 