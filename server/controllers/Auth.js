const OTP = require('../models/OTP');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const AlumniProfile = require('../models/AlumniProfile');
const otpGenerator = require('otp-generator');
// const validateEmail = require('../utils/validateEmail');
const bcrypt = require('bcrypt');
const mailSender = require('../utils/mailsender');
const jwt = require('jsonwebtoken');
const AdminProfile = require('../models/AdminProfile');
require('dotenv').config();


// otp send
async function sendOtp(req,res){
    try{
        const email = req.body.email;
        if(!email){
            res.status(400).json({
                success: false,
                message: "All fields are necessary!",
            })
        }

        const alreadyRegistered = await User.findOne({email});
        if(alreadyRegistered){
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }
        
        let otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
        });

        let result = await OTP.findOne({otp});
        while(result){
            otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({ otp });
        }


        const otpObj = await OTP.create({email,otp});

        return res.status(200).json({
            success: true,
            otp:otp,
            message: "OTP sent successfully",
        })
    }catch(err){
        console.log("Error while sending verification otp ", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
        });
    }
}


// sign up
async function signUp(req,res){
    try{
        const {fname,lname,email,password,role,otp} = req.body;
        let profileModel;
        if(!fname || !lname || !email || !password || !role || !otp ){
            return res.status(400).json({
                success: false,
                message: "Some fields are empty, please fill the details correctly"
            })
        }
        const alreadyRegistered = await User.findOne({email});
        if(alreadyRegistered){
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        // if(password !== confirmPassword){
        //      return res.status(400).json({
        //         success: false,
        //         message: "Password and confirm password values not matching, please try again",
        //     });
        // }

        const otpObj = await OTP.find({email:email}).sort({createdAt: -1}).limit(1);

        if(otpObj.length === 0){
            return res.status(400).json({
                success: false,
                message: "OTP expired, please regenerate otp",
            })
        }

        if(otp !== otpObj[0].otp){
            return res.status(401).json({
                success: false,
                message: "Invalid otp",
            })
        }

        await OTP.findByIdAndDelete(otpObj[0]._id);

        const hashedPassword = await bcrypt.hash(password,10);


        let imageUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${fname} ${lname}`;


        let profileDetails;
        if(role === "Student"){
            profileModel = "StudentProfile";
            profileDetails = await StudentProfile.create({
                rollNumber: null,
                branch: null,
                year: null,
                skills: null,
                interests: null,
                name: `${fname} ${lname}`,
                bio: null,
                imageUrl,
            });
        }else if(role === "Alumni"){
            profileModel = "AlumniProfile";
            profileDetails = await AlumniProfile.create({
                graduationYear: null,
                department: null,
                currentJobTitle: null,
                company: null,
                experienceYears: null,
                bio: null,
                imageUrl
            });
        }else if(role === 'Admin'){
            profileModel = "AdminProfile";
            profileDetails = await AdminProfile.create({
                fullName: `${fname} ${lname}`,
                email: email,
                imageUrl,
                department: null
            });
        }
        // console.log("Profile details",profileDetails)
        // await profileDetails.save();

        
                    
        const user = await User.create({
            fname,lname,email, password:hashedPassword, profile: profileDetails._id,role,profileModel
        });

        return res.status(200).json({
            success: true,
            message: "User signed up successfully",
            data: user,
        })
    }catch(err){
        console.log("Error while sign up", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


//login

async function login(req,res){
    try{
        //fetch data
        const {email,password} = req.body;
        //validate data
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Please enter email"
            })
        }
        if(!password){
            return res.status(400).json({
                success: false,
                message: "Please enter password"
            })
        }
        //registered use hai ya nhi?
        let validUser = await User.findOne({email});
        if(!validUser){
            return res.status(400).json({
                success: false,
                message: "Account not found, please sign up first"
            });
        }
        //password check
        if(await bcrypt.compare(password,validUser.password)){
            const payload = {
                id: validUser._id,
                email: validUser.email,
                role: validUser.role,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: "5h"});
            validUser = validUser.toObject();
            validUser.token = token;
            validUser.password = null;
            return res.cookie("AluminiPortal",token,{
                expires: new Date(Date.now()+ 5*60*60*1000),
                httpOnly: true,
                // secure: true,
            }).status(200).json({
                success: true,
                data: validUser,
                token,
                message: "User Logged in Successfully"
            })
        }else{
            return res.status(401).json({
                success: false,
                message: "Wrong password, please try again",
            })
        }
        //token generate and send
    }catch(err){
        return res.status(500).json({
                success: false,
                message: err.message,
            });
    }
}


module.exports = {
    sendOtp,signUp,login
}