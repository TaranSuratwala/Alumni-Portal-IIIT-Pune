const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true
  },

  lname: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["Student", "Alumni", "Admin"],
    required: true
  },

   profileModel: {
    type: String,
    required: true,
    enum: ["StudentProfile", "AlumniProfile", "AdminProfile"]
  },

  // Profile will be ObjectId of StudentProfile / AlumniProfile / AdminProfile
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "profileModel"   // dynamic ref
  },

  createdAt:{
    type: Date,
    default: Date.now()
  }

  // Which model this ObjectId refers to
 
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
