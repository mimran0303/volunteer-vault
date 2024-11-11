"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const VolunteerHistoryPage = () => {
    const [volunteerHistory, setVolunteerHistory] = useState([]);
    const [error, setError] = useState("");

    // Fetch volunteer history data
    const fetchVolunteerHistory = async () => {
        try {
            const response = await axios.get("http://localhost:8080/retrieveHistory", {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setVolunteerHistory(response.data); // Set the fetched data to state
        } catch (err) {
            console.error("Error fetching volunteer history:", err);
            setError("Error fetching volunteer history. Please try again later.");
        }
    };

    // Fetch the data on component mount
    useEffect(() => {
        fetchVolunteerHistory();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Volunteer History</h2>

            {error && <p className="text-red-500">{error}</p>}

            {volunteerHistory.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Volunteer Name</th>
                            <th className="py-2 px-4 border-b">Event Name</th>
                            <th className="py-2 px-4 border-b">Description</th>
                            <th className="py-2 px-4 border-b">Location</th>
                            <th className="py-2 px-4 border-b">Skills Required</th>
                            <th className="py-2 px-4 border-b">Urgency</th>
                            <th className="py-2 px-4 border-b">Event Date</th>
                            <th className="py-2 px-4 border-b">Participation Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteerHistory.map((entry) => (
                            <tr key={entry.history_id}>
                                <td className="py-2 px-4 border-b">{entry.volunteer_name}</td>
                                <td className="py-2 px-4 border-b">{entry.event_name}</td>
                                <td className="py-2 px-4 border-b">{entry.event_description}</td>
                                <td className="py-2 px-4 border-b">{entry.location}</td>
                                <td className="py-2 px-4 border-b">{entry.skills_required}</td>
                                <td className="py-2 px-4 border-b">{entry.urgency}</td>
                                <td className="py-2 px-4 border-b">{new Date(entry.event_date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{entry.participation_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No volunteer history available.</p>
            )}
        </div>
    );
};

export default VolunteerHistoryPage;





// "use client";
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import volunteer_history_bg from '../../public/rectangle48.png';
// import { useAuth } from '@/hooks/auth'; // authenticator 
//
//
//
// const VolunteerHistory = () => {
//   
//   const { isAuthenticated, user, isLoading } = useAuth('administrator'); // Only admins can access
//   const [volunteerHistory, setVolunteerHistory] = useState([]);
//   const [loadingHistory, setLoadingHistory] = useState(true);
//   const [error, setError] = useState(null);
//
//   useEffect(() => 
//   {
//     const fetchVolunteerHistory = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/retrieveHistory', {   // fetching data from retreiveHistory function in controller file
//           method: 'GET',
//           headers: {'Content-Type': 'application/json', },
//         });
//
//         if (!response.ok) {
//           throw new Error('Failed to fetch volunteer history');
//         }
//
//         const data = await response.json();
//         setVolunteerHistory(data);} 
//         
//         catch (err) {
//         setError(err.message);
//         } 
//         
//         finally {
//         setLoadingHistory(false);
//         }
//     };
//     fetchVolunteerHistory();
//   }, []);
//
//   if (isLoading) {
//     return <p>Loading...</p>;
//   }
//   if (!isAuthenticated || !user) {
//     return null; // Redirect handled in the hook
//   }
//   if (loadingHistory) {
//     return <p>Loading volunteer history...</p>;
//   }
//   if (error) {
//     return <p>Error: {error}</p>;
//   }
//
//
//
//   return (
//     <div className="bg-white bg-opacity-80 relative min-h-screen flex justify-center items-center bg-cover bg-center text-black"
//       style={{ backgroundImage: `url(${volunteer_history_bg.src})`, }}>
//
//       <div className=" p-12 rounded-lg  w-full md:w-[80%] lg:w-[100%] min-h-[750px]">
//         <h1 className="text-3xl mb-6 text-center">VOLUNTEER HISTORY</h1>
//         <table className="table-fixed w-full  min-w-full border-collapse border border-gray-400 text-left">
//
//           <thead>
//             <tr>
//               <th className="border border-gray-400 px-4 py-6 w-[100px]">Volunteer Name</th>
//               <th className="border border-gray-400 px-4 py-6 w-[125px] ">Participation Status</th>
//               <th className="border border-gray-400 px-4 py-6 w-[100px]">Event Name</th>
//               <th className="border border-gray-400 px-4 py-6 w-[125px]">Event Description</th>
//               <th className="border border-gray-400 px-4 py-6 w-[100px]">Location</th>
//               <th className="border border-gray-400 px-4 py-6 w-[100px]">Required Skills</th>
//               <th className="border border-gray-400 px-4 py-6 w-[100px]">Urgency</th>
//               <th className="border border-gray-400 px-4 py-6 w-[100px]">Event Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             
//             
//             {volunteerHistory.map((record, index) => (
//               <tr key={index}>
//                 <td className="border border-gray-400 px-4 py-6">{record.volunteerName}</td>
//                 <td className="border border-gray-400 px-4 py-6">{record.participationStatus}</td>
//                 <td className="border border-gray-400 px-4 py-6">{record.eventName}</td>
//                 <td className="border border-gray-400 px-4 py-6">{record.eventDescription}</td>
//                 <td className="border border-gray-400 px-4 py-6">{record.location}</td>
//                 <td className="border border-gray-400 px-4 py-6">{record.requiredSkills.join(', ')}</td>
//                 <td className="border border-gray-400 px-4 py-6">{record.urgency}</td>
//                 <td className="border border-gray-400 px-4 py-6">{new Date(record.eventDate).toLocaleDateString()}</td>
//               </tr>
//             ))}
//
//
//             <tr>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//             </tr>
//             <tr>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//               <td className="border border-gray-400 px-4 py-6"></td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
//
// export default VolunteerHistory;
