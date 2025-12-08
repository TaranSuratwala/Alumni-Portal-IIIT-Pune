const Notice = require('../models/Notice');

async function createNotice(req,res){
    try{
        let {title,description,expiresAt,category,instructions,note} = req.body.payload;
        if(!title || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are compulsory",
            });
        }

        const userId = req.user.id;
        if(instructions && instructions.length>0){
            instructions = instructions.split('.');
        }else{
            instructions= [];
        }

        let notice;

        if(category.length == 0){
            category = "General"
        }

        if(expiresAt.length > 0){
            notice = await Notice.create({
                title,description,expiresAt: new Date(expiresAt),category, createdBy: userId,instructions,note
            });
        }
        else{
            notice = await Notice.create({
                title,description,category, createdBy: userId,instructions,note
            });
        }
        

        return res.status(200).json({
            success: true,
            message: "Notice created successfully",
            notice,
        });
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
        });
    }
}


async function getAllNotices(req,res){
    try{
        const notices = await Notice.find({}).populate('createdBy').exec();

        return res.status(200).json({
            success: true,
            message: "Notices fetched successfully",
            data: notices,
        });
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
        });
    }
}



async function deleteNotice(req,res){
  try{
    const {notice} = req.body;
    if(!notice){
      return res.status(400).json({
        success: false,
        message: "All fields are compulsory",
      })
    }

    const deleteNotice = await Notice.findByIdAndDelete(notice._id);

    
    return res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    })
  }catch(err){
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    })
  }
}


module.exports = {
    createNotice,getAllNotices,deleteNotice
}