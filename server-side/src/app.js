const express = require('express');
require('dotenv').config();

const app = express(); 
const signup = require("./router/signup");
const connectToDB = require("./config/database");  
const { auth } = require("./middlewares/loginAuth"); 
const cors = require('cors');

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
