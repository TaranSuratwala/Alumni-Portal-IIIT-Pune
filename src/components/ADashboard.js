import React, { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation';

import { BiHomeAlt } from "react-icons/bi";
import { PiSuitcaseLight } from "react-icons/pi";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { MdOutlineEventAvailable } from "react-icons/md";
import { GoFileDirectory } from "react-icons/go";

const API_BASE = "http://localhost:4000/api/v1";

const Adashboard = ({profile}) => {
    const [loading,setLoading] = useState(true);
    const [totalJobs,setTotalJobs] = useState(0);
    const [totalEvents,setTotalEvents] = useState(0);
    const [totalNotices,setTotalNotices] = useState(0);
    const [totalAlumni,setTotalAlumni] = useState(0);

    const [jobs,setJobs] = useState([]);
    const [events,setEvents] = useState([]);
    const [notices,setNotices] = useState([]);
    const [alumni,setAlumni] = useState([]);

    async function fetchPosts(){
        try{
            const token = localStorage.getItem("token");
            setLoading(true);
            const res1 = await fetch(`${API_BASE}/posts/get-all-posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ token })
            });

            const jobPosts = await res1.json();
            setJobs(jobPosts.posts);
            setTotalJobs(jobPosts.posts.length);
            
            const res2 = await fetch(`${API_BASE}/event/get-all-events`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ token })
            });
            const events = await res2.json();
            setEvents(events.data);
            setTotalEvents(events.data.length);

            const res3 = await fetch(`${API_BASE}/notice/get-all-notices`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ token })
            });
            const notices = await res3.json();
            setNotices(notices.data);
            setTotalNotices(notices.data.length);

            const res4 = await fetch(`${API_BASE}/get-all-alumni`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ token })
            });
            const alumnis = await res4.json();
            setAlumni(alumnis.data)
            setTotalAlumni(alumnis.data.length);
        }catch(err){
            console.log(err.message);
        }
        setLoading(false)
    }

    const dashboardData = [
        {
            logo: <GoFileDirectory/>,
            title: 'Registered Alumni',
            value: totalAlumni,
        },
        {
            logo: <PiSuitcaseLight/>,
            title: 'Total Job Postings',
            value: totalJobs,
        },

        {
            logo: <MdOutlineNotificationsNone/>,
            title: 'Active Notices',
            value: totalNotices,
        },

        {
            logo: <MdOutlineEventAvailable/>,
            title: 'Upcoming Events',
            value: totalEvents,
        },

    ]

    useEffect(()=>{
        fetchPosts();
    },[])

    const codeblock = `Welcome back, ${profile.fname}! `
  return (
    <div>
        {!loading &&  <div className='px-[20px] pb-[50px]'>
            <div>
                <p className='text-[32px] font-bold'>
                    <TypeAnimation
                        sequence={[codeblock,5000,""]}
                        repeat={Infinity}
                        cursor={true}
                        omitDeletionAnimation={true}
                        wrapper="span"
                        style={{ whiteSpace: "pre-line", displa: "block" }}
                    />
                </p>
                <p className='text-sm text-[#4b5563]'>Here's a quick overview of your portal.</p>
            </div>

            <div className='flex justify-between gap-[25px] w-full mt-[40px]'>
                {
                    dashboardData.map((data)=>{
                        return (<div className='flex-1 flex items-center gap-[15px] p-[20px] shadow-[0_0_5px_1px_rgba(0,0,0,0.2)] rounded-md'>
                            <div className='bg-[#003B73] w-[50px] h-[50px] rounded-full grid place-items-center text-[24px] text-white font-bold'>
                                {data.logo}
                            </div>
                            <div>
                                <p className='text-[#6b7280] text-[14px] font-semibold'>{data.title}</p>
                                <p className='text-[#001a33] text-2xl font-bold'>{data.value}</p>
                            </div>
                        </div>)
                    })
                }
            </div>

            <div className='flex gap-[20px] mt-[40px]'>
                <div className='flex-1'>
                    <h2 className='text-lg font-semibold mb-[7px]'>Recent Job Postings</h2>
                    <div className='space-y-[10px]'>
                        {jobs.length == 0 ? <div className='w-full'>No job posts currently</div>:
                            jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,4)
                            .map(job=>{
                                return (<div key={job._id} className='p-[15px] shadow-md hover:shadow-[0_0_3px_1px_rgba(0,0,0,0.2)] transition-all duration-200 rounded-md'>
                                    <p className='text-[#003B73] font-bold'>{job.title}</p>
                                    <p className='text-[#6b7280] text-[14px]'>at {job.company}</p>
                                </div>)
                            })
                        }
                    </div>
                </div>
                <div className='flex-1'>
                    <h2 className='text-lg font-semibold mb-[7px]'>Latest Notices</h2>
                    <div className='space-y-[10px]'>
                        {notices.length == 0 ? <div className='w-full'>No notices currently</div>:
                            notices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5)
                            .map(notice=>{
                                return (<div key={notice._id} className='p-[15px] shadow-md hover:shadow-[0_0_3px_1px_rgba(0,0,0,0.2)] transition-all duration-200 rounded-md'>
                                    <p className='text-[#003B73] font-bold'>{notice.title.length>35?notice.title.slice(0,35)+'...':notice.title}</p>
                                    <p className='text-[#6b7280] text-[14px]'>{`By ${notice.createdBy.fname} ${notice.createdBy.lname}`}</p>
                                </div>)
                            })
                        }
                    </div>
                </div>
                <div className='flex-1'>
                    <h2 className='text-lg font-semibold mb-[7px]'>Upcoming Events</h2>
                    <div className='space-y-[10px]'>
                        {events.length == 0 ? <div className='w-full'>No events currently</div>:
                            events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0,5)
                            .map(event=>{
                                return (<div key={event._id} className='p-[15px] shadow-md hover:shadow-[0_0_3px_1px_rgba(0,0,0,0.2)] transition-all duration-200 rounded-md'>
                                    <p className='text-[#003B73] font-bold'>{event.name}</p>
                                    <p className='text-[#6b7280] text-[14px]'>{event.date.split('T')[0]}</p>
                                </div>)
                            })
                        }
                    </div>
                </div>
            </div>

            <div className='mt-[50px]'>
                <h2 className='text-lg font-semibold mb-[15px]'>Newly Joined Alumni</h2>
                <div className='flex flex-wrap gap-[20px] w-full'>
                        {alumni.length == 0 ? <div className='w-full'>No alumni found</div>:
                        alumni.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,4)
                        .map((a,i)=>{
                            return(
                            <div key={a._id} className='flex items-center w-[380px] p-[20px] rounded-md justify-between shadow-md hover:shadow-[0_0_5px_1px_rgba(0,0,0,0.1)] transition-all duration-200'>
                                <div className='flex gap-[20px] items-center'>
                                <img className='w-[56px] h-[56px] rounded-full object-cover' src={a.profile.imageUrl}/>
                                <div>
                                    <p>{`${a.fname} ${a.lname}`}</p>
                                    <p className='text-[14px] text-[#6b7280]'>{`${a.profile.department} - ${a.profile.graduationYear}`}</p>
                                </div>
                                </div>

                                <div className={`${a.profile.company && "px-[18px] py-[8px]"} text-sm rounded-md bg-[#f0f4f8]`} 
                                >{a.profile.company || ""}</div>
                            </div>
                            )
                        })
                        }
                </div>
            </div>
        </div>}
    </div>
  )
}

export default Adashboard;