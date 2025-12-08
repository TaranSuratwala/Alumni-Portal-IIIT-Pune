// import React, { useState , useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AlumniProfile from '../components/AlumniProfile'
// const API_BASE = "http://localhost:4000/api/v1";

// function AlumniDashboard() {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState(null);
//   const [editProfile,setEditProfile] = useState(false);

//   // form state (edit)
//   const [form, setForm] = useState({
//     graduationYear: "",
//     department: "",
//     currentJobTitle: "",
//     company: "",
//     experienceYears: "",
//     skills: "", // comma separated in UI
//     bio: ""
//   });

//   useEffect(() => {
//     fetchProfile();
//     // eslint-disable-next-line
//   }, []);

//   const token = localStorage.getItem("token");

//   const fetchProfile = async () => {
//     setLoading(true);
//     setMsg(null);
//     try {
//       const res = await fetch(`${API_BASE}/getUser`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ token })
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
//       const user = data.data; // support both shapes
//       // Map server fields to form fields if present inside 'profile' or top-level
//       const profileData = user; // sometimes user contains profile directly
//       setProfile(profileData);
//       setForm({
//         graduationYear: profileData.graduationYear || "",
//         department: profileData.department || "",
//         currentJobTitle: profileData.currentJobTitle || "",
//         company: profileData.company || "",
//         experienceYears: profileData.experienceYears ?? "",
//         skills: (profileData.skills && profileData.skills.join(", ")) || "",
//         bio: profileData.bio || ""
//       });
//     } catch (err) {
//       setMsg({ type: "error", text: err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

  // const handleSaveProfile = async () => {
  //   setEditProfile(false)
  //   setSaving(true);
  //   setMsg(null);
  //   try {
  //     // prepare payload: convert skills to array, numbers to Number
  //     const payload = {
  //       token,
  //       graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
  //       department: form.department,
  //       currentJobTitle: form.currentJobTitle,
  //       company: form.company,
  //       experienceYears: form.experienceYears ? Number(form.experienceYears) : 0,
  //       skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
  //       bio: form.bio
  //     };

  //     const res = await fetch(`${API_BASE}/update-alumni-profile`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  //       body: JSON.stringify(payload)
  //     });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message || "Failed to update profile");
  //     setMsg({ type: "success", text: data.message || "Profile updated" });
  //     // refresh
  //     await fetchProfile();
  //   } catch (err) {
  //     setMsg({ type: "error", text: err.message });
  //   } finally {
  //     setSaving(false);
  //   }
  // };

//   const [post, setPost] = useState({
//     title: "",
//     company: "",
//     location: "",
//     salary: "",
//     description: "",
//     requirements: "" // comma-separated in UI
//   });
//   const [posting, setPosting] = useState(false);
//   const [postMsg, setPostMsg] = useState(null);

//   const createPost = async () => {
//     setPosting(true);
//     setPostMsg(null);
//     try {
//       const payload = {
//         token,
//         title: post.title,
//         company: post.company,
//         location: post.location,
//         salary: post.salary,
//         description: post.description,
//         requirements: post.requirements ? post.requirements.split(",").map(s => s.trim()).filter(Boolean) : []
//       };
//       const res = await fetch(`${API_BASE}/posts/create-post`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify(payload)
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to create post");
//       setPostMsg({ type: "success", text: data.message || "Post created" });
//       // clear
//       setPost({ title: "", company: "", location: "", salary: "", description: "", requirements: "" });
//     } catch (err) {
//       setPostMsg({ type: "error", text: err.message });
//     } finally {
//       setPosting(false);
//     }
//   };

//   if (loading) return <div className="p-8">Loading profile...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">Alumni Dashboard</h1>
//           <div className="flex gap-3">
//             <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/auth"); }} className="px-3 py-2 border rounded">Logout</button>
//             <button onClick={() => navigate("/posts")} className="px-4 py-2 bg-indigo-600 text-white rounded">View Jobs</button>
//           </div>
//         </div>

//         {msg && <div className={`mb-4 p-3 rounded ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{msg.text}</div>}
        
        

//         <AlumniProfile profile = {profile}/>

//         <div className="px-4 py-2 bg-indigo-600 text-white rounded max-w-max my-[25px]"
//             onClick={()=>setEditProfile(true)}>
//             Edit Profile
//         </div>
        
