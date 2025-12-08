const jwt = require('jsonwebtoken');
require('dotenv').config();


// auth
async function auth(req,res,next){
    try{
        const token =  req.cookies?.AluminiPortal || req?.header("Authorization").replace("Bearer ","") ||req.body?.token || null;
        // console.log("token",token)
        if(!token || token === undefined){
            return res.status(401).json({
                success:false,
                message: "Token missing",
            });
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decode;
            next();
        }catch(err){
            return res.status(401).json({
                success:false,
                message: "Token invalid or expired",
            });
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
                success:false,
                message: "Something went wrong, please try again",
            });
    }
}

// authz is student?

async function isStudent(req,res,next){
    try{
        const user = req.user;
        if(user.role !== "Student"){
            return res.status(403).json({
                success: false,
                message: "This is protected route for Student",
            });
        }

        next();
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
                success: false,
                message: "Something went wrong, please try again",
            });
    }
}
// authz is instructor?
async function isAlumni(req,res,next){
    try{
        const user = req.user;
        // console.log("USER",user)
        if(user.role !== "Alumni"){
            return res.status(403).json({
                success: false,
                message: "This is protected route for Alumni",
            });
        }
        

        next();
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
                success: false,
                message: "Something went wrong, please try again",
            });
    }
}

// authz is admin?

async function isAdmin(req,res,next){
    try{
        const user = req.user;
        if(user.role !== "Admin"){
            return res.status(403).json({
                success: false,
                message: "This is protected route for Admin",
            });
        }

        next();
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
                success: false,
                message: "Something went wrong, please try again",
            });
    }
}


async function allowDelete(req,res,next){
    try{
        const user = req.user;
        if(user.role === "Admin" || user.role === "Alumni"){
             return next();
        }

        return res.status(403).json({
                success: false,
                message: "You cannot delete this post",
        });
       
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
                success: false,
                message: "Something went wrong, please try again",
            });
    }
}


module.exports = {
    auth, isStudent,isAdmin,isAlumni,allowDelete
}