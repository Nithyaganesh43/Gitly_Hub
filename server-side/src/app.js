const express = require('express');
require('dotenv').config();

const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use((req,res)=>{
  console.log("Cookies: ", req.cookies);

})
 

const cors = require('cors');

const corsOptions = {
  origin: 'https://nithyaganesh.netlify.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Include any custom headers
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  
app.use(express.json());  
 
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
