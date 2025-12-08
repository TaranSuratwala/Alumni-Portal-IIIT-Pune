const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    role:{
        type: String,
        required: true,
    },

    createdAt:{
        type: Date,
        default: Date.now()
    },

    message: {
        type: String,
        trim: "true",
        required: true,
    }


},{
    timestamps: true, 
  });


module.exports = mongoose.model("Communication",communicationSchema);