const express = require('express');
require('dotenv').config();

const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Method: ${req.method}, URL: ${req.originalUrl}, Headers: ${JSON.stringify(req.headers)}, Body: ${JSON.stringify(req.body)}, Query: ${JSON.stringify(req.query)}, IP: ${req.ip}`);
  next();
});

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
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Method: ${req.method}, URL: ${req.originalUrl}, Headers: ${JSON.stringify(req.headers)}, Body: ${JSON.stringify(req.body)}, Query: ${JSON.stringify(req.query)}, IP: ${req.ip}`);
  next();
});

app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming Headers: ${JSON.stringify(req.headers)}`);
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
