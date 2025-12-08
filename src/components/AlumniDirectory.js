import React, { useEffect, useState } from 'react'
import AlumniProfile from './AlumniProfile';

const API_BASE = "http://localhost:4000/api/v1";
const AlumniDirectory = () => {
    const [alumni,setAlumni] = useState([]);
    const [loading,setLoading] = useState(true);
    const [index,setIndex] = useState(null);
    const [filter,setFilter] = useState('all');
    const [filteredAlumni,setFilteredAlumni] = useState([]);
    async function fetchAlumni(){
        try{
            const token = localStorage.getItem("token");
            setLoading(true);
            const res1 = await fetch(`${API_BASE}/get-all-alumni`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ token })
            });
        
            const alumniData = await res1.json();
            console.log("EVENT",alumniData)
            setAlumni(alumniData.data);
            setFilteredAlumni(alumniData.data);
    
        }catch(err){
            console.log(err.message);
        }
        setLoading(false)
    }

    async function handleFilter(category){
        setFilter(category);
        if(category === "all"){
          setFilteredAlumni(alumni);
        }
        else if(category === "CSE"){
          const filterArray = alumni.filter(a=>a.profile.department === "CSE");
          setFilteredAlumni(filterArray);
        }
        else if(category === "ECE"){
          const filterArray = alumni.filter(a=>a.profile.department === "ECE");
          setFilteredAlumni(filterArray);
        }
    }

    useEffect(()=>{
      fetchAlumni();
    },[])
  return (
    <div>
      {
        loading?(<div className="flex items-start justify-center content-width content-height "><div className=''>Loading...</div></div> ):(
          <div> {index === null ?
              (
                <div>
                  <div className='flex gap-[10px] px-[15px] mb-[20px]'>
                    <div onClick={()=>handleFilter('all')} className={`${filter==='all' ? "bg-[#003366] text-white" : "bg-white"} px-[18px] py-[5px] font-semibold cursor-pointer rounded-md`}>All</div>
                    <div onClick={()=>handleFilter('CSE')} className={`${filter==='CSE' ? "bg-[#003366] text-white" : "bg-white"} px-[18px] py-[5px] font-semibold cursor-pointer rounded-md`}>CSE</div>
                    <div onClick={()=>handleFilter('ECE')} className={`${filter==='ECE' ? "bg-[#003366] text-white" : "bg-white"} px-[18px] py-[5px] font-semibold cursor-pointer rounded-md`}>ECE</div>
                  </div>
                  <div className='flex flex-wrap gap-[20px] w-full p-[10px]'>
                    {filteredAlumni && filteredAlumni.length > 0 ?
                      filteredAlumni.map((a,i)=>{
                        return(
                          <div key={a._id} className='dash-alumni-directory flex items-center  bg-white w-[400px] p-[20px] rounded-md justify-between shadow-[0_0_5px_1px_rgba(0,0,0,0.1)] transition-all duration-200'>
                            <div className='flex gap-[20px] items-center'>
                              <img className='w-[56px] h-[56px] rounded-full object-cover' src={a.profile.imageUrl}/>
                              <div>
                                <p>{`${a.fname} ${a.lname}`}</p>
                                <p className='text-[14px] text-[#6b7280]'>{`${a.profile.department} - ${a.profile.graduationYear}`}</p>
                              </div>
                            </div>

                            <div className='px-[12px] py-[5px] cursor-pointer text-sm rounded-md 
                            border-[1px] border-[#003366] hover:bg-[#003366] hover:text-white 
                            transition-all duration-200 ' onClick={()=>setIndex(i)}
                            >View</div>
                          </div>
                        )
                      }) :
                   <div className='w-[90%] mx-auto bg-white p-[20px] rounded-md mt-[20px] text-center'>No alumnis available</div>}
                  </div>
                </div>
              ):
              (
                <AlumniProfile setIndex={setIndex} data={alumni[index]}/>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default AlumniDirectory