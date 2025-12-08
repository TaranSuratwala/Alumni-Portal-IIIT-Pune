const mongoose = require('mongoose');
const { db } = require('../models/User');
require('dotenv').config();

function dbConnect(){
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("Connected to database successfully");
    })
    .catch((err)=>{
        console.log("Failed to connect to database",err.message);
    })
}

module.exports = dbConnect;