//         {editProfile && <section className="mb-6">
//           <h2 className="text-lg font-semibold mb-3">Your Profile</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm text-gray-600">Graduation Year</label>
//               <input name="graduationYear" value={form.graduationYear} onChange={handleChange} className="w-full border p-2 rounded" />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600">Department</label>
//               <input name="department" value={form.department} onChange={handleChange} className="w-full border p-2 rounded" />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600">Current Job Title</label>
//               <input name="currentJobTitle" value={form.currentJobTitle} onChange={handleChange} className="w-full border p-2 rounded" />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600">Company</label>
//               <input name="company" value={form.company} onChange={handleChange} className="w-full border p-2 rounded" />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600">Experience Years</label>
//               <input name="experienceYears" value={form.experienceYears} onChange={handleChange} type="number" className="w-full border p-2 rounded" />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600">Skills (comma separated)</label>
//               <input name="skills" value={form.skills} onChange={handleChange} className="w-full border p-2 rounded" />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600">Bio</label>
//               <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border p-2 rounded" rows={4} />
//             </div>
//           </div>

//           <div className="mt-4 flex gap-3">
//             <button onClick={handleSaveProfile} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded">{saving ? "Saving..." : "Save Profile"}</button>
//             <button onClick={fetchProfile} className="px-4 py-2 border rounded">Reload</button>
//           </div>
//         </section>}

        // <section>
        //   <h2 className="text-lg font-semibold mb-3">Create Job Post</h2>
        //   {postMsg && <div className={`mb-3 p-2 rounded ${postMsg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{postMsg.text}</div>}
        //   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        //     <input placeholder="Job title" value={post.title} onChange={(e) => setPost(p => ({ ...p, title: e.target.value }))} className="border p-2 rounded" />
        //     <input placeholder="Company" value={post.company} onChange={(e) => setPost(p => ({ ...p, company: e.target.value }))} className="border p-2 rounded" />
        //     <input placeholder="Location" value={post.location} onChange={(e) => setPost(p => ({ ...p, location: e.target.value }))} className="border p-2 rounded" />
        //     <input placeholder="Salary" value={post.salary} onChange={(e) => setPost(p => ({ ...p, salary: e.target.value }))} className="border p-2 rounded" />
        //     <textarea placeholder="Description" value={post.description} onChange={(e) => setPost(p => ({ ...p, description: e.target.value }))} className="border p-2 rounded md:col-span-2" rows={3} />
        //     <input placeholder="Requirements (comma separated)" value={post.requirements} onChange={(e) => setPost(p => ({ ...p, requirements: e.target.value }))} className="border p-2 rounded md:col-span-2" />
        //   </div>
        //   <div className="mt-4">
        //     <button onClick={createPost} disabled={posting} className="px-4 py-2 bg-green-600 text-white rounded">{posting ? "Posting..." : "Create Post"}</button>
        //   </div>
        // </section>
//       </div>
//     </div>
//   );
// }


// export default AlumniDashboard





