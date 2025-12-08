const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const mongoose = require('mongoose')

async function updateStudentProfile (req, res){
  try {
    const userId = req.user.id;  // logged-in user
    const { rollNumber, branch, year, skills, interests, bio } = req.body;


    if(!rollNumber || !branch || !year || !skills || !interests || !bio){
        return res.status(400).json({
            success: false,
            message: "All fields are compulsory"
        })
    }

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }


    // Create student profile
    const profile = await StudentProfile.findByIdAndUpdate(existingUser.profile,{
      rollNumber,
      branch,
      year,
      skills,
      interests,
      bio
    });

    

    return res.status(201).json({
      success: true,
      message: "Student profile created successfully",
      profile
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};



const AlumniProfile = require("../models/AlumniProfile");
const AdminProfile = require("../models/AdminProfile");
const uploadToCloudinary = require("../utils/imageUploader");

async function updateAlumniProfile (req, res){
  try {
    const userId = req.user.id;  // logged-in user
    console.log("USER ID",userId)
    const { 
      graduationYear, 
      department, 
      currentJobTitle, 
      company, 
      experienceYears, 
      skills, 
      bio 
    } = req.body;

    // Validation (same style as yours)
    if (
      !graduationYear ||
      !department ||
      !currentJobTitle ||
      !company ||
      experienceYears === undefined ||
      !skills ||
      !bio
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are compulsory"
      });
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }


    // Update alumni profile
    const profile = await AlumniProfile.findByIdAndUpdate(
      {_id:existingUser.profile},
      {
        graduationYear:graduationYear,
        department,
        currentJobTitle,
        company,
        experienceYears,
        skills,
        bio
      },
      { new: true } // return updated profile
    );

    return res.status(200).json({
      success: true,
      message: "Alumni profile updated successfully",
      profile,existingUser
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};


async function getAllAlumni(req,res) {
    try{
        const data = await User.find({role:"Alumni"}).populate({
          path: 'profile',
          populate: {
            path: 'posts'
          }
        }).exec();
        return res.status(200).json({
          success: true,
          data
        });
    }catch(err){
      console.log(err.message);
      return res.status(500).json({
        success: true,
        message: err.message
      })
    }
}


async function getAlumni(req,res) {
    try{
      const {alumniId} = req.body;
        const data = await User.findById(alumniId).populate({
          path: 'profile',
          populate: {
            path: 'posts'
          }
        }).exec();
        return res.status(200).json({
          success: true,
          data
        });
    }catch(err){
      console.log(err.message);
      return res.status(500).json({
        success: false,
        message: err.message
      })
    }
}

async function getUser(req,res){
    try{
        const id = req.user.id;
        const data = await User.findById(id)
        .populate("profile").exec();

        return res.status(200).json({
            success: true,
            data,
        });
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


async function getUser2(req,res){
      try{
      const {id} = req.body;
        const userDetails = await User.findById(id);

        let data;

        if(userDetails.role == 'Admin'){
           data = await User.findById(id)
          .populate("profile").exec();
        }
        else{
            data = await User.findById(id).populate({
            path: 'profile',
            populate: {
              path: 'posts'
            }
          }).exec();
        }

        return res.status(200).json({
          success: true,
          data
        });
    }catch(err){
      console.log(err.message);
      return res.status(500).json({
        success: false,
        message: err.message
      })
    }
}


async function updateProfilePicture(req,res){
  try{
    const id = req.user.id;

    const image = req.files.image;

    const userDetails = await User.findById(id);

    const secure_url =  (await uploadToCloudinary("Alumni Portal",image)).secure_url;

    let updatedProfile;
    if(userDetails.role === "Admin"){
        updatedProfile = await AdminProfile.findByIdAndUpdate(userDetails.profile, {imageUrl : secure_url});
    }
    else if(userDetails.role === 'Student'){
      updatedProfile = await StudentProfile.findByIdAndUpdate(userDetails.profile, {imageUrl : secure_url});
    }
    else if(userDetails.role === "Alumni"){
      updatedProfile = await AlumniProfile.findByIdAndUpdate(userDetails.profile, {imageUrl : secure_url});
    }

    return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          data: updatedProfile
      });

  }catch(err){
    console.log(err.message)
      return res.status(500).json({
          success: false,
          message: err.message,
      });
  }
}


async function updateAdminProfile(req,res){
  try{
    const id = req.user.id;
    const {email,department,designation} = req.body;

    if(!email || !department || !designation){
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userDetails = await User.findById(id);
    const profileId = userDetails.profile;
    userDetails.email = email;
    await userDetails.save();

    const updatedProfile = await AdminProfile.findByIdAndUpdate(profileId,{email,designation,department});

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });

  }catch(err){
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
module.exports = {
    updateAlumniProfile,
    updateStudentProfile,
    getAllAlumni,
    getAlumni,
    getUser,
    getUser2,
    updateProfilePicture,
    updateAdminProfile
}