const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  company: {
    type: String,
    required: true,
    trim: true
  },

  location: {
    type: String,
    required: true,
    trim: true
  },

  createdAt:{
    type: Date,
    default: Date.now(),
  },

  salary: {
    type: String,
    required: false,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  requirements: {
    type: [String],      // array of strings
    default: []
  },

  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt:{
    type: Date,
    default: Date.now()
  }

}, { timestamps: true });

module.exports = mongoose.model("Post", jobPostSchema);
