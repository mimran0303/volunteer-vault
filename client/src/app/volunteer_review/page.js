"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import volunteer_history_bg from '../../public/rectangle48.png';
import { useAuth } from '@/hooks/auth';

const VolunteerReview = () => {
  const { isAuthenticated, user, isLoading } = useAuth('administrator');
  const [eventsData, setEventsData] = useState({});
  const [volunteerStatus, setVolunteerStatus] = useState({});
  const [volunteerRatings, setVolunteerRatings] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:8080/volunteerReview/overview', { withCredentials: true })
      .then((response) => {
        const data = response.data;

        // Group data by event_id
        const groupedData = data.reduce((acc, item) => {
          if (!acc[item.event_id]) {
            acc[item.event_id] = {
              eventInfo: {
                event_id: item.event_id,
                event_name: item.event_name,
                location: item.location,
                event_city: item.event_city,
                event_state: item.event_state,
                event_zip_code: item.event_zip_code,
                event_date: item.event_date,
              },
              volunteers: []
            };
          }
          acc[item.event_id].volunteers.push(item);
          return acc;
        }, {});
        
        setEventsData(groupedData);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        let errorMessage = "An error occurred while fetching the profile.";
        if (error.response && error.response.data) {
          errorMessage += ` Reason: ${error.response.data}`;
        } else if (error.message) {
          errorMessage += ` Reason: ${error.message}`;
        }
        alert(errorMessage);
      });
  }, []);

  const handleStatusChange = (profile_id, event_id, status) => {
    setVolunteerStatus((prev) => ({
      ...prev,
      [event_id]: {
        ...prev[event_id],
        [profile_id]: status,
      },
    }));
  };

  const handleRatingChange = (profile_id, event_id, rating) => {
    setVolunteerRatings((prev) => ({
      ...prev,
      [event_id]: {
        ...prev[event_id],
        [profile_id]: rating,
      },
    }));
  };

  const handleSubmit = (event, eventId) => {
    event.preventDefault();

    const eventData = eventsData[eventId];
    const volunteers = eventData.volunteers.map((volunteer) => ({
      profile_id: volunteer.profile_owner_id,
      full_name: volunteer.full_name,
      status: volunteerStatus[eventId]?.[volunteer.profile_id] || "",
      rating: volunteerRatings[eventId]?.[volunteer.profile_id] || "",
    }));

    // Submit the data to the backend
    axios.post('http://localhost:8080/volunteerReview/review', { eventId, volunteers }, { withCredentials: true })
      .then(() => {
        alert('Volunteer data submitted successfully!');
      })
      .catch((error) => {
        console.error("Error submitting volunteer data:", error);
        alert("An error occurred while submitting the volunteer data.");
      });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div
      className="bg-white bg-opacity-80 relative min-h-screen flex flex-col items-center bg-cover bg-center text-black"
      style={{ backgroundImage: `url(${volunteer_history_bg.src})` }}
    >
      {Object.values(eventsData).map((event) => (
        <form
          key={event.eventInfo.event_id}
          className="my-8 w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg"
          onSubmit={(e) => handleSubmit(e, event.eventInfo.event_id)}
        >
          <h2 className="text-xl font-bold mb-2">
            {event.eventInfo.event_name} (Event ID: {event.eventInfo.event_id})
          </h2>
          <p>
            Location: {event.eventInfo.location}, {event.eventInfo.event_city}, {event.eventInfo.event_state} {event.eventInfo.event_zip_code}
          </p>
          <p>Date: {new Date(event.eventInfo.event_date).toLocaleDateString()}</p>

          <table className="min-w-full bg-white mt-4 border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Volunteer Name</th>
                <th className="border px-4 py-2">Participation Status</th>
                <th className="border px-4 py-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {event.volunteers.map((volunteer) => (
                <tr key={volunteer.profile_id}>
                  <td className="border px-4 py-2">{volunteer.full_name}</td>
                  <td className="border px-4 py-2">
                    <select
                      required
                      value={volunteerStatus[event.eventInfo.event_id]?.[volunteer.profile_id] || ""}
                      onChange={(e) =>
                        handleStatusChange(volunteer.profile_id, event.eventInfo.event_id, e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="">Select Status</option>
                      <option value="no-show">No-Show</option>
                      <option value="participated">Participated</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      required
                      value={volunteerRatings[event.eventInfo.event_id]?.[volunteer.profile_id] || ""}
                      onChange={(e) =>
                        handleRatingChange(volunteer.profile_id, event.eventInfo.event_id, e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="">Select Rating</option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit Review
            </button>
          </div>
        </form>
      ))}
    </div>
  );
};

export default VolunteerReview;
