const express = require('express');
require('dotenv').config();



const app = express(); 
const signup   = require("./router/signup");
const connectToDB = require("./config/database");  
const {auth }=require("./middlewares/loginAuth"); 
app.use(express.json())
 
const cors = require('cors');

signup.use((req, res, next) => {
    console.log('CORS headers:', req.headers);
    next();
  });
  


const allowedOrigin = /^https:\/\/([a-z0-9-]+\.)?nithyaganesh\.netlify\.app$/;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigin.test(origin)) {
      callback(null, true);  
    } else {
      callback(new Error('Not allowed by CORS'));   
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
 
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(signup); 



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


