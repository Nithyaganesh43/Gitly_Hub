const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');

app.use((req, res, next) => {
  console.log("Request Headers: ", req.headers);   
  console.log("Request from origin: ", req.get('Origin'));  
  next();
});
 
app.use(cors({
    origin: ['https://nithyaganesh.netlify.app'], 
    methods: ['GET', 'POST'],
    credentials: true
}));

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
