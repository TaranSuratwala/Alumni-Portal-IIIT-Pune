import React, { useState } from 'react'
import { GiCheckMark } from "react-icons/gi";
import { BiRupee } from "react-icons/bi";
import '../index.css'
import { useNavigate } from 'react-router-dom';
import { RiDeleteBinLine } from "react-icons/ri";
import toast from 'react-hot-toast';

const API_BASE = "http://localhost:4000/api/v1";
const Job = ({job,selfPost,viewPeofileHandler,allowDelete,fetchPosts=null}) => {
    const token = localStorage.getItem("token");
    const [deleteItem,setDeleteItem] = useState(false);
    const [reason,setReason] = useState("");
    const navigate = useNavigate();

    const [posting, setPosting] = useState(false);

    const deleteHandler = async () => {
            setPosting(true);
            try {
            const payload = {
                token,
                reason,
                job,
                selfPost
            };
            const res = await fetch(`${API_BASE}/delete/delete-post`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to delete post")
                setReason('');
                setDeleteItem(false);
            }
            else{
                setReason('')
                setDeleteItem(false);
                toast.success("Post Deleted Successfully");
                fetchPosts && await fetchPosts();
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

  return (
    <div className='mb-[50px] relative'>
        <div className={`relative flex flex-col border-l-[#003B73] border-l-[8px] gap-[15px] rounded-[20px] bg-white shadow-[0_0_5px_1px_rgba(0,0,0,0.2)] job-post  p-[10px] pb-[20px] pl-[20px] mx-[20px] mr-[30px]`}>
            <div>
                <h2 className='text-[25px] font-bold text-[#001a33]'>{job.title}</h2>
                <div className='text-[#374151] font-semibold'>{`${job.company} - ${job.location}`}</div>
            </div>

            <div className='text-[#4b5563] w-[90%]'>{job.description}</div>
            <div className='text-[#4b5563] font-semibold flex items-center gap-[0]'><span>Salary:</span><BiRupee className='mt-[1px] ml-[2px]'/>{job.salary}</div>
            <div>
                <p className='text-[#4b5563] font-semibold mb-[5px]'>Requirements:</p>
                {
                    job.requirements.map((req)=>(
                        <div className='flex items-center gap-[10px]'>
                            <GiCheckMark className='text-sm text-caribbeangreen-500'/>
                            <p>{req}</p>
                        </div>
                    ))
                }
            </div>
            
            <div className='job-post-item flex flex-col items-end max-w-max absolute top-[10px] right-[20px] text-sm'>
                <p className='text-[#4b5563] '>Posted on {job.createdAt.toString().split('T')[0]}</p>
                {!selfPost &&<p className='text-[#4b5563]'>By <span onClick={()=>viewPeofileHandler(job.createdBy._id)} className='font-bold underline cursor-pointer'>{`${job.createdBy.fname} ${job.createdBy.lname}`}</span></p>}
            </div>

            {allowDelete &&  <div onClick={()=>setDeleteItem(true)} className='text-[#ef4444] font-bold max-w-max ml-auto text-xl mr-[10px] cursor-pointer hover:scale-105 transition-all duration-200'>
                <RiDeleteBinLine/>
            </div>}
        </div>

        {
            deleteItem && 
            <div className='flex justify-center items-center fixed left-0 right-0 top-0 h-screen bg-[rgba(255,255,255,0.5)] z-[400] overflow-x-hidden '>
                    <section className='bg-white p-[20px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] w-[750px] rounded-md popup-1'>
                            <h2 className="text-[24px] font-bold mb-3">Delete Post ?</h2>
                            {!selfPost && <div className="flex flex-col w-full gap-[10px]">
                                <textarea placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" rows={3} required/>
                            </div>}
                            <div className="mt-[15px] flex w-full items-center justify-center gap-[10px]">
                                <button onClick={()=>setDeleteItem(false)} className="px-[18px] py-[8px] bg-[#ef4444] text-white rounded-md hover:scale-95 transition-all duration-200">Cancel</button>
                                <button onClick={deleteHandler} disabled={posting} className="px-[18px] py-[8px] bg-[#003366] text-white rounded-md hover:scale-95 transition-all duration-200">{posting ? "Deleting..." : "Delete Post"}</button>
                            </div>
                    </section>               
            </div>
        }
    </div>
  )
}

export default Job