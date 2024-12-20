const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const signup   = require("./router/signup");
const dummy = require("./router/dummyRoutes") ;
const connectToDB = require("./config/database");  
const {auth }=require("./middlewares/loginAuth"); 
app.use(express.json())
app.use(cors()); 
app.use(signup);
app.use(dummy); 


app.get("/get",(req,res)=>{ 
    res.send(`ok`);
}); 
 
app.get("/",auth,(req,res)=>{ 
    res.redirect(`/home`);
}); 
connectToDB()
    .then(()=>{
     console.log("Connected to MongoDB");
     const PORT = process.env.PORT || 3000;

     app.listen(PORT,()=>{
        console.log("server running on http://localhost:3000 successfully");
    });})
    .catch((e)=>{
        console.log(e);
    });


