import React, { useState, useEffect } from 'react';
import Job from '../components/Job';
import AlumniProfile from './AlumniProfile';
import toast from 'react-hot-toast';
import AdminProfile from './AdminProfile';
const API_BASE = "http://localhost:4000/api/v1";

const JobPosts = ({role,allowDelete}) => {
    const token = localStorage.getItem("token");
    const [loading,setLoading] = useState(true);
    const [jobs,setJobs] = useState([]);
    const [viewProfile,setViewProfile] = useState(false);
    const [userData,setUserData] = useState(null);
    const [createNewPost,setCreateNewPost] = useState(false);

    async function viewPeofileHandler(id){
        try{
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
        }catch(err){
            console.log(err.message);
        }
    }
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

                if(!res1.ok){
                    // toast.error(jobPosts.message || "Failed to fetched")
                }
                const filterPost = jobPosts.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setJobs(filterPost);

            }catch(err){
                console.log(err.message);
                toast.error(err.message || "Failed to fetched")
            }
            setLoading(false)
        }
    
        useEffect(()=>{
            fetchPosts();
        },[]);



                
        const handleChange = (e) => {
            const { name, value } = e.target;
            setForm((p) => ({ ...p, [name]: value }));
        };


        const [post, setPost] = useState({
            title: "",
            company: "",
            location: "",
            salary: "",
            description: "",
            requirements: "" // comma-separated in UI
        });
        const [posting, setPosting] = useState(false);

        const createPost = async () => {
            setPosting(true);
            try {
            const payload = {
                token,
                title: post.title,
                company: post.company,
                location: post.location,
                salary: post.salary,
                description: post.description,
                requirements: post.requirements ? post.requirements.split(",").map(s => s.trim()).filter(Boolean) : []
            };
            const res = await fetch(`${API_BASE}/posts/create-post`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error("Failed to create post")
                setPost({ title: "", company: "", location: "", salary: "", description: "", requirements: "" });
                setCreateNewPost(false);
            }
            else{
                setPost({ title: "", company: "", location: "", salary: "", description: "", requirements: "" });
                setCreateNewPost(false);
                toast.success("Post Created Successfully");
                await fetchPosts();
            }
            // clear
            
            } catch (err) {
                toast.error(err.message);
                setPost({ title: "", company: "", location: "", salary: "", description: "", requirements: "" });
                setCreateNewPost(false);
            } finally {
            setPosting(false);
            }
        };

        if (loading) return <div className="flex items-start justify-center content-width content-height "><div className=''>Loading...</div></div> 
    
  return (
    <div>{!loading &&
        <div>
            {viewProfile == false ?
                <div className={`w-full relative ${createNewPost && "content-height overflow-hidden"}`} >
                    <div className={`mx-[20px] flex justify-between items-center`}>
                        <h2 className='text-[30px] font-bold '>Job Openings</h2>
                        {(role == 'alumni' || role == 'admin') && !createNewPost && <div onClick={()=>setCreateNewPost(true)} className='bg-[#003366] px-[18px] py-[8px] rounded-md text-white hover:scale-95 transition-all duration-200 cursor-pointer'>+ New Post</div>}
                    </div>
                   {jobs && jobs.length > 0 ? <div className='mt-[20px]'>
                        {
                            jobs.map((job)=>(<Job key={job._id} job={job} allowDelete = {allowDelete} viewPeofileHandler={viewPeofileHandler} fetchPosts={fetchPosts}/>))
                        }
                    </div> : <div className='w-[90%] mx-auto bg-white p-[20px] rounded-md mt-[20px] text-center'>No jobs available</div>}
                </div> :

                (userData && userData.role == 'Alumni' ? (<AlumniProfile data={userData} setViewProfile={setViewProfile}/>) :
                            (<AdminProfile data={userData} setViewProfile={setViewProfile}/>)
                )
            }


            {
                createNewPost && 
                <div className='flex justify-center items-center fixed left-0 right-0 top-0 h-screen bg-[rgba(255,255,255,0.5)] z-[400] overflow-x-hidden '>
                        <section className='popup-1 bg-white p-[20px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] w-[750px]'>
                            <h2 className="text-[24px] font-bold mb-3">Create Job Post</h2>
                            <div className="flex flex-col w-full gap-[10px]">
                                <input placeholder="Job title" value={post.title} onChange={(e) => setPost(p => ({ ...p, title: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                <input placeholder="Company" value={post.company} onChange={(e) => setPost(p => ({ ...p, company: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                <input placeholder="Location" value={post.location} onChange={(e) => setPost(p => ({ ...p, location: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                <input placeholder="Salary" value={post.salary} onChange={(e) => setPost(p => ({ ...p, salary: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                                <textarea placeholder="Description" value={post.description} onChange={(e) => setPost(p => ({ ...p, description: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" rows={3} />
                                <input placeholder="Requirements (comma separated)" value={post.requirements} onChange={(e) => setPost(p => ({ ...p, requirements: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                            </div>
                            <div className="mt-[15px] flex w-full items-center justify-center gap-[10px]">
                                <button onClick={()=>setCreateNewPost(false)} className="px-[18px] py-[8px] bg-[#ef4444] text-white rounded-md hover:scale-95 transition-all duration-200">Cancel</button>
                                <button onClick={createPost} disabled={posting} className="px-[18px] py-[8px] bg-[#003366] text-white rounded-md hover:scale-95 transition-all duration-200">{posting ? "Posting..." : "Create Post"}</button>
                            </div>
                        </section>
                </div>
            }
        </div>
        }
    </div>
  )
}

export default JobPosts