const express = require('express');
require('dotenv').config();

const app = express();

const cors = require('cors');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://nithyaganesh.netlify.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});



app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] CORS Check: ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors({
  origin: 'https://nithyaganesh.netlify.app',
  credentials: true
}));

app.options('*', cors());  

const signup = require("./router/signup");
const connectToDB = require("./config/database");  
const { auth } = require("./middlewares/loginAuth"); 

app.use(express.json());

app.use(signup); 

app.get("/get", (req, res) => { 
  res.send('ok');
});
app.get("/", auth, (req, res) => {
  console.log(`[${new Date().toISOString()}] Authenticated user: Redirecting to /home`);
  res.setHeader('Access-Control-Allow-Origin', 'https://nithyaganesh.netlify.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
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
