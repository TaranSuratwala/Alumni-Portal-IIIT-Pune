
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
import AdminProfile from "../components/AdminProfile";
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
      {loading ?<div className="flex items-start justify-center content-width content-height "><div className=''>Loading...</div></div>: <div className="flex bg-[#f0f4f8] min-h-screen">
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
            {selectedTag==="jobs" && <JobPosts role={'admin'} allowDelete = {true}/>}
            {/* {selectedTag==="events" ?  <Events/> : <p></p>} */}
            {selectedTag==="events" &&  <Events role={'admin'} allowDelete = {true}/> }
            {selectedTag==="notices" &&  <Notices role={'admin'} allowDelete = {true}/> }
            {selectedTag==="alumni-directory" &&  <AlumniDirectory/> }
            {selectedTag==="profile" &&  <AdminProfile/> }
            {selectedTag==="tickets" &&  <Ticket role={'Admin'}/> }
          </div>
        </div>
      </div>}
    </div>
  )
}

export default AlumniDashboard;