import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import toast from "react-hot-toast";
import Job from "./Job";
import { HiPencilAlt } from "react-icons/hi";

// replace with your env var or URL
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api/v1";

const AlumniProfileSelf = () => {
  const [profileData, setProfileData] = useState(null); // holds user.profile or profile object
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userPosts,setUserPosts] = useState(null)
  const navigate = useNavigate();

  // form state (edit)
   const [form, setForm] = useState({
    graduationYear: "",
    department: "",
    currentJobTitle: "",
    company: "",
    experienceYears: "",
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
    try {
      const res = await fetch(`${API_BASE}/getUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      const user = data.data || {}; 
      console.log("PROFILE",user)
      setProfileData(user);
      const profile = user.profile;
      setForm({
        graduationYear: profile.graduationYear ?? "",
        department: profile.department ?? "",
        currentJobTitle: profile.currentJobTitle ?? "",
        company:  profile.company ??  "",
        skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : (profile.skills || ""),
        bio: profile.bio ?? "",
        experienceYears: profile.experienceYears,
      });


      const res2 = await fetch(`${API_BASE}/get-alumni`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ token, alumniId: user._id })
      });

      const data2 = await res2.json();

      const userPosts = data2.data || {}; 
      console.log("userposts",userPosts.profile)
      setUserPosts(userPosts.profile.posts  || null);

    } catch (err) {
      setProfileData(null);
      toast.error(err.message || "Failed to fetch data")
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
    try {
      // prepare payload: convert skills to array, numbers to Number
      const payload = {
        token,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        department: form.department,
        currentJobTitle: form.currentJobTitle,
        company: form.company,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : 0,
        skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        bio: form.bio
      };

      const res = await fetch(`${API_BASE}/update-alumni-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      // refresh
    //   setForm({ graduationYear: "", department: "", currentJobTitle: "", company: "", description: "", requirements: "" });
      setEditProfile(false);
      toast.success("Profile updated Successfully");
      await fetchProfile();

    } catch (err) {
      toast.error('err.message');
    } finally {
      setSaving(false);
    }
  };


    const [updateProfilePic,setUpdateProfilePic] = useState(false);
    const [image,setImage] = useState(null);
    const updateProfilePicture = async () => {
        setSaving(true);
        try {
            // build FormData
            const fd = new FormData();

            // append image file if present (event.image should be a File object)
            if (image) {
            fd.append("image", image);
            }

            const res = await fetch(`${API_BASE}/update-profile-picture`, {
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
            setImage(null);
            setUpdateProfilePic(false);
            return;
            }

            // success
            toast.success(data.message || "Event Created Successfully");
            // clear form and close modal
            setImage(null);
            setUpdateProfilePic(false);

            // refresh list
            await fetchProfile();
        } catch (err) {
            toast.error(err.message || "Something went wrong");
            setImage(null);
            setUpdateProfilePic(false);
        } finally {
            setSaving(false);
        }
    };

  // safe render helpers
  const renderList = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return <div className="">{"-"}</div>;
    return arr.map((it, idx) => <p key={idx} className="text-sm">{it}</p>);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full pb-[30px]">
      {loading ? (
        <div className="flex items-start justify-center content-width content-height "><div className=''>Loading...</div></div> 
      ) : (
      
        profileData ?
        <div className={`w-full relative ${editProfile && "content-height overflow-hidden"}`}>
          <div className="profile-width w-[70%] bg-white rounded-md overflow-hidden mt-[70px] mx-auto">
            <div className="bg-[#003B73] h-[200px]"></div>

            <div className="flex flex-col items-center border-b-[1px] border-b-[rgba(0,0,0,0.1)] pb-[20px]">
                <div   className="profile-image relative w-[170px] h-[170px] rounded-full border-[5px] border-white mt-[-100px] bg-[#f0f4f8] overflow-hidden">
                      <img src={profileData?.profile.imageUrl}
                            className="h-full w-full object-cover"
                       />
                  <div className="opacity-0 hover:opacity-100 absolute top-0 bottom-0 left-0 right-0 rounded-full z-[100] bg-[rgba(255,255,255,0.65)] flex justify-center items-center transition-all duration-200">
                    <HiPencilAlt onClick={()=>setUpdateProfilePic(true)} className=" text-[30px] cursor-pointer"/>
                  </div>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[#1a3336] text-[36px] font-bold profile-image">{`${profileData.fname} ${profileData.lname}`}</p>
                <p className="text-[#4b5563] text-lg mt-[-8px] profile-role">Alumni</p>
                <p className="bg-[#dcfce7] flex items-center gap-[5px] text-[#166534] text-sm px-[12px] py-[5px] rounded-full mt-[10px] "><p className="w-[10px] h-[10px] rounded-full bg-caribbeangreen-400"></p>Verified</p>
              </div>
            </div>

            <div className="">
              <div className="text-[#6b7280] text-sm font-semibold w-full ">
                <div className="bg-[#f9fafb] flex w-full px-[30px] items-center py-[20px]">
                  <p className="w-[30%]">Email</p>
                  <p className="flex-1">{profileData.email || "-"}</p>
                </div>
                <div className=" flex w-full px-[30px] items-center py-[20px]">
                  <p className="w-[30%]">Department</p>
                  <p className="flex-1">{profileData.profile.department || "-"}</p>
                </div>
                <div className="bg-[#f9fafb] flex w-full px-[30px] items-center py-[20px]">
                    <p className="w-[30%]">Graduation Year</p>
                    <p className="flex-1">{profileData.profile.graduationYear || "-"}</p>
                </div>

                <div className="flex w-full px-[30px] items-center py-[20px]">
                  <p className="w-[30%]">Job Details</p>
                  <p className="flex-1">{profileData.profile.currentJobTitle ? `${profileData.profile.currentJobTitle} - ${profileData.profile.company}` :"-"}</p>
                </div>

                <div className="bg-[#f9fafb] flex w-full px-[30px] items-center py-[20px]">
                    <p className="w-[30%]">Experience</p>
                    <p className="flex-1">{profileData.profile.experienceYears || "-"}</p>
                </div>
                
              </div>

            </div>

            <div className="text-[#6b7280] text-sm font-semibold  flex w-full  items-center py-[20px] px-[30px]">
              <p className="w-[30%]">Skills</p>
              <div className="flex-1">
                {renderList(profileData.profile.skills)}
              </div>
            </div>


            <div className=" flex w-full px-[30px] items-center py-[20px] text-[#6b7280] text-sm font-semibold bg-[#f9fafb]">
                  <p className="w-[30%]">Bio</p>
                  <p className="flex-1">{profileData.profile.bio || "-"}</p>
            </div>
          </div>

        {/* Posts */}
        <div className='mt-[50px]'>
            <div className='ml-[20px] text-[#374151] font-bold text-[28px] mb-[20px]'>{`My Posts`}</div>
                <div>
                {
                    userPosts  && userPosts.length > 0 ?
                    (
                    <div>
                        {
                        userPosts.map((job)=>(
                            <Job key={job._id} job={job} selfPost={true} allowDelete={true} fetchPosts={fetchProfile}/>
                        ))
                        }
                    </div>
                    )
                    : (
                    <div className='ml-[30px] mt-[10px]'>No posts available</div>
                    ) 
                    
                }
                </div>
            </div>


          {!editProfile && <div className="absolute top-[10px] w-full z-[90] ">
            <div className="flex justify-end mx-auto  w-[70%] profile-width ">
                  <button
                    onClick={() => setEditProfile(true)}
                    className="px-[18px] py-[8px] bg-[#003B73] text-white rounded-md flex gap-[8px] items-center"
                  >
                    <FiEdit/> {editProfile ? "Cancel Edit" : "Edit Profile"}
                  </button>
            </div>
          </div>}

            {/* Edit UI example (toggle) */}
            {editProfile &&<div className="flex justify-center items-center fixed left-0 right-0 top-0 h-screen bg-[rgba(255,255,255,0.5)] z-[400] overflow-x-hidden ">
               { (
                  <div className="popup-1 mt-3 space-y-2 max-w-[700px] bg-white p-[20px] mx-auto rounded-md shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] popup-1">
                  <div className="text-[24px] font-bold mb-[10px]">Edit Profile</div>
                    <input name="graduationYear" placeholder="Graduation Year" value={form.graduationYear} onChange={handleChange} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <input name="department" placeholder="Department - CSE or ECE" value={form.department} onChange={handleChange} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <input name="currentJobTitle" placeholder="Current Job Title" value={form.currentJobTitle} onChange={handleChange} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <input name="experienceYears" placeholder="Working Experience" value={form.experienceYears} onChange={handleChange} type="number" className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <input name="skills" placeholder="Skills (Separate by , )" value={form.skills} onChange={handleChange} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" rows={4} />
                    <div className="flex justify-center items-center gap-[10px] w-full">
                      <button onClick={()=>setEditProfile(false)} disabled={saving} className="bg-[#ef4444] px-[18px] py-[6px] bg-green-600 text-white rounded hover:scale-95 transition-all duration-200">
                          Cancel
                      </button>
                      <button onClick={handleSaveProfile} disabled={saving} className="bg-[#003B73] px-[18px] py-[6px] bg-green-600 text-white rounded hover:scale-95 transition-all duration-200">
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                )}
            </div>}


             {updateProfilePic && 
                <div className='flex justify-center items-center fixed left-0 right-0 top-0 h-screen bg-[rgba(255,255,255,0.5)] z-[400] overflow-x-hidden '>
                        <section className='bg-white p-[20px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] w-[750px]'>
                            <h2 className="text-[24px] font-bold mb-3">Update Profile Picture</h2>
                            <div className="flex flex-col w-full gap-[10px]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImage(e.target.files[0] )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mt-[15px] flex w-full items-center justify-center gap-[10px]">
                                <button onClick={()=>setUpdateProfilePic(false)} className="px-[18px] py-[8px] bg-[#ef4444] text-white rounded-md hover:scale-95 transition-all duration-200">Cancel</button>
                                <button onClick={updateProfilePicture} disabled={saving} className="px-[18px] py-[8px] bg-[#003366] text-white rounded-md hover:scale-95 transition-all duration-200">{saving ? "Uploading..." : "Upload"}</button>
                            </div>
                        </section>
                </div>}

           


      </div> : 
      <div className='w-[90%] mx-auto bg-white p-[20px] rounded-md mt-[20px] text-center'>Data not found</div>
      )}
      

    </div>
  );
};

export default AlumniProfileSelf;

