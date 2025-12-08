import React, { useState } from 'react'
import { GiCheckMark } from "react-icons/gi";
import { IoArrowUndoOutline } from "react-icons/io5";
import Job from './Job';
import toast from 'react-hot-toast';

const API_BASE = "http://localhost:4000/api/v1";
const AlumniProfile = ({data,setIndex,setViewProfile}) => {
    const [loader,setLoader] = useState(false);
    const [openModal,setOpenModal] = useState(false);
    const [mailData,setMailData] = useState({
      title: "", message: "",
    });

    const profile = data.profile;

    function changeHandler(event){
        setMailData(pre=>{
          return ({
            ...pre,
            [event.target.name] : event.target.value
          })
        });
    }

    const [posting,setPosting] = useState(false);

    async function sendMailHandler(event){
      event.preventDefault();
      setPosting(true);
      try{
          const token = localStorage.getItem("token");
            const res1 = await fetch(`${API_BASE}/contact/send-mail`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ token,title:mailData.title,message: mailData.message, email:data.email })
            });
        
            const info = await res1.json();
            if(!res1.ok){
              toast.error(info.message || "Failed to sent mail");
              setLoader(false);
              return;
            }
            mailData.title = "";
            mailData.message = "";
            setPosting(false);
            setOpenModal(false);
            toast.success("Mail sent Successfully");
            console.log("MAIL INFO",info)
      }catch(err){
          alert(err.message);
      }
    }

  return (
    
    <div className={`pt-[30px] ${openModal ? "content-height overflow-hidden" : ""}`}>
      <div onClick={()=>{
                if(setIndex)setIndex(null);
                if(setViewProfile) setViewProfile(false);
          }} className='px-[18px] py-[3px] ml-[20px] bg-[#003366] text-white shadow-md rounded-md 
          cursor-pointer mb-[50px] flex gap-[5px] items-center max-w-max'>  
              <IoArrowUndoOutline/> Go Back
          </div>


      <div className='alumni-profile-width flex gap-[50px] bg-white p-[30px] w-[1000px] rounded-md mx-auto relative'>
          <div className='w-[150px] h-[150px] rounded-full overflow-hidden border-[5px] box-content border-white shadow-[0_0_5px_1px_rgba(0,0,0,0.3)]'>
              <img src={profile.imageUrl} className='w-full h-full object-cover'/>
          </div>
          <div className='text-[#374151] '>
              <div className='mb-[15px]'>
                <h2 className='text-3xl text-black font-bold'>{`${data.fname} ${data.lname}`}</h2>
                <div className='font-semibold'>{`${profile.department || "<Branch>"} - ${profile.graduationYear || "<Batch>"}`}</div>
              </div>

              {profile.department == null ? (<div>Profile not available currently</div>) :
                <div>
                    <div className='font-semibold mb-[15px]'>
                      <p className='text-[20px]'>{profile.currentJobTitle}</p>
                      <p className='text-[18px]'>{profile.company}</p>
                    </div>

                    <div className='font-semibold text-[18px] mb-[10px]'>
                    {`${profile.experienceYears} years Professionl Experience`}
                    </div>

                    {<div>
                    <p className='font-semibold text-[20px] mb-[10px]'>Skills: </p>
                      <div className='flex flex-col flex-wrap max-h-[200px]'>
                        {
                          profile.skills.map((skill)=>(
                            <div className='flex gap-[10px] mb-[7px] items-center'>
                              <GiCheckMark/>
                              <p>{skill}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>}

                    <div className='font-semibold mt-[20px]'>{profile.bio}</div>
                </div>
              }
          </div>

          <div onClick={()=>setOpenModal(true)}
              className='bg-[#003366] px-[18px] py-[8px] absolute right-[20px] top-[15px]
           text-richblack-5 text-[14px] font-semibold rounded-md cursor-pointer hover:scale-95 
           transition-all duration-200'>Contact</div>
      </div>

      {/* Posts */}

      <div className='mt-[50px]'>
      <div className='ml-[20px] text-[#374151] font-bold text-[28px] mb-[20px]'>{`Posts by ${data.fname}`}</div>
        <div>
          {
            profile.posts.length <= 0 ? (
              <div className='ml-[30px] mt-[10px]'>No posts available</div>
            ) :
            (
              <div>
                {
                  profile.posts.map((job)=>(
                    <Job key={job._id} job={job} selfPost={true}/>
                  ))
                }
              </div>
            )
          }
        </div>
      </div>

      {openModal &&
        <div className='flex justify-center items-center fixed left-0 right-0 top-0 h-screen bg-[rgba(255,255,255,0.5)] z-[400] overflow-x-hidden '>
      
            {
              <form onSubmit={sendMailHandler} className='popup-1 bg-white block shadow-[0_0_5px_1px_rgba(0,0,0,0.5)] min-h-[400px] p-[20px]'>
              <div className='text-black font-semibold text-[20px] mb-[15px]'>Write Email</div>
              <div>
                <div className='mb-[15px]'>
                  <input onChange={changeHandler} name='title' value={mailData.title} placeholder='Enter the title'
                    className='bg-transparent outline-none border-[1px] w-full p-[10px] text-[18px] rounded-md' required
                  />
                </div>

                <div>
                  <textarea rows={10} cols={100} onChange={changeHandler} name='message' value={mailData.message} placeholder='Enter the message'
                    className='bg-transparent outline-none border-[1px] w-full p-[10px] text-[18px] rounded-md' required
                  />
                </div>
              </div>

              <div className='flex w-full justify-center gap-[15px] mt-[15px]'>
                <button onClick={()=>setOpenModal(false)}
                  className='bg-[#ef4444] text-white px-[18px] py-[8px] rounded-md'
                >Cancel</button>

                <button type='submit' 
                  className='bg-[#003366] text-white px-[18px] py-[8px] rounded-md'
                >{posting ? "Sending..." : "Send"}</button>
              </div>

              </form>
            }

        </div>
      }
    </div>
  )
}

export default AlumniProfile