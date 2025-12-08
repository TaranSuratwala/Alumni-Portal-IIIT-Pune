const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
    },

    image:{
        type: String,
        required: true,
    },

    description:{
        type: String,
        trim: true,
        required: true,
    },

    location:{
        type: String,
        trim: true,
        required: true,
    },

    date:{
        type: Date,
        required: true,
    },

    day:{
        type: String,
        required: true,
    },

    time:{
        type: String,
        trim: true,
        required: true,
    },

    interestedCandidates:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    createdAt:{
    type: Date,
    default: Date.now()
  }


},{
    timestamps: true, 
  });


module.exports = mongoose.model("Event",eventSchema);