import React, { useState , useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../assets/Alumni-logo.png'
import { BiHomeAlt } from "react-icons/bi";
import { PiSuitcaseLight } from "react-icons/pi";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { LuTicketSlash } from "react-icons/lu";
import { MdOutlineEventAvailable } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { GoFileDirectory } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";
import SDashboard from "../components/SDashboard";
import JobPosts from "../components/JobPosts";
import Events from "../components/Events";
import Notices from "../components/Notices";
import AlumniDirectory from "../components/AlumniDirectory";
import StudentProfile from "../components/StudentProfile";
import AlumniProfileSelf from "../components/AlumniProfileSelf";
import Ticket from "../components/Ticket";
import { GiHamburgerMenu } from "react-icons/gi";

const API_BASE = "http://localhost:4000/api/v1";


function AlumniDashboard() {
  const [openSidebar,setOpenSidebar] = useState(false);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // selected alumni profile
  const [error, setError] = useState(null);
  const [selectedTag,setSelectedTag] = useState('dashboard');
  const navigate = useNavigate();


    const [profile, setProfile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [editProfile,setEditProfile] = useState(false);
  
    // form state (edit)
    const [form, setForm] = useState({
      rollNumber: "",
      branch: "",
      year: "",
      interests: "",
      skills: "", // comma separated in UI
      bio: ""
    });
  
    useEffect(() => {
      fetchProfile();
      // eslint-disable-next-line
    }, []);
  
    const token = localStorage.getItem("token");
  
    const fetchProfile = async () => {
      setLoading(true);
      setMsg(null);
      try {
        const res = await fetch(`${API_BASE}/getUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ token })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

        const user = data.data; // support both shapes
        // Map server fields to form fields if present inside 'profile' or top-level
        const profileData = user; // sometimes user contains profile directly
        setProfile(profileData);

        setForm({
          rollNumber: profileData.rollNumber || "",
          branch: profileData.branch || "",
          year: profileData.year || "",
          interests: (profileData.interests && profileData.interests.join(", ")) || "",
          skills: (profileData.skills && profileData.skills.join(", ")) || "",
          bio: profileData.bio || ""
        });
      } catch (err) {
        setMsg({ type: "error", text: err.message });
      } finally {
        setLoading(false);
      }
    };



    
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((p) => ({ ...p, [name]: value }));
    };
  
    const handleSaveProfile = async () => {
      setEditProfile(false)
      setSaving(true);
      setMsg(null);
      try {
        // prepare payload: convert skills to array, numbers to Number
        const payload = {
          token,
          rollNumber: form.rollNumber ? Number(form.graduationYear) : undefined,
          branch: form.branch,
          year: form.year ? Number(form.year) : undefined,
          interests: form.interests ? form.interests.split(",").map(s => s.trim()).filter(Boolean) : [],
          skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
          bio: form.bio
        };
  
        const res = await fetch(`${API_BASE}/update-student-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update profile");
        setMsg({ type: "success", text: data.message || "Profile updated" });
        // refresh
        await fetchProfile();
      } catch (err) {
        setMsg({ type: "error", text: err.message });
      } finally {
        setSaving(false);
      }
    };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/get-all-alumni`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch alumni");
      setAlumni(data.alumni || data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading? <div className="flex items-start justify-center content-width content-height "><div className=''>Loading...</div></div> :<div className="flex bg-[#f0f4f8] min-h-screen">
      {/* SidebAR */}
        <div className={`sidebar transition-all duration-200 z-[399] ${openSidebar?"show-sidebar":""} w-[250px] fixed shrink-0  min-h-screen bg-[#003B73] overflow-hidden  text-[#D1D5DD]`}>
          <GiHamburgerMenu onClick={()=>setOpenSidebar(false)} className={`hamburgur hidden ${openSidebar?"":""} text-[30px] cursor-pointer ml-[10px] mt-[10px]`}/>
          <div className={`flex items-center gap-[5px]  ${openSidebar?"mt-[5px]":"mt-[20px]"}`}>
                <img src={logo} className="w-[50px]"/>
                <h1 className="text-white text-[24px] font-bold">Alumni Portal</h1>
          </div>
          <div>
                <ul className={`flex flex-col gap-[5px] ml-[20px] ${openSidebar?"mt-[5px]":"mt-[30px]"}`}> 
                  <li onClick={()=>{setSelectedTag('dashboard');setOpenSidebar(false)}} className={`${selectedTag === 'dashboard' ? "bg-[#FFC72C] text-[#001a33] font-semibold" : ""} pl-[10px] py-[15px] mr-[15px] rounded-md`}>
                    <NavLink>
                      <div className="flex items-center gap-[15px]">
                        <BiHomeAlt fontSize={"24px"}/>
                        <p className="text-[16px]">Dashboard</p>
                      </div>
                    </NavLink>
                  </li>

                  <li onClick={()=>{setSelectedTag('alumni-directory');setOpenSidebar(false)}} className={`${selectedTag === 'alumni-directory' ? "bg-[#FFC72C] text-[#001a33] font-semibold" : ""} pl-[10px] py-[15px] mr-[15px] rounded-md`}>
                    <NavLink>
                      <div className="flex items-center gap-[15px]">
                        <GoFileDirectory fontSize={"24px"}/>
                        <p className="text-[16px]">Alumni Directory</p>
                      </div>
                    </NavLink>
                  </li>

                  <li onClick={()=>{setSelectedTag('jobs');setOpenSidebar(false)}} className={`${selectedTag === 'jobs' ? "bg-[#FFC72C] text-[#001a33] font-semibold" : ""} pl-[10px] py-[15px] mr-[15px] rounded-md`}>
                    <NavLink>
                      <div className="flex items-center gap-[15px]">
                        <PiSuitcaseLight fontSize={"24px"}/>
                        <p className="text-[16px]">Jobs</p>
                      </div>
                    </NavLink>
                  </li>

                  <li onClick={()=>{setSelectedTag('notices');setOpenSidebar(false)}} className={`${selectedTag === 'notices'? "bg-[#FFC72C] text-[#001a33] font-semibold" : ""} pl-[10px] py-[15px] mr-[15px] rounded-md`}>
                    <NavLink>
                      <div className="flex items-center gap-[15px]">
                        <MdOutlineNotificationsNone fontSize={"24px"}/>
                        <p className="text-[16px]">Notices</p>
                      </div>
                    </NavLink>
                  </li>

                  <li onClick={()=>{setSelectedTag('events');setOpenSidebar(false)}} className={`${selectedTag === 'events' ? "bg-[#FFC72C] text-[#001a33] font-semibold" : ""} pl-[10px] py-[15px] mr-[15px] rounded-md`}>
                    <NavLink>
                      <div className="flex items-center gap-[15px]">
                        <MdOutlineEventAvailable fontSize={"24px"}/>
                        <p className="text-[16px]">Events</p>
                      </div>
                    </NavLink>
                  </li>

                  <li onClick={()=>{setSelectedTag('tickets');setOpenSidebar(false)}} className={`${selectedTag === 'tickets' ? "bg-[#FFC72C] text-[#001a33] font-semibold" : ""} pl-[10px] py-[15px] mr-[15px] rounded-md`}>
                    <NavLink>
                      <div className="flex items-center gap-[15px]">
                        <LuTicketSlash fontSize={"24px"}/>
                        <p className="text-[16px]">Tickets</p>
                      </div>
                    </NavLink>
                  </li>

                  <li onClick={()=>{setSelectedTag('profile');setOpenSidebar(false)}} className={`${selectedTag === 'profile' ? "bg-[#FFC72C] text-[#001a33] font-semibold" : ""} pl-[10px] py-[15px] mr-[15px] rounded-md`}>
                    <NavLink>
                      <div className="flex items-center gap-[15px]">
                        <BsPerson fontSize={"24px"}/>
                        <p className="text-[16px]">Profile</p>
                      </div>
                    </NavLink>
                  </li>

                  <li onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/auth"); }}  className="pl-[10px] py-[15px] mr-[15px] rounded-md cursor-pointer">
                    <div className="flex items-center gap-[15px]">
                        <FiLogOut fontSize={"24px"}/>
                        <p 
                        className="">Logout</p>
                    </div>
                  </li>
                
                </ul>
          </div>
        </div>

        
        <div  className={`dash-content ml-[250px] overflow-x-hidden overflow-y-auto text-[#001a33] flex-1`}>
        {/* Navbar */}
          <div className="dash-nav bg-white flex justify-between items-center px-[18px] py-[20px] shadow-[0px_0.1px_0.5px_0px_black] fixed z-[100] content-width">
            <div className="flex gap-[20px] items-center">
              <GiHamburgerMenu onClick={()=>setOpenSidebar(true)} className={`hamburgur hidden ${openSidebar?"":""} text-[35px] cursor-pointer`}/>
              <p className="text-[24px] font-bold capitalize">{selectedTag.replaceAll('-',' ')}</p>
            </div>
            <div onClick={()=>setSelectedTag('profile')} className="flex gap-[2px] items-center pr-[10px] cursor-pointer">
              <div className="flex flex-col items-end mr-[20px] dash-name">
                <p>{`${profile.fname} ${profile.lname}`}</p>
                <p className="text-[14px]">{profile.role}</p>
              </div>
                <img src={profile?.profile?.imageUrl} alt="" className="w-[45px] h-[45px] rounded-full object-cover"/>
            </div>
          </div>
          {/* content */}
          <div className="mt-[100px] ml-[15px]">
            {selectedTag==="dashboard" && <SDashboard profile={profile}/>}
            {selectedTag==="jobs" && <JobPosts role={'alumni'}/>}
            {/* {selectedTag==="events" ?  <Events/> : <p></p>} */}
            {selectedTag==="events" &&  <Events/> }
            {selectedTag==="notices" &&  <Notices/> }
            {selectedTag==="alumni-directory" &&  <AlumniDirectory/> }
            {selectedTag==="profile" &&  <AlumniProfileSelf/> }
            {selectedTag==="tickets" &&  <Ticket role={'Alumni'}/> }
          </div>
        </div>
      </div>}
    </div>
  )
}

export default AlumniDashboard;