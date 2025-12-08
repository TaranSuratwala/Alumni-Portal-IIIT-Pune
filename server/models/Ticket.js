const mongoose = require('mongoose');
require('./Communication');

const ticketSchema = new mongoose.Schema({
    status:{
        type: Boolean,
        default: true
    },

    subject:{
        type: String,
        trim: true,
        required: true,
    },

    issue:{
        type: String,
        required: true,
    },

    createdAt:{
        type: Date,
        default: Date.now()
    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

   communication: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Communication"
    }
    ]

},{
    timestamps: true, 
  });


module.exports = mongoose.model("Ticket",ticketSchema);