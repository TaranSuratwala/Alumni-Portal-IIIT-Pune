import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { IoSend } from "react-icons/io5";
const API_BASE = "http://localhost:4000/api/v1";
import HorizontalDraggableSlider from './DragElement';
import HorizontalScroll from 'react-scroll-horizontal';

const Ticket = ({ role = "Student" }) => {
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState([]);
  const [createNewTicket, setCreateNewTicket] = useState(false);
  const [ticket, setTicket] = useState({ subject: "", issue: "" });
  const [posting, setPosting] = useState(false);
  const [myRoll,setMyRoll] = useState(role);

  async function fetchTickets() {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const res1 = await fetch(`${API_BASE}/ticket/get-${role === 'Admin' ? 'all' : 'my'}-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ token })
      });

      const json = await res1.json().catch(() => ({}));
      if (!res1.ok) {
        throw new Error(json.message || `Failed to fetch tickets (${res1.status})`);
      }

      const arr = Array.isArray(json.data) ? json.data : [];
      const filterTickets = arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTicketData(filterTickets);

      // ensure index is valid (0 if tickets exist, otherwise -1 to indicate none)
      setIndex(filterTickets.length > 0 ? 0 : -1);
    } catch (err) {
      console.error("fetchTickets error:", err);
      toast.error(err.message || "Failed to load tickets");
      setTicketData([]);
      setIndex(-1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
    // If role can change and you want refetch, add [role] here
  }, []);

  const createTicket = async () => {
    setPosting(true);
    try {
      const payload = { token, ...ticket };
      const res = await fetch(`${API_BASE}/ticket/create-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || "Failed to create ticket");
      } else {
        toast.success("Ticket Created Successfully");
        await fetchTickets();
        setCreateNewTicket(false);
        setTicket({ subject: "", issue: "" });
      }
    } catch (err) {
      toast.error(err.message || "Error creating ticket");
    } finally {
      setPosting(false);
    }
  };

  async function updateTicketStatus(idx){
    try {
      const payload = { token, ticketId:selected._id };
      const res = await fetch(`${API_BASE}/ticket/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Failed to updatate ticket status (${res.status})`);
      }
      toast.success("Ticket status updated");
      await fetchTickets();
      if (typeof idx === "number") setIndex(idx);
    } catch (err) {
      console.error("sendMessage error:", err);
      toast.error(err.message || "Failed to update ticket status");
    } finally {
    }
  }

  // send message to a specific ticket (ticketId), and optionally set the selected index
  async function sendMessageHandler(ticketId, idx = null) {
    if (!message || !ticketId) return toast.error("Message empty or ticket missing");
    setPosting(true);
    try {
      const payload = { token, ticketId, message };
      const res = await fetch(`${API_BASE}/ticket/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Failed to send message (${res.status})`);
      }
      setMessage("");
      toast.success("Message sent");
      await fetchTickets();
      if (typeof idx === "number") setIndex(idx);
    } catch (err) {
      console.error("sendMessage error:", err);
      toast.error(err.message || "Failed to send message");
    } finally {
      setPosting(false);
    }
  }

  if (loading) return (<div className="flex items-start justify-center content-width content-height "><div className=''>Loading...</div></div>);


  const selected = ticketData[index] || ticketData[0];

  return (
    <div>
      <div>
        <div className='flex w-[90%] mx-auto justify-between items-center'>
          <div className='text-[28px] font-bold support-ticket'>Support Tickets</div>
          <div onClick={() => setCreateNewTicket(true)} className='new-ticket px-[18px] py-[10px] bg-[#003366] text-white rounded-md cursor-pointer hover:scale-95 transition-all duration-200'>+ New Ticket</div>
        </div>

        {
            !ticketData || ticketData.length === 0 ? <div className="p-6 bg-white shadow rounded mt-[20px] w-[95%] mx-auto">No tickets found.</div>:

                <div className='ticket-container flex w-[90%] mx-auto mt-[30px] h-[500px] bg-white shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] py-[5px]'>
                    <div className='ticket-list-1 w-[35%] border-r border-r-[rgba(0,0,0,0.2)] overflow-y-auto'>
                        {ticketData.map((t, i) => (
                        <div
                            key={t._id || `${t.subject}-${i}`}
                            onClick={() => setIndex(i)}
                            className={`space-y-[5px] p-[15px] cursor-pointer ${i === index ? "bg-[#effcff] border-l-[4px] border-l-[#003366]" : ""}`}
                        >
                            <p className='text-lg font-semibold'>{t.subject}</p>
                            {role === 'Admin' && t.createdBy && <p className='text-sm'>{`Raised by: ${t.createdBy.fname || ''} ${t.createdBy.lname || ''}`}</p>}
                            <div className='text-sm text-[rgba(0,0,0,0.5)]'>
                            Raised on {t.createdAt ? t.createdAt.split('T')[0] : "N/A"}
                            </div>
                            <p className={`${t.status? "bg-[#dcfce7]" : "bg-[#ef4444a0]"} max-w-max px-[12px] py-[4px] rounded-full text-sm mt-[5px] scale-90 m-[-5px]`}>{t.status ? "open" : "closed"}</p>
                        </div>
                        ))}
                    </div>

                    <div className='ticket-list-2'>
                      <HorizontalDraggableSlider>
                          {ticketData.map((t, i) => (
                          <div
                              key={t._id || `${t.subject}-${i}`}
                              onClick={() => setIndex(i)}
                              className={`space-y-[5px] p-[15px] cursor-pointer ${i === index ? "bg-[#effcff] border-l-[4px] border-l-[#003366]" : ""}`}
                          >
                              <p className='text-lg font-semibold'>{t.subject}</p>
                              {role === 'Admin' && t.createdBy && <p className='text-sm'>{`Raised by: ${t.createdBy.fname || ''} ${t.createdBy.lname || ''}`}</p>}
                              <div className='text-sm text-[rgba(0,0,0,0.5)]'>
                              Raised on {t.createdAt ? t.createdAt.split('T')[0] : "N/A"}
                              </div>
                              <p className={`${t.status? "bg-[#dcfce7]" : "bg-[#ef4444a0]"} max-w-max px-[12px] py-[4px] rounded-full text-sm mt-[5px] scale-90 m-[-5px]`}>{t.status ? "open" : "closed"}</p>
                          </div>
                          ))}
                      </HorizontalDraggableSlider>
                    </div>

                    <div className='flex-1 px-[20px] relative overflow-hidden'>
                        <div className='mt-[10px] border-b-[1px] border-b-[rgba(0,0,0,0.2)] pb-4'>
                        <div className='flex items-center w-full justify-between'>
                            <p className='text-[24px] font-bold mb-[5px]'>{selected?.subject}</p>
                            {role=='Admin' && selected.status  && <div onClick={()=>updateTicketStatus(index)} className='bg-[#ef4444] px-[18px] py-[8px] text-sm rounded-md text-white scale-95 cursor-pointer hover:scale-90 transition-all duration-200'>Close</div>}
                            {role=='Admin' && !selected.status  && <div onClick={()=>updateTicketStatus(index)} className='bg-[#22C55E] px-[18px] py-[8px] text-sm rounded-md text-white scale-95 cursor-pointer hover:scale-90 transition-all duration-200'>Open</div>}
                        </div>
                        <p className='text-[#4b5563] text-sm mb-[5px]'>
                            {selected?.createdBy ? `Raised by ${selected.createdBy.fname || ''} ${selected.createdBy.lname || ''}` : "Raised by N/A"}
                            {selected?.createdAt ? ` on ${selected.createdAt.split('T')[0]}` : ""}
                        </p>
                        <p className='text-[#374151] mb-[10px]'>{selected?.issue}</p>
                        </div>

                        <div className={`mt-4 mb-24 space-y-3 w-full ${selected.status?"h-[270px]":"h-[350px]"} overflow-y-scroll pb-[50px]`}>
                        {/* render communications (note: field name must match server -> assumed 'communication') */}
                        {(selected.communication && selected.communication.length > 0) ? (
                            selected.communication.map((msg) => (
                            <div key={msg._id || `${msg.user?._id || 'u'}-${Math.random()}`} className={`p-3 rounded max-w-[200px] ${msg.role == myRoll ? "ml-auto bg-[#dcfce7]" : "mr-auto bg-[#e5e7eb]"}`}>
                                <p className='text-xs text-gray-600 mb-1'>{msg.user ? `${msg.user.fname || ''} ${msg.user.lname || ''}` : "System"}</p>
                                <p className='text-sm'>{msg.message}</p>
                            </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No messages yet.</p>
                        )}
                        </div>

                        {selected.status &&
                            <div className='absolute bottom-0 right-[10px] left-[10px] flex items-center gap-[5px] rounded-lg overflow-hidden pr-[10px] bg-white py-3'>
                        <input
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            placeholder='Type your message...'
                            type="text"
                            className='outline-none h-[45px] flex-1 p-[5px] px-[10px] border-[1px] border-[rgba(0,0,0,0.5)] rounded-lg'
                        />
                        <button
                            onClick={() => sendMessageHandler(selected._id, index)}
                            disabled={posting}
                            className='bg-[#003366] p-[10px] rounded-full mt-0 cursor-pointer'
                        >
                            <IoSend className='text-[20px] -rotate-[25deg] text-white' />
                        </button>
                            </div>
                        }
                    </div>
                </div>
        }

        
      </div>

      {createNewTicket &&
        <div className='flex justify-center items-center fixed left-0 right-0 top-0 h-screen bg-[rgba(255,255,255,0.5)] z-[400] overflow-x-hidden '>
          <section className='popup-1 bg-white p-[20px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] w-[750px] rounded-md space-y-[20px]'>
            <h2 className="text-[24px] font-bold mb-3 ">Create Ticket</h2>
            <div>
              <input placeholder="Subject" value={ticket.subject} onChange={(e) => setTicket(p => ({ ...p, subject: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)] mb-[20px]" />
              <textarea placeholder="Please decribe your issue in detail" value={ticket.issue} onChange={(e) => setTicket(p => ({ ...p, issue: e.target.value }))} className="w-full p-2 outline-none rounded-md border-[1px] border-[rgba(0,0,0,0.5)]" rows={3} />
              <div className="mt-[15px] flex w-full items-center justify-center gap-[10px]">
                <button onClick={() => setCreateNewTicket(false)} className="px-[18px] py-[8px] bg-[#ef4444] text-white rounded-md hover:scale-95 transition-all duration-200">Cancel</button>
                <button onClick={createTicket} disabled={posting} className="px-[18px] py-[8px] bg-[#003366] text-white rounded-md hover:scale-95 transition-all duration-200">{posting ? "Creating..." : "Create Ticket"}</button>
              </div>
            </div>
          </section>
        </div>
      }
    </div>
  );
};

export default Ticket;
