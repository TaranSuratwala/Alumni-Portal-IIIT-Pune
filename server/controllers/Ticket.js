const Communication = require("../models/Communication");
const Ticket = require("../models/Ticket");


async function createTicket(req,res){
    try{
        const {subject,issue} = req.body;

        if(!subject || !issue){
            return res.status(400).json({
                success: false,
                message: "All fields are compulsory",
            })
        }

        const id = req.user.id;

        const ticket = await Ticket.create({
            subject,issue,createdBy: id,
        });

        return res.status(200).json({
            success: false,
            message: "Ticket created successfully",
            ticket
        })
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}


async function getAllTickets(req,res){
    try{
        const tickets = await Ticket.find().populate('createdBy').populate({
            path: "communication",
            populate:{
                path: 'user',
            }
        }).exec();

        return res.status(200).json({
            success: false,
            message: "Ticket created successfully",
            data: tickets
        })

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}





async function getMyTickets(req,res){
    try{
        const tickets = await Ticket.find({createdBy: req.user.id}).populate('createdBy').populate({
            path: "communication",
            populate:{
                path: 'user',
            }
        }).exec();

        return res.status(200).json({
            success: false,
            message: "Ticket created successfully",
            data: tickets
        })

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}


async function sendMessage(req,res){
    try{
        const {message,ticketId} = req.body;
        const id = req.user.id;
        if(!message){
            return res.status(400).json({
                success: false,
                message: "All fields are compulsory",
            })
        }

        const messageDetails = await Communication.create({
            message,user: id, role: req.user.role,
        });

        const updateTicket = await Ticket.findByIdAndUpdate(ticketId,{$push: {communication: messageDetails._id}})

        return res.status(200).json({
            success: false,
            message: "Message sent successfully",
        })
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: err.message,
        })

    }
}

async function updateStatus(req,res) {
    try{
        const {ticketId} = req.body;
        if(!ticketId){
            return res.status(400).json({
                success: false,
                message: "Ticket id missing",
            })
        }

        const ticketDetails = await Ticket.findById(ticketId);
        if(ticketDetails.status){
            ticketDetails.status = false;
        }else{
            ticketDetails.status = true;
        }

        await ticketDetails.save();

        return res.status(200).json({
            success: true,
            message: "Status updated successfully",
        })
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

module.exports = {
    createTicket,getAllTickets,getMyTickets,sendMessage,updateStatus
}