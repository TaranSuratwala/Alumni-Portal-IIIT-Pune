const mongoose = require("mongoose");
const mailSender = require('../utils/mailsender');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },

  otp: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300   // ⏳ 300 seconds = 5 minutes
  }
});

otpSchema.pre('save',async function(next){
    try{
        const email = this.email;
        const otp = this.otp;
        const title = "Verification Email from Alumni Portal, IIIT Pune";
        const body = require('../Mail Templates/VerificationMail')(otp);
        const info = await mailSender(email,title,body);
        next();
    }catch(err){
        console.log("Error while sending verification email",err);
        next(err);
    }
})

module.exports = mongoose.model("OTP", otpSchema);
