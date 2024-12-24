const express = require('express');
const app = express();
require('dotenv').config(); 
const cookieParser = require('cookie-parser'); 
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');   
const signup = require("./router/signup");
const connectToDB = require("./config/database");  
const { auth } = require("./middlewares/loginAuth"); 

app.use(helmet()); 
app.use(xss()); 
app.use(cookieParser()); 
app.use(express.json());  
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,  
  message: 'Too many requests, please try again later.'
});
 
app.use(limiter);

 


const corsOptions = {
  origin: 'https://nithyaganesh.netlify.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],  
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  
 


app.use(signup); 

app.get("/get", (req, res) => { 
  res.send('ok');
});
app.get("/", auth, (req, res) => {
  res.redirect('/home');
});


connectToDB()
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} successfully`);
    });
  })
  .catch((e) => {
    console.log(e);  
  });
