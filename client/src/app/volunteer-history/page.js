// page.js
"use client";
import React, { useEffect, useState } from 'react';
import volunteer_history_bg from '../../public/rectangle48.png';
import { useAuth } from '@/hooks/auth'; // authenticator 

const VolunteerHistory = () => {
  
  const { isAuthenticated, user, isLoading } = useAuth('administrator'); // Only admins can access
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);

  // Fetch volunteer history from the backend API
  useEffect(() => {
    const fetchVolunteerHistory = async () => {
      try {
        const response = await fetch('http://localhost:8080/retrieveHistory', {   // Update URL to match backend
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        });

        //const text = await response.text(); // Log raw response text for debugging
        //console.log('Raw Response:', text);

        if (!response.ok) {
          throw new Error('Failed to fetch volunteer history');
        }

        const data = await response.json(); // Parse JSON directly
        console.log('data received', data);

        setVolunteerHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchVolunteerHistory();
  }, []);

  // Loading and error handling
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!isAuthenticated || !user) {
    return null; // Redirect handled in the hook
  }
  if (loadingHistory) {
    return <p>Loading volunteer history...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-white bg-opacity-80 relative min-h-screen flex justify-center items-center bg-cover bg-center text-black"
      style={{ backgroundImage: `url(${volunteer_history_bg.src})`, }}>
      
      <div className="p-12 rounded-lg w-full md:w-[80%] lg:w-[100%] min-h-[750px]">
        <h1 className="text-3xl mb-6 text-center">VOLUNTEER HISTORY</h1>
        <table className="table-fixed w-full min-w-full border-collapse border border-gray-400 text-left">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Volunteer Name</th>
              <th className="border border-gray-400 px-4 py-6 w-[125px]">Participation Status</th>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Event Name</th>
              <th className="border border-gray-400 px-4 py-6 w-[125px]">Event Description</th>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Location</th>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Required Skills</th>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Urgency</th>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Event Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(volunteerHistory) && volunteerHistory.map((record, index) => (
              <tr key={index}>
                <td className="border border-gray-400 px-4 py-6">{record.volunteer_name}</td>
                <td className="border border-gray-400 px-4 py-6">{record.participation_status}</td>
                <td className="border border-gray-400 px-4 py-6">{record.event_name}</td>
                <td className="border border-gray-400 px-4 py-6">{record.event_description}</td>
                <td className="border border-gray-400 px-4 py-6">{record.location}</td>
                <td className="border border-gray-400 px-4 py-6">{record.skills_required.join(', ')}</td>
                <td className="border border-gray-400 px-4 py-6">{record.urgency}</td>
                <td className="border border-gray-400 px-4 py-6">{new Date(record.event_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerHistory;
