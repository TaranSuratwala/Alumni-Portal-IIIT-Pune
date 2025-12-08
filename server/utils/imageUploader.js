const cloudinary = require("cloudinary").v2;

async function uploadToCloudinary(folder,file,height,quality){
    try{
        if(file.size > 10485760){
            quality = 50;
        }
        const options = {
            folder,
            resource_type : "auto",
        }

        if(height){
            options.height = height;
        }
        if(quality){
            options.quality = quality;
        }

        const response = await cloudinary.uploader.upload(file.tempFilePath,options);
        return response;
    }
    catch(err){
        throw new Error(`Error in uploading file to clodinary ${err.message}`);
    }
}

module.exports = uploadToCloudinary;