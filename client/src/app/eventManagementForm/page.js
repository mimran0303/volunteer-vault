"use client"

import React, { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';  
import axios from 'axios';
import Image from 'next/image';
import beachOne from '../../public/beachOne.png';
import { useAuth } from '@/hooks/auth'; 

export default function EventManagementForm() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isBooting, setIsBooting] = useState(true); // ? same thing as isLoading

  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [editingEvent, setEditingEvent] = useState(null); // Store the event being edited

  // Open the modal with pre-filled event data
  const openModal = (event) => {
    setEditingEvent(event); // Set the event to edit
    setEventData({
      eventAdminId: event.eventAdminId,
      eventName: event.eventName,
      location: event.location,
      eventDescription: event.eventDescription,
      skills: event.skills,
      urgency: event.urgency,
      date: event.date,
    });
    setIsModalOpen(true); // Open the modal
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null); // Clear the editing event
  };
  
  const { isAuthenticated, user, isLoading } = useAuth('administrator'); // Only admins can access
  const [eventData, setEventData] = useState({
    eventAdminId: "",
    eventName: "",
    location: "",
    eventDescription: "",
    skills: "",
    urgency: "",
    date: "",
  });

  // Set eventAdminId to user.userId when the user is available
  useEffect(() => {
    if (user) {
      setEventData((prevData) => ({
        ...prevData,
        eventAdminId: user.userId
      }));
    }
  }, [user]);

  useEffect(() => {
    // Fetch event data from the server
    axios.get('http://localhost:8080/eventManagement/events', { withCredentials: true })
      .then(response => {
        setEvents(response.data); 
        setIsBooting(false); 
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setIsBooting(false);
      });
  }, []);

  if (isLoading) {
    return <p></p>;
  }

  if (!isAuthenticated || !user) {
    return null; 
  }

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (editingEvent) {
      // Editing existing event
      axios.put(`http://localhost:8080/eventManagement/edit/${editingEvent.event_id}`, eventData, { withCredentials: true })
        .then(res => {
          if (res.status === 200) {
            alert('Event updated successfully!');
            setEvents(prevEvents => prevEvents.map(ev => ev.event_id === editingEvent.event_id ? res.data : ev)); // Update the event in state
            closeModal(); // Close the modal
          }
        })
        .catch(err => {
          console.error(err);
          alert('An error occurred while editing the event');
        });
    }
  
    // Send the form data to the server
    else {
      axios.post('http://localhost:8080/eventManagement/create', eventData)
      .then(res => {
        if (res.status === 201) {
          alert('Event created successfully!'); // Show alert on success
          window.location.reload();
        } else {
          alert('Error: ' + res.data.Error);
        }
      })
      .catch(err => {
        console.error(err); // Log any errors during the request
        alert('An error occurred while creating this event');
      });
    }
  };

  const handleDelete = (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      axios.delete(`http://localhost:8080/eventManagement/delete/${eventId}`, { withCredentials: true })
        .then(res => {
          if (res.status === 200) {
            alert('Event deleted successfully!');
            setEvents(prevEvents => prevEvents.filter(event => event.event_id !== eventId)); // Update the state to remove the deleted event
          }
        })
        .catch(err => {
          console.error(err); // Log any errors during the request
          alert('An error occurred while deleting this event');
        });
    }
  };
  
  return (
    <section id="eventManagement" className="w-screen h-screen bg-[#FAF5F1] flex">
      <div className="flex flex-row w-full">

        {/* Left section: Form and Fetched Data */}
        <div className="flex flex-col space-y-12 p-20 w-1/2 h-full overflow-y-scroll"> 
          {/* Set max-height to 100% of viewport and allow scrolling */}
          <div className="font-geistMono font-normal text-5xl italic text-[#423D38] leading-snug">EVENT MANAGEMENT FORM</div>
            
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6"> {/* Wrap input fields in a form */}
            
            <input 
              name='eventName'
              onChange={e => {setEventData({...eventData, eventName: e.target.value})}}
              required 
              maxLength="100"
              type="text" 
              placeholder="Event Name" 
              className="p-1 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
            />

            <textarea
              name="location"
              onChange={e => {setEventData({...eventData, location: e.target.value})}}
              required
              rows="1"
              placeholder="Location"
              className="block w-full px-1 py-1 bg-transparent border-b border-[#423D38] focus:ring-[#423D38] focus:border-[#423D38] placeholder-[#423D38]"
            />

            <textarea
              name="eventDescription"
              onChange={e => {setEventData({...eventData, eventDescription: e.target.value})}}
              required
              placeholder="Event Description"
              rows="4" 
              className="block w-full px-2 py-2 bg-transparent border border-[#423D38] rounded-md focus:ring-[#423D38] focus:border-[#423D38] placeholder-[#423D38]"
            />

            <select
              name="skills"
              onChange={e => {setEventData({...eventData, skills: e.target.value})}}
              required
              className="px-1 py-2 border border-[#423D38] rounded-md bg-transparent placeholder-[#423D38]"
            > 
              <option className="text-[#423D38]" value="">Select Skills</option>
              <option value="Research Skills">Research Skills</option>
              <option value="Communication Skills">Communication Skills</option>
              <option value="Teamwork">Teamwork</option>
              <option value="Physical Fitness">Physical Fitness</option>
              <option value="Botanical Knowledge">Botanical Knowledge</option>
              <option value="Knowledge of Marine Biology">Knowledge of Marine Biology</option>
              <option value="Project Management">Project Management</option>
              <option value="Advocacy and Policy Work">Advocacy and Policy Work</option>
              <option value="Fundraising Skills">Fundraising Skills</option>
              <option value="Diving Skills">Diving Skills</option>                        
            </select>

            <select
              name="urgency"
              onChange={e => {setEventData({...eventData, urgency: e.target.value})}}
              required
              className="px-1 py-2 border border-[#423D38] rounded-md bg-transparent placeholder-[#423D38]"
            > 
              <option className="text-[#423D38]" value="">Select Urgency</option>
              <option value="Urgent">Urgent</option>
              <option value="Take your time">Take your time</option>
            </select>

            <input
              name="date"
              onChange={e => {setEventData({...eventData, date: e.target.value})}}
              required
              type="date"
              className="block w-full px-2 py-2 bg-transparent border border-[#423D38] rounded-md focus:ring-[#423D38] focus:border-[#423D38]"
            />
            <button className="bg-[#423D38] hover:bg-[#B4C4C4] font-bold py-2 px-4 rounded-full mt-10 font-geistMono" style={{ color: '#FFFFFF' }} type="submit">
              ADD EVENT
            </button>
          </form>

          {/* Fetched event list */}
          <section id="eventList">
            <h1>Your Events: </h1>
            {events.length > 0 ? (
              <ul className="space-y-4">
                {events.map(event => (
                  <li key={event.event_id} className="border-b border-[#423D38] pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-[#423D38]">{event.eventName}</h2>
                        <p>{event.eventDescription}</p>
                        <p className="italic text-sm text-[#423D38]">{event.location}</p>
                        <p>{event.date}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          // ! onClick={() => handleEdit(event)}
                          onClick={() => openModal(event)}  // Open the modal on click
                          className="bg-[#a08878] hover:bg-[#bcac9c] text-white font-bold py-1 px-3 rounded-full"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.event_id)}
                          className="bg-[#B4C4C4] hover:bg-[#423D38] text-white font-bold py-1 px-3 rounded-full"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='font-style: italic'>No events available</p>
            )}
          </section>

        </div>

        {/* Right section: Fixed Image */}
        <div className="w-1/2 h-screen sticky top-0"> 
          {/* Keep the image fixed to the right side */}
          <Image 
            src={beachOne} 
            objectFit="cover" 
            className="h-full w-full"
          />
        </div>

        {/* Modal for editing */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Event"
          className="bg-white w-full max-w-lg mx-auto my-20 p-6 rounded-lg shadow-lg relative" // Modal content
          overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center" // Overlay background
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-[#423D38]">Edit Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name='eventName'
              value={eventData.eventName}
              onChange={e => setEventData({...eventData, eventName: e.target.value})}
              required
              maxLength="100"
              type="text"
              placeholder="Event Name"
              className="block w-full p-2 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
            />

            <textarea
              name="location"
              value={eventData.location}
              onChange={e => setEventData({...eventData, location: e.target.value})}
              required
              rows="1"
              placeholder="Location"
              className="block w-full p-2 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
            />

            <textarea
              name="eventDescription"
              value={eventData.eventDescription}
              onChange={e => setEventData({...eventData, eventDescription: e.target.value})}
              required
              placeholder="Event Description"
              rows="4"
              className="block w-full p-2 border border-[#423D38] bg-transparent rounded-md placeholder-[#423D38]"
            />

            <select
              name="skills"
              value={eventData.skills}
              onChange={e => setEventData({...eventData, skills: e.target.value})}
              required
              className="block w-full p-2 border border-[#423D38] bg-transparent rounded-md"
            >
              <option value="">Select Skills</option>
              <option value="Research Skills">Research Skills</option>
              <option value="Communication Skills">Communication Skills</option>
              <option value="Teamwork">Teamwork</option>
              <option value="Physical Fitness">Physical Fitness</option>
              <option value="Botanical Knowledge">Botanical Knowledge</option>
              <option value="Knowledge of Marine Biology">Knowledge of Marine Biology</option>
              <option value="Project Management">Project Management</option>
              <option value="Advocacy and Policy Work">Advocacy and Policy Work</option>
              <option value="Fundraising Skills">Fundraising Skills</option>
              <option value="Diving Skills">Diving Skills</option>
            </select>

            <select
              name="urgency"
              value={eventData.urgency}
              onChange={e => setEventData({...eventData, urgency: e.target.value})}
              required
              className="block w-full p-2 border border-[#423D38] bg-transparent rounded-md"
            >
              <option value="">Select Urgency</option>
              <option value="Urgent">Urgent</option>
              <option value="Take your time">Take your time</option>
            </select>

            <input
              name="date"
              value={eventData.date}
              onChange={e => setEventData({...eventData, date: e.target.value})}
              required
              type="date"
              className="block w-full p-2 border border-[#423D38] bg-transparent rounded-md"
            />

            <button
              type="submit"
              className="w-full bg-[#423D38] hover:bg-[#B4C4C4] text-white font-bold py-2 px-4 rounded-full mt-6"
            >
              Save Changes
            </button>
          </form>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
        </Modal>


      </div>
    </section>

  );
}
