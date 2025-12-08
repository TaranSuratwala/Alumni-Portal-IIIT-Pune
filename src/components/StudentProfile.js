import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { HiPencilAlt } from "react-icons/hi";
import toast from "react-hot-toast";
// replace with your env var or URL
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api/v1";

const StudentProfile = () => {
          const [profileData, setProfileData] = useState(null); // holds user.profile or profile object
          const [loading, setLoading] = useState(true);
          const [editProfile, setEditProfile] = useState(false);
          const [saving, setSaving] = useState(false);
          const navigate = useNavigate();

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
                rollNumber: profile.rollNumber ?? "",
                branch: profile.branch ?? "",
                year: profile.year ?? "",
                interests: Array.isArray(profile.interests) ? profile.interests.join(", ") : (profile.interests || ""),
                skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : (profile.skills || ""),
                bio: profile.bio ?? ""
              });
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
            setEditProfile(false);
            setSaving(true);
            try {
              const payload = {
                token,
                rollNumber: form.rollNumber ? form.rollNumber : undefined,
                branch: form.branch || undefined,
                year: form.year ? Number(form.year) : undefined,
                interests: form.interests ? form.interests.split(",").map(s => s.trim()).filter(Boolean) : [],
                skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
                bio: form.bio || ""
              };

              const res = await fetch(`${API_BASE}/update-student-profile`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
              });

              const data = await res.json();
              if (!res.ok) throw new Error(data.message || "Failed to update profile");

              await fetchProfile();
            } catch (err) {
              toast.error(err.message);
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
                  <div className="profile-image relative w-[170px] h-[170px] rounded-full border-[5px] border-white mt-[-100px] bg-[#f0f4f8] overflow-hidden">
                      <img src={profileData?.profile.imageUrl}
                      className="h-full w-full object-cover"
                    />
                  <div className="opacity-0 hover:opacity-100 absolute top-0 bottom-0 left-0 right-0 rounded-full z-[100] bg-[rgba(255,255,255,0.65)] flex justify-center items-center transition-all duration-200">
                    <HiPencilAlt onClick={()=>setUpdateProfilePic(true)} className=" text-[30px] cursor-pointer"/>
                  </div>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[#1a3336] text-[36px] font-bold profile-name">{`${profileData.fname} ${profileData.lname}`}</p>
                <p className="text-[#4b5563] text-lg mt-[-8px] profile-role">Student</p>
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
                  <p className="w-[30%]">Branch</p>
                  <p className="flex-1">{profileData.profile.branch || "-"}</p>
                </div>
                <div className="bg-[#f9fafb] flex w-full px-[30px] items-center py-[20px]">
                    <p className="w-[30%]">Year</p>
                    <p className="flex-1">{profileData.profile.year || "-"}</p>
                </div>

                <div className="flex w-full px-[30px] items-center py-[20px]">
                  <p className="w-[30%]">MIS Number</p>
                  <p className="flex-1">{profileData.profile.rollNumber || "-"}</p>
                </div>
                
              </div>

            </div>

            <div className="text-[#6b7280] text-sm font-semibold  flex w-full bg-[#f9fafb] items-center py-[20px] px-[30px]">
              <p className="w-[30%]">Skills</p>
              <div className="flex-1">
                {renderList(profileData.profile.skills)}
              </div>
            </div>

            <div className=" text-sm font-semibold  flex w-full text-[#6b7280] items-center py-[20px] px-[30px]">
              <p className="w-[30%]">Interests</p>
              <div className="flex-1">
                {renderList(profileData.profile.interests)}
              </div>
            </div>

            <div className="bg-[#f9fafb] flex w-full px-[30px] items-center py-[20px] text-[#6b7280] text-sm font-semibold">
                  <p className="w-[30%]">Bio</p>
                  <p className="flex-1">{profileData.profile.bio || "-"}</p>
            </div>
          </div>

          {!editProfile && <div className="absolute top-[10px] w-full z-[90]">
            <div className="flex justify-end mx-auto profile-width w-[70%]  ">
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
                  <div className="popup-1 mt-3 space-y-2 max-w-[700px] bg-white p-[20px] mx-auto rounded-md shadow-[0_0_5px_1px_rgba(0,0,0,0.3)]">
                  <div className="text-[24px] font-bold mb-[10px]">Edit Profile</div>
                    <input name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="Roll number" className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <input name="branch" value={form.branch} onChange={handleChange} placeholder="Branch" className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <input name="year" value={form.year} onChange={handleChange} placeholder="Year" className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <input name="interests" value={form.interests} onChange={handleChange} placeholder="Interests (comma separated)" className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
                    <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" />
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
                        <section className='popup-1 bg-white p-[20px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] w-[750px]'>
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

           


      </div> :  <div className='w-[90%] mx-auto bg-white p-[20px] rounded-md mt-[20px] text-center'>Data not found</div>
      )}
      

    </div>
  );
};

export default StudentProfile;



  {/* <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-row-reverse items-center justify-between max-w-[600px] w-[91%]">
            <button onClick={() => {  navigate(-1); }} className="px-3 py-2 border rounded-lg">Dashboard</button>
            <h2 className="text-[#4b5563] text-3xl font-bold my-[30px]">Profile</h2>
        </div>
            <div className="flex justify-between w-[91%] max-w-[500px] text-[#4b5563] space-y-[15px] mb-[50px]  border-[2px] p-[10px]">
                <div className="space-y-[15px]">
                    <div className="space-y-[5px]">
                    <p className="text-sm">Name</p>
                    <div className="font-bold pl-[10px]">
                        {name || "-"}
                    </div>
                    </div>

                    <div className="space-y-[5px]">
                    <p className="text-sm">Roll Number</p>
                    <div className="font-bold pl-[10px]">
                        {profileData?.rollNumber ?? "—"}
                    </div>
                    </div>

                    <div className="space-y-[5px]">
                    <p className="text-sm">Interests</p>
                    <div className="font-bold pl-[10px]">
                        {renderList(profileData?.interests)}
                    </div>
                    </div>

                    <div className="space-y-[5px]">
                    <p className="text-sm">Bio</p>
                    <div className="font-bold pl-[10px]">
                        {profileData?.bio ?? "—"}
                    </div>
                    </div>
                </div>

                <div className="space-y-[15px]">
                    <div className="space-y-[5px]">
                    <p className="text-sm">Branch</p>
                    <div className="font-bold pl-[10px]">
                        {profileData?.branch ?? "—"}
                    </div>
                    </div>

                    <div className="space-y-[5px]">
                    <p className="text-sm">Year</p>
                    <div className="font-bold pl-[10px]">
                        {profileData?.year ?? "—"}
                    </div>
                    </div>

                    <div className="space-y-[5px]">
                    <p className="text-sm">Skills</p>
                    <div className="font-bold pl-[10px]">
                        {renderList(profileData?.skills)}
                    </div>
                    </div>
                </div>
                </div>
        </div> */}