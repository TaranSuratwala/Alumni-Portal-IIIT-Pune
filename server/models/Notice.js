const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    instructions:{
        type: [String],
    },

    note:{
        type: String,
    },

    // The admin who created it
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    // Optional expiry date for the notice
    expiresAt: {
      type: Date,
      default: null,
    },

    category: {
      type: String,
      enum: ["General", "Event", "Placement", "Alumni", "Urgent"],
      default: "General",
    },

    createdAt:{
    type: Date,
    default: Date.now()
  }
  },
  {
    timestamps: true, 
  }
);


noticeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Notice",noticeSchema);
