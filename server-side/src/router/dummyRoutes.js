const express = require("express");
const dummy = express.Router();
const deleteAll = require("../helper/deleteAllUser");
const {auth}=require("../middlewares/loginAuth");

// dummy.delete("/removeAllUsersInDataBase",auth,async (req,res)=>{
//     const info = await deleteAll(req.user._id);

//     res.send({message:`${info.deletedCount} user(s) Deleted from database`});
    
// }); 

module.exports=dummy;