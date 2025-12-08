import React, { useEffect, useState } from 'react'
import { FaCalendarAlt } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import toast from 'react-hot-toast';
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const API_BASE = "http://localhost:4000/api/v1";

const Event = ({event,rsvpHandler,fetchEvents,allowDelete}) => {
    const id = localStorage.getItem("id");
    const [month,setMonth] = useState(event.date.toString().split('T')[0].split('-')[1]);
    const [year,setYear] = useState(event.date.toString().split('T')[0].split('-')[0]);
    const [date,setDate] = useState(event.date.toString().split('T')[0].split('-')[2]);
    const [rsvp,setRsvp] = useState(false);
    const [interestedCandidates,setInterestedCandidates] = useState(event.interestedCandidates.length);


    const token = localStorage.getItem("token");
    const [deleteItem,setDeleteItem] = useState(false);
    const [reason,setReason] = useState("");
    const [posting, setPosting] = useState(false);

    const deleteHandler = async () => {
            setPosting(true);
            try {
            const payload = {
                token,
                event
            };
            const res = await fetch(`${API_BASE}/delete/delete-event`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to delete event")
                setReason('');
                setDeleteItem(false);
            }
            else{
                setReason('')
                setDeleteItem(false);
                toast.success("Event deleted Successfully");
                await fetchEvents();
            }
            // clear
            
            } catch (err) {
                toast.error(err.message);
                setReason("");
                setDeleteItem(false);
            } finally {
            setPosting(false);
            }
        };

    const arr = event.interestedCandidates;

    useEffect(()=>{
        if(arr.includes(id)){
            setRsvp(true);
        }else{
            setRsvp(false);
        }
    },[]);


  return (
    <div className='event-post-container flex w-[91%] items-stretch max-w-[1200px] min-h-[300px] mx-[20px] mr-[50px] relative rounded-l-[10px] overflow-hidden mt-[50px] shadow-[0_0_6px_0.5px_rgba(0,0,0,0.5)]'>
        <div>
            <div className='event-post-image w-[370px] h-full'>
            <img src={event.image}
                className='w-full h-full object-cover'
            />
        </div>
        </div>
        <div className='flex flex-col justify-between p-[20px] flex-1'>
            <div>
                <div className='text-[#004a99] font-bold flex gap-[5px] items-center'>
                    <FaCalendarAlt/>
                    <p className='text-[14px] font-semibold'>{`${event.day}, ${months[Number(month)-1]} ${date}, ${year} at ${event.time}`}</p>
                </div>

                <div className='mt-[10px]'>
                    <p className='text-[#001a33] text-[24px] font-bold capitalize'>{event.name}</p>
                    <p className='text-[#4b5563] text-[16px] flex gap-[5px] items-center'><MdLocationPin/><div>{event.location}</div></p>
                </div>

                <div className='my-[20px] text-[#374151] w-[90%]'>
                    {event.description}
                </div>
            </div>

            <div className='flex items-center  justify-between mt-[10px]'>
                <div className='bg-[#dbeafe] px-[20px] py-[6px] rounded-full max-w-max'>
                    {`${interestedCandidates} Attendees`}
                </div>

                <div>
                    {
                        rsvp ? 
                        (
                           <button onClick={()=>{
                                    setRsvp(false);
                                    rsvpHandler(event._id);
                                    setInterestedCandidates(pre=>pre-1);
                            }} className='bg-[#ef4444] px-[18px] py-[8px] text-white rounded-md font-semibold hover:scale-95 transition-all duration-200'>Cancel RSVP</button>
                        ):
                        (                  
                             <button onClick={()=>{
                                    setRsvp(true);
                                    rsvpHandler(event._id);
                                    setInterestedCandidates(pre=>pre+1);
                            }} className='bg-[#003366] px-[18px] py-[8px] text-white rounded-md font-semibold hover:scale-95 transition-all duration-200'>RSVP Now</button>
                        )
                    }
                </div>
                
            </div>
            {allowDelete &&  <div onClick={()=>setDeleteItem(true)} className='text-[#ef4444] font-bold max-w-max ml-auto text-xl mr-[10px] mt-[20px] cursor-pointer hover:scale-105 transition-all duration-200'>
                                <RiDeleteBinLine/>
                    </div>}
        </div>

        {
            deleteItem && 
            <div className='flex justify-center items-center fixed left-0 right-0 top-0 h-screen bg-[rgba(255,255,255,0.5)] z-[400] overflow-x-hidden '>
                    <section className='bg-white p-[20px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] w-[350px] rounded-md space-y-[20px]'>
                            <h2 className="text-[24px] font-bold mb-3 text-center">Delete Event ?</h2>
                            <div className="mt-[15px] flex w-full items-center justify-center gap-[10px]">
                                <button onClick={()=>setDeleteItem(false)} className="px-[18px] py-[8px] bg-[#ef4444] text-white rounded-md hover:scale-95 transition-all duration-200">Cancel</button>
                                <button onClick={deleteHandler} disabled={posting} className="px-[18px] py-[8px] bg-[#003366] text-white rounded-md hover:scale-95 transition-all duration-200">{posting ? "Deleting..." : "Delete Event"}</button>
                            </div>
                    </section>               
            </div>
        }
    </div>
  )
}

export default Event