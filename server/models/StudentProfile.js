const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     unique: true
//   },

  rollNumber: {
    type: String,
    // required: true,
    trim: true
  },

  branch: {
    type: String,
    // required: true,
    trim: true
  },

  year: {
    type: Number,       // example: 1, 2, 3, 4
    // required: true
  },

  skills: {
    type: [String],
    default: []
  },

  interests: {
    type: [String],
    default: []
  },

  bio: {
    type: String,
    default: ""
  },

  imageUrl:{
    type: String,
  },


});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
