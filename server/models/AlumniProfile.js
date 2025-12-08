const mongoose = require("mongoose");
const User = require("./User");

const alumniProfileSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     unique: true
//   },

  graduationYear: {
    type: Number,
    // required: true
  },

  department: {
    type: String,
    // required: true,
    trim: true
  },

  currentJobTitle: {
    type: String,
    trim: true
  },

  company: {
    type: String,
    trim: true
  },

  experienceYears: {
    type: Number,
    default: 0
  },

  skills: {
    type: [String],
    default: []
  },

  bio: {
    type: String,
    default: ""
  },

  posts: [
    {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "Post"
    }
  ],

  imageUrl:{
    type: String,
  },

});


module.exports = mongoose.model("AlumniProfile", alumniProfileSchema);
