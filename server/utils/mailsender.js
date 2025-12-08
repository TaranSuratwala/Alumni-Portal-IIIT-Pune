const nodemailer = require('nodemailer');
require('dotenv').config();



async function mailSender(email,title,body,semail=null){
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: semail || process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        const info = await transporter.sendMail({
            from: "Alumni Portal || IIIT Pune",
            to: `${email}`,
            subject: title,
            html: body,
        });

        return info;
    }catch(err){
        console.log("Error while sending email ",err);
        throw err;
    }
}

module.exports = mailSender;