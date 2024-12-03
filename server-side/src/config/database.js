const mongoose = require("mongoose");
require('dotenv').config();

const connectToDataBase = async () => {
    await mongoose.connect(process.env.CONNECTION);

};

module.exports = connectToDataBase; 