const uploadToCloudinary = require('../utils/imageUploader');
const Event = require('../models/Event');

async function createEvent(req,res){
    try{
        const {name, description,location,date,time} = req.body;
        const image = req.files.image;
    
        if(!name || !description || !location || !date || !time || !image){
            return res.status(400).json({
                success: false,
                message: "All fields are compulsory",
            });
        }

        console.log("Image",image)

        const [year, month, day] = date.split("-").map(Number);
        const eventDate = new Date(year, month - 1, day); // local timezone date
        const dayName = eventDate.toLocaleString("en-US", { weekday: "long" });

        const image_url = (await uploadToCloudinary("Alumni Portal",image)).secure_url;

        const eventDetails = await Event.create({
            name, description, location, time, date: eventDate, day: dayName, createdBy: req.user.id,image: image_url,
        });

        return res.status(200).json({
            success: true,
            message: "Event created successfully",
            eventDetails,
        });

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
        });
    }
}



async function getAllEvents(req,res){
    try{
        const events = await Event.find({}).populate('createdBy');
        return res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            data: events,
        });
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
        })
    }
}


async function updateInterestedCandidate(req,res){
    try{
        const {eventId} = req.body;
        if(!eventId){
            return res.status(400).json({
                success: false,
                message: "All fields are compulsory",
            })
        }
        const userId = req.user.id;
        const event = await Event.findById(eventId);
        if(event.interestedCandidates.includes(userId)){
            const updatedEvent = await Event.findByIdAndUpdate(eventId,{$pull:{interestedCandidates: userId}});
        }else{
            const updatedEvent = await Event.findByIdAndUpdate(eventId,{$push:{interestedCandidates: userId}});
        }

        return res.status(200).json({
            success: true,
            message: "Interested candidates updates successfully",
        })
    }catch(err){
        console.log(err.message);
        return res.status(200).json({
            success: false,
            message: err.message,
        })
    }
}


async function deleteEvent(req,res){
  try{
    const {event} = req.body;
    if(!event){
      return res.status(400).json({
        success: false,
        message: "All fields are compulsory",
      })
    }

    const deletedEvent = await Event.findByIdAndDelete(event._id);

    
    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    })
  }catch(err){
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    })
  }
}

module.exports = {
    createEvent,getAllEvents,updateInterestedCandidate,deleteEvent
}