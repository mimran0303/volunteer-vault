"use client"

import React, { useState } from 'react'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import beachOne from '../../public/beachOne.png';
import { useAuth } from '@/hooks/auth'; 


export default function EventManagementForm() {
  const { isAuthenticated, user, isLoading } = useAuth('administrator'); // Only admins can access
  const router = useRouter(); // To redirect after successful submission
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    eventDescription: "",
    skills: "",
    urgency: "",
    date: "",
  });

  if (isLoading) {
    return <p></p>;
  }

  if (!isAuthenticated || !user) {
    return null; 
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    // Send the form data to the server
    axios.post('http://localhost:8080/auth/eventManagementForm/create', formData)
      .then(res => {
        if (res.status === 201) {
          alert('Event created successfully!'); // Show alert on success
        } else {
          alert('Error: ' + res.data.Error);
        }
      })
      .catch(err => {
        console.error(err); // Log any errors during the request
        alert('An error occurred while creating this event');
      });
  };
  
  return (

    <section id="eventManagement" className="w-screen h-screen bg-[#FAF5F1]">

<div className="flex flex-row space-x-10"> 
        <div className="flex flex-col space-y-12 p-20">
          <div className="font-geistMono font-normal text-5xl italic text-[#423D38] leading-snug">EVENT MANAGEMENT FORM</div>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6"> {/* Wrap input fields in a form */}
            <input 
              name="eventName" // Add name attribute
              value={formData.eventName} // Set value from state
              onChange={handleChange} // Add onChange handler
              required 
              maxLength="100"
              type="text" 
              placeholder="Event Name" 
              className="p-1 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
            />

            <textarea
              name="location" // Add name attribute
              value={formData.location} // Set value from state
              onChange={handleChange} // Add onChange handler
              required
              rows="1"
              placeholder="Location"
              className="block w-full px-1 py-1 bg-transparent border-b border-[#423D38] focus:ring-[#423D38] focus:border-[#423D38] placeholder-[#423D38]"
            />

            <textarea
              name="eventDescription" // Add name attribute
              value={formData.eventDescription} // Set value from state
              onChange={handleChange} // Add onChange handler
              required
              placeholder="Event Description"
              rows="4"
              className="block w-full px-2 py-2 bg-transparent border border-[#423D38] rounded-md focus:ring-[#423D38] focus:border-[#423D38] placeholder-[#423D38]"
            />

            <select
              name="skills" // Add name attribute
              value={formData.skills} // Set value from state
              onChange={handleChange} // Add onChange handler
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
              name="urgency" // Add name attribute
              value={formData.urgency} // Set value from state
              onChange={handleChange} // Add onChange handler
              required
              className="px-1 py-2 border border-[#423D38] rounded-md bg-transparent placeholder-[#423D38]"
            > 
              <option className="text-[#423D38]" value="">Select Urgency</option>
              <option value="Urgent">Urgent</option>
              <option value="Take your time">Take your time</option>
            </select>

            <input
              name="date" // Add name attribute
              value={formData.date} // Set value from state
              onChange={handleChange} // Add onChange handler
              required
              type="date"
              className="block w-full px-2 py-2 bg-transparent border border-[#423D38] rounded-md focus:ring-[#423D38] focus:border-[#423D38]"
            />
            <button className="bg-[#423D38] hover:bg-[#B4C4C4] font-bold py-2 px-4 rounded-full mt-10 font-geistMono" style={{ color: '#FFFFFF' }} type="submit"> {/* Change type to submit */}
              ADD EVENT
            </button>
          </form>
        </div>

        <Image 
          src={beachOne} 
          objectFit="cover" 
          className="h-screen w-1/2"
        />
      </div>
 </section>
  );
}