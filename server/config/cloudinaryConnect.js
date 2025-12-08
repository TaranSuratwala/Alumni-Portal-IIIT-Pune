const cloudinary = require('cloudinary').v2;
require('dotenv').config();

function cloudinaryConnect(){
    try{
        cloudinary.config({
            cloud_name: process.env.CD_CLOUD_NAME,
            api_key: process.env.CD_API_KEY,
            api_secret: process.env.CD_API_SECRET,
        })
        console.log("Successfully connected to clodinary")
    }
    catch(err){
        console.log(err);
    }
}

module.exports = cloudinaryConnect;