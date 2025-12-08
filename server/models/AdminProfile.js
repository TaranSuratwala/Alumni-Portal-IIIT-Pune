const mongoose = require("mongoose");
// const User = require('./User')
const adminProfileSchema = new mongoose.Schema({

  fullName: {
    type: String,
    trim: true,
    required: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },


  imageUrl:{
    type: String,
    required: true,
  },


  department:{
    type:String,
    trim: true,
    default: null
  },

  // Admin-specific attributes
  designation: {
    type: String,
    default: "System Administrator"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("AdminProfile", adminProfileSchema);
