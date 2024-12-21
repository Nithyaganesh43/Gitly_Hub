const express = require('express');
require('dotenv').config();

const app = express();

const cors = require('cors');

// Update your CORS configuration
app.use(cors({
  origin: 'https://nithyaganesh.netlify.app', // Specify the exact origin
  methods: ['GET', 'POST'],
  credentials: true // Allow credentials
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://nithyaganesh.netlify.app'); // Set the allowed origin
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
  next();
});


const signup = require("./router/signup");
const connectToDB = require("./config/database");  
const { auth } = require("./middlewares/loginAuth"); 

app.use(express.json());

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
