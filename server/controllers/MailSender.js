const QueryMail = require('../Mail Templates/QueryMail');
const User = require('../models/User');
const mailSender = require('../utils/mailsender');

async function MailSender(req,res){
    try{
        const {title,message,email} = req.body;
        const id = req.user.id;

        if(!title || !message){
            return res.status(400).json({
                success: false,
                message: "All fields are compulsory",
            });
        }

        const studentDetails = await User.findOne({_id: id});
        const sName = `${studentDetails.fname} ${studentDetails.lname}`;
        const sEmail = studentDetails.email;
        const body = QueryMail(title,message,sName,sEmail)

        const info = await mailSender(email,"Message From a Student - Alumni Portal, IIIT Pune",body);

        return res.status(200).json({
            success: true,
            message: "Mail sent successfully",
        });
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

module.exports = MailSender