const AlumniProfile = require("../models/AlumniProfile");
const AluminiProfile = require("../models/AlumniProfile");
const JobPost = require("../models/JobPost");
const User = require("../models/User");
const mailSender = require("../utils/mailsender");

async function createPost(req, res){
  try {
    const { 
      title, 
      company, 
      location, 
      salary, 
      description, 
      requirements 
    } = req.body;

    // Validation
    if (!title || !company || !location || !description || !salary) {
      return res.status(400).json({
        success: false,
        message: "Title, salary, company, location, and description are compulsory"
      });
    }

    // Create Job Post
    const post = await JobPost.create({
      title,
      company,
      location,
      salary,
      description,
      requirements,
      createdBy: req.user.id,
    });

    const userDetails = await User.findById(req.user.id);

    const updatedProfile = await AluminiProfile.findByIdAndUpdate(userDetails.profile,{$push:{posts:post._id}},{new:true});

    return res.status(201).json({
      success: true,
      message: "Job post created successfully",
      post,
      updatedProfile
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};



async function getAllPosts (req, res) {
  try {
    const posts = await JobPost.find().populate('createdBy').sort({ createdAt: -1 }).exec(); // newest first

    return res.status(200).json({
      success: true,
      message: "All job posts fetched successfully",
      posts
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};


async function deletePost(req,res){
  try{
    const {reason,job,selfPost} = req.body;
   if(!selfPost){
     if(!reason || !job){
      return res.status(400).json({
        success: false,
        message: "All fields are compulsory",
      })
    }
   }

    const deletedJob = await JobPost.findByIdAndDelete(job._id);

    const userDetails = await User.findById(job.createdBy);
    
    if(userDetails.role === "Alumni" || selfPost){
      const updatedProfile = await AlumniProfile.findByIdAndUpdate(userDetails.profile,{$pull:{posts:job._id}});
      await mailSender(userDetails.email,"Job Posting Removal Notification - Alumni Portal, IIIT Pune" ,require('../Mail Templates/DeletePost')(reason));
    }
    
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
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
    createPost,
    getAllPosts,
    deletePost
}