import React from 'react'
import toast from 'react-hot-toast';
import { GiCheckMark } from "react-icons/gi";
import { useState } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import AdminProfile from './AdminProfile';

const API_BASE = "http://localhost:4000/api/v1";
const Notice = ({notice,allowDelete,fetchNotices,viewProfileHandler}) => {
    const token = localStorage.getItem("token");
        const [deleteItem,setDeleteItem] = useState(false);
        const [reason,setReason] = useState("");
        const [posting, setPosting] = useState(false);


        const deleteHandler = async () => {
                setPosting(true);
                try {
                const payload = {
                    token,
                    notice
                };
                const res = await fetch(`${API_BASE}/delete/delete-notice`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (!res.ok) {
                    toast.error(data.message || "Failed to delete notice")
                    setReason('');
                    setDeleteItem(false);
                }
                else{
                    setReason('')
                    setDeleteItem(false);
                    toast.success("Notice Deleted Successfully");
                    await fetchNotices();
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
            <div className='relative flex flex-col gap-[15px] rounded-[20px] bg-white shadow-[0_0_5px_1px_rgba(0,0,0,0.2)]
             border-l-[#ffc72c] event-post border-l-[5px]  p-[20px] pb-[20px] pl-[20px] mx-[20px] mr-[30px]'>
                <div>
                    <h2 className='text-[25px] font-bold text-[#001a33] w-[90%]'>{notice.title}</h2>
                </div>
    
                <div className='text-[#4b5563] max-w-[70%] mb-[5px] w-[90%]'>{notice.description}</div>
                {notice.instructions.length > 0 && <div>
                    <p className='text-[#4b5563] font-semibold mb-[5px]'>Important Instructions:</p>
                    {
                        notice.instructions.map((notice)=>( notice.length>0 &&
                            <div className='flex items-center gap-[10px]'>
                                <GiCheckMark className='text-sm text-caribbeangreen-500'/>
                                <p>{notice}</p>
                            </div>
                        ))
                    }

                    <div className='mt-[10px] mb-[15px]'>{notice.note ? notice.note : ""}</div>
                </div>}

                <div className='flex w-full justify-between pr-[8px] notice-post-item2'>
                    <div className='bg-[#dbeafe] px-[20px] py-[6px] rounded-lg tracking-[0.7px] font-semibold max-w-max text-[12px]'>
                        {`${notice.category}`}
                    </div>
                    <div className='text-sm text-[#4b5563]'>{notice.expiresAt &&`Expires on ${notice.expiresAt.split('T')[0]}`}</div>
                </div>
                <div className='flex flex-col items-end max-w-max absolute top-[10px] right-[20px] text-sm notice-post-item'>
                    <p className='text-[#4b5563] '>Posted on {notice.createdAt.split('T')[0]}</p>
                    <p className='text-[#4b5563]'>By <span onClick={()=>viewProfileHandler(notice.createdBy._id)} className='font-bold underline cursor-pointer'>{`${notice.createdBy.fname} ${notice.createdBy.lname}`}</span></p>
                </div>

                {allowDelete &&  <div onClick={()=>setDeleteItem(true)} className='text-[#ef4444] font-bold max-w-max ml-auto text-xl mr-[10px] cursor-pointer hover:scale-105 transition-all duration-200'>
                                                <RiDeleteBinLine/>
                </div>}
            </div>

            {
             deleteItem && 
                <div className='flex justify-center items-center fixed left-0 right-0 top-0 h-screen bg-[rgba(255,255,255,0.5)] z-[400] overflow-x-hidden '>
                        <section className='bg-white p-[20px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] w-[350px] rounded-md space-y-[20px]'>
                                <h2 className="text-[24px] font-bold mb-3 text-center">Delete Notice ?</h2>
                                <div className="mt-[15px] flex w-full items-center justify-center gap-[10px]">
                                    <button onClick={()=>setDeleteItem(false)} className="px-[18px] py-[8px] bg-[#ef4444] text-white rounded-md hover:scale-95 transition-all duration-200">Cancel</button>
                                    <button onClick={deleteHandler} disabled={posting} className="px-[18px] py-[8px] bg-[#003366] text-white rounded-md hover:scale-95 transition-all duration-200">{posting ? "Deleting..." : "Delete Notice"}</button>
                                </div>
                        </section>               
                </div>
            }


            
        </div>
  )
}

export default Notice