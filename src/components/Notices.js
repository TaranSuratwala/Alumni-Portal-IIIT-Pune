import { useEffect, useState } from "react"
import React from 'react'
import Notice from './Notice';
import toast from "react-hot-toast";
import AdminProfile from "./AdminProfile";

const API_BASE = "http://localhost:4000/api/v1";
const Notices = ({role,allowDelete}) => {
    const [loading,setLoading] = useState(true);
    const [notices,setNotices] = useState([]);
    const [createNewNotice,setCreateNewNotice] = useState(false);
    const token = localStorage.getItem("token");

    async function fetchNotices(){
        try{
            const token = localStorage.getItem("token");
            setLoading(true);
            const res1 = await fetch(`${API_BASE}/notice/get-all-notices`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ token })
            });
        

            const noticeData = await res1.json();
            console.log("EVENT",noticeData)

             if(!res1.ok){
                toast.error(noticeData.message || "Failed to fetch")
            }
            const filterNotices = noticeData.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNotices(filterNotices);
    
        }catch(err){
            console.log(err.message);
            toast.error(err.message || "Failed to fetch")
        }
        setLoading(false)
    }

    useEffect(()=>{
        fetchNotices();
    },[]);


     const [notice, setNotice] = useState({
                title: "",
                description: "",
                instructions: "",
                note: "",
                expiresAt: "",
                category: "" // comma-separated in UI
     });
     const [posting, setPosting] = useState(false);

    const createNotice = async () => {
            setPosting(true);
            try {
            const payload = {
                token,
                title: notice.title,
                expiresAt: notice.expiresAt,
                category: notice.category,
                description: notice.description,
                instructions: notice.instructions || ""
            };
            const res = await fetch(`${API_BASE}/notice/create-notice`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({token,payload})
            });
            const data = await res.json();
            if(!res.ok) {
                toast.error("Failed to create post");
                setNotice({ title: "", description: "", instrcuctions: "", category: "", expiresAt: "" });
                setCreateNewNotice(false);
            }
            else{
                toast.success("Notice Created Successfully");
                await fetchNotices();
            }

            setCreateNewNotice(false);
            // clear
            
            } catch (err) {
             toast.error(err.message);
             setNotice({ title: "", description: "", instrcuctions: "", category: "", expiresAt: "" });
                setCreateNewNotice(false);
            } finally {
            setPosting(false);
            }
        };

        const [viewProfile,setViewProfile] = useState(false);
        const [userData,setUserData] = useState({});

        async function viewProfileHandler(id){
                try {
                        const token = localStorage.getItem("token");
                        const res1 = await fetch(`${API_BASE}/get-user-2`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                        body: JSON.stringify({ token,id })
                    });
        
                    const user = await res1.json();
                    console.log("VIEWPROFILE",user)
                    setUserData(user.data);
                    setViewProfile(true); 
                
                } catch (err) {
                    toast.error(err.message);
                    setReason("");
                    setViewProfile(false);
                } 
        }
    
        

  return (
    <div>
        {loading ? <div className="flex items-start justify-center content-width content-height "><div className=''>Loading...</div></div> :
        <div className={`${createNewNotice && "content-height overflow-hidden"}`}>
        {!viewProfile && <div>
                <div className="flex justify-end w-full px-[20px] mb-[20px]">
                    {(role == 'admin') && !createNewNotice &&  <div onClick={()=>setCreateNewNotice(true)} className='bg-[#003366] px-[18px] py-[8px] rounded-md text-white hover:scale-95 transition-all duration-200 cursor-pointer'>+ New Notice</div>}
                </div>
                {notices && notices.length > 0 ? <div>
                        {
                        notices.map((notice)=>{
                            return(
                                <Notice key={notice._id} notice={notice} allowDelete={allowDelete} fetchNotices={fetchNotices} viewProfileHandler={viewProfileHandler}/>
                            )
                        })
                        }
                </div> : <div className='w-[90%] mx-auto bg-white p-[20px] rounded-md mt-[20px] text-center'>No notices available</div>}
            </div>}

            {
                    createNewNotice && 
                    <div className='flex justify-center items-center fixed left-0 right-0 top-0 h-screen bg-[rgba(255,255,255,0.5)] z-[400] overflow-x-hidden '>
                            <section className='popup-1 bg-white p-[20px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] w-[750px]'>
                                <h2 className="text-[24px] font-bold mb-3">Create a Notice</h2>
                                <div className="flex flex-col w-full gap-[10px]">
                                    <input placeholder="Title" value={notice.title} onChange={(e) => setNotice(p => ({ ...p, title: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                    <textarea placeholder="Description" value={notice.description} onChange={(e) => setNotice(p => ({ ...p, description: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" rows={3} />
                                    <input placeholder="Instrcutions (separate with . )  optional" value={notice.instructions} onChange={(e) => setNotice(p => ({ ...p, instructions: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                    <input placeholder="Note (optional)" value={notice.note} onChange={(e) => setNotice(p => ({ ...p, note: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                    <input placeholder="Notice expiry date (optional)" type="date" value={notice.expiresAt} onChange={(e) => setNotice(p => ({ ...p, expiresAt: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                    <select
                                        value={notice.category}
                                        onChange={(e) => setNotice(p => ({ ...p, category: e.target.value }))}
                                        className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]"
                                        >
                                        <option value="">Category (optional)</option>
                                        <option value="Placement">Placement</option>
                                        <option value="Event">Event</option>
                                        <option value="Alumni">Alumni</option>
                                        <option value="Urgent">Urgent</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                                <div className="mt-[15px] flex w-full items-center justify-center gap-[10px]">
                                    <button onClick={()=>setCreateNewNotice(false)} className="px-[18px] py-[8px] bg-[#ef4444] text-white rounded-md hover:scale-95 transition-all duration-200">Cancel</button>
                                    <button onClick={createNotice} disabled={posting} className="px-[18px] py-[8px] bg-[#003366] text-white rounded-md hover:scale-95 transition-all duration-200">{posting ? "Posting..." : "Create Post"}</button>
                                </div>
                            </section>
                    </div>
                }


                {
                    viewProfile && <AdminProfile data={userData} setViewProfile={setViewProfile}/>
                }
        </div>}
    </div>
  )
}

export default Notices