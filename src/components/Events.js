import React, { useEffect, useState } from 'react'
import Event from './Event';
import toast from 'react-hot-toast';

const API_BASE = "http://localhost:4000/api/v1";
const Events = ({role,allowDelete}) => {
    const token = localStorage.getItem("token");
    const [loading,setLoading] = useState(true);
    const [events,setEvents] = useState([]);
    const [createNewEvent,setCreateNewEvent] = useState(false);
    async function fetchEvents(){
                try{
                    const token = localStorage.getItem("token");
                    setLoading(true);
                    const res1 = await fetch(`${API_BASE}/event/get-all-events`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                        body: JSON.stringify({ token })
                    });
        
                    const eventsData = await res1.json();

                    if(!res1.ok){
                        toast.error(eventsData.message || "Failed to fetch")
                    }
                    console.log("EVENT",eventsData)
                    setEvents(eventsData.data);
    
                }catch(err){
                    console.log(err.message);
                    toast.error(err.message || "Failed to fetch")
                }
                setLoading(false)
    }
        async function rsvpHandler(eventId){
            try{
                const token = localStorage.getItem("token");
                const res1 = await fetch(`${API_BASE}/event/update-candidates`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                    body: JSON.stringify({ token,eventId })
                });
            
                // await fetchEvents();
        
            }catch(err){
                console.log(err.message);
            }
        }
        
    useEffect(()=>{
        fetchEvents();
    },[]);

    const [event, setEvent] = useState({
                    name: "",
                    description: "",
                    location: "",
                    date: "",
                    time: "",
                    image: null 
         });
    const [posting, setPosting] = useState(false);

    const createEvent = async () => {
        setPosting(true);
        try {
            // build FormData
            const fd = new FormData();

            fd.append("token", token);
            fd.append("name", event.name || "");
            fd.append("description", event.description || "");
            fd.append("location", event.location || "");
            fd.append("time", event.time || "");
            fd.append("date", event.date || "");

            // append image file if present (event.image should be a File object)
            if (event.image) {
            fd.append("image", event.image);
            }

            const res = await fetch(`${API_BASE}/event/create-event`, {
            method: "POST",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
                // IMPORTANT: do NOT set Content-Type here — browser sets the correct boundary.
            },
            body: fd
            });

            // parse response (backend should return JSON)
            const data = await res.json();

            if (!res.ok) {
            // backend error message if present
            toast.error(data.message || "Failed to create event");
            // clear form + close modal (optional)
            setEvent({ name: "", description: "", location: "", time: "", date: "", image: null });
            setCreateNewEvent(false);
            return;
            }

            // success
            toast.success(data.message || "Event Created Successfully");
            // clear form and close modal
            setEvent({ name: "", description: "", location: "", time: "", date: "", image: null });
            setCreateNewEvent(false);

            // refresh list
            await fetchEvents();
        } catch (err) {
            toast.error(err.message || "Something went wrong");
            setEvent({ name: "", description: "", location: "", time: "", date: "", image: null });
            setCreateNewEvent(false);
        } finally {
            setPosting(false);
        }
        };

  return (
    <div>{loading ? <div className="flex items-start justify-center content-width content-height "><div className=''>Loading...</div></div> :
    <div className={`${createNewEvent && "content-height overflow-hidden"}`}>
        <div className={`flex justify-end w-[91%] max-w-[1200px] mb-[20px]  mx-auto`}>
            {(role == 'admin') && !createNewEvent &&  <div onClick={()=>setCreateNewEvent(true)} className='bg-[#003366] px-[18px] py-[8px] rounded-md text-white hover:scale-95 transition-all duration-200 cursor-pointer mt-[10px]'>+ New Event</div>}
        </div>
        {events && events.length > 0 ? <div className='mt-[-40px] mb-[50px] py-[0.5px]'>
            {
                events.map((event)=>{
                    return (
                        <Event key={event._id} event={event} rsvpHandler={rsvpHandler} fetchEvents={fetchEvents} allowDelete={allowDelete}/>
                    )
                })
            }
        </div> : <div className='w-[90%] mx-auto bg-white p-[20px] rounded-md mt-[20px] text-center'>No events available</div>}

        {
                createNewEvent && 
                <div className='flex justify-center items-center fixed left-0 right-0 top-0 h-screen bg-[rgba(255,255,255,0.5)] z-[400] overflow-x-hidden '>
                        <section className='popup-1 bg-white p-[20px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] w-[750px]'>
                            <h2 className="text-[24px] font-bold mb-3">Create a Notice</h2>
                            <div className="flex flex-col w-full gap-[10px]">
                                <input placeholder="Name" value={event.name} onChange={(e) => setEvent(p => ({ ...p, name: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                <textarea placeholder="Description" value={event.description} onChange={(e) => setEvent(p => ({ ...p, description: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" rows={3} />
                                <input placeholder="Location" value={event.location} onChange={(e) => setEvent(p => ({ ...p, location: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                <input placeholder="Date" type='date' value={event.date} onChange={(e) => setEvent(p => ({ ...p, date: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                <input placeholder="Time eg 23:20" value={event.time} onChange={(e) => setEvent(p => ({ ...p, time: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setEvent((p) => ({ ...p, image: e.target.files[0] }))
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mt-[15px] flex w-full items-center justify-center gap-[10px]">
                                <button onClick={()=>setCreateNewEvent(false)} className="px-[18px] py-[8px] bg-[#ef4444] text-white rounded-md hover:scale-95 transition-all duration-200">Cancel</button>
                                <button onClick={createEvent} disabled={posting} className="px-[18px] py-[8px] bg-[#003366] text-white rounded-md hover:scale-95 transition-all duration-200">{posting ? "Posting..." : "Create Post"}</button>
                            </div>
                        </section>
                </div>
            }
    </div>
    }</div>
  )
}

export default Events