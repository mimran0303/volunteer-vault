"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import {jwtDecode} from "jwt-decode"; // Assuming you have jwt-decode installed

import notification_system_bg  from '../../public/rectangle46.png'
import volunteerProfilePic from '../../public/volunteer1pfp.jpg'



const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState("assignments");
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    console.log("Stored token:", token);
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);

      const response = await axios.get("http://localhost:8080/api/notifications", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API response:", response.data);

      if (response.data.success) {
        setNotifications(response.data.notifications);
      } else {
        setError(response.data.message || "Failed to fetch notifications.");
      }
    } catch (err) {
      setError("An error occurred while fetching notifications.");
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    return activeTab === "assignments";
  });

  return (
    <div
      className="bg-white bg-opacity-80 min-h-screen flex bg-cover bg-center p-8"
      style={{
        backgroundImage: `url(${notification_system_bg.src})`,
      }}
    >
      {/* Sidebar for tabs */}
      <div className="w-1/4 bg-white bg-opacity-20 p-6 shadow-md">
        {/* Profile Picture and Name */}
        <div className="flex items-center mb-6">
          <Image
            src={volunteerProfilePic} // Profile picture
            alt="Volunteer Profile Picture"
            width={100} // Width of the profile picture
            height={100} // Height of the profile picture
            className="rounded-full mr-4"
          />
          <h2 className="text-xl text-black font-semibold">{userId ? `User ID: ${userId}` : "Loading..."}</h2>
        </div>
        {/* Horizontal bar (divider) */}
        <div className="border-b border-gray-400 mb-4"></div>

        {/* Navigation Tabs */}
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleTabClick("assignments")}
              className={`${
                activeTab === "assignments" ? "text-black font-bold border-b-4 border-black" : "text-gray-600 border-b"
              } text-center text-2xl w-full p-20`}
            >
              New Assignments
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabClick("updates")}
              className={`${
                activeTab === "updates" ? "text-black font-bold border-b-4 border-black" : "text-gray-600 border-b"
              } text-center text-2xl w-full p-20`}
            >
              Updates
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabClick("reminders")}
              className={`${
                activeTab === "reminders" ? "text-black font-bold border-b-4 border-black" : "text-gray-600 border-b"
              } text-center text-2xl w-full p-20`}
            >
              Reminders
            </button>
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="text-black flex-1 bg-white bg-opacity-20 p-6 ml-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        <div className="border border-gray-300 p-4">
          <h3 className="text-lg font-semibold mb-4">
            {activeTab === "assignments" && "Assignment Notifications"}
            {activeTab === "updates" && "Updates Notifications"}
            {activeTab === "reminders" && "Reminders Notifications"}
          </h3>
          {filteredNotifications.length > 0 ? (
            <ul className="list-disc pl-6 space-y-2">
              {filteredNotifications.map((notification, index) => (
                <li key={index}>
                  {activeTab === "assignments" ? (
                    <div>
                      <p className="font-bold">{notification.message}</p>
                      <p>Description: {notification.eventDescription}</p>
                      <p>Date: {new Date(notification.eventDate).toLocaleDateString()}</p>
                    </div>
                  ) : (
                    <p>{notification.message}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;




// "use client";
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// // import { decode as jwtDecode } from 'jwt-decode';  // Corrected import
// import { jwtDecode } from 'jwt-decode'

// const NotificationPage = () => {
//     const [notifications, setNotifications] = useState([]);
//     const [error, setError] = useState('');
//     const [userId, setUserId] = useState(null);

//     // Fetch notifications function
//     // const fetchNotifications = async () => {
//     //     const token = localStorage.getItem('token');
//     //     console.log("Stored token:", token);

//     //     if (!token) {
//     //         setError('No token found. Please log in.');
//     //         return;
//     //     }

//     //     try {
//     //         const response = await axios.get('http://localhost:8080/api/notifications', {
//     //             withCredentials: true,
//     //             headers: {
//     //                 'Authorization': `Bearer ${token}`,
//     //                 'Content-Type': 'application/json',
//     //             },
//     //         });

//     //         // Log the response to see what is being returned
//     //         console.log("API response:", response.data);

//     //         // Update the notifications state
//     //         if (response.data.success && response.data.notifications) {
//     //             setNotifications(response.data.notifications);
//     //             console.log("Updated Notifications:", response.data.notifications);
//     //         } else {
//     //             setError(response.data.message || 'Failed to fetch notifications.');
//     //         }
//     //     } catch (err) {
//     //         setError('An error occurred while fetching notifications.');
//     //         console.error('Error fetching notifications:', err);
//     //     }
//     // };
//     const fetchNotifications = async () => {
//         const token = localStorage.getItem('token'); // Get token from localStorage or use cookies if needed
//         console.log("stored token", token);
//         if (!token) {
//             setError('No token found. Please log in.');
//             return;
//         }

//         try {
//             // Decode token to extract userId
//             const decodedToken = jwtDecode(token);
//             setUserId(decodedToken.userId); // Set userId in state

//             // Make an API call to get notifications
//             const response = await axios.get('http://localhost:8080/api/notifications', {
//                 withCredentials: true, // Include cookies in request if token is stored in cookies
//                 headers: {
//                     'Authorization': `Bearer ${token}`, // Include token in Authorization header
//                     'Content-Type': 'application/json',
//                 },
//             });

//             console.log("API response:", response.data);

//             // Check if the response was successful
//             if (response.data.success) {
//                 setNotifications(response.data.notifications);
//             } else {
//                 setError(response.data.message || 'Failed to fetch notifications.');
//             }
//         } catch (err) {
//             setError('An error occurred while fetching notifications.');
//             console.error('Error fetching notifications:', err);
//         }
//     };

//     // Fetch notifications on component mount
//     useEffect(() => {
//         fetchNotifications();
//     }, []);
//     useEffect(() => {
//     console.log("Notifications state updated:", notifications);  // Log the state change
// }, [notifications]);

//     return (
//         <div>
//             <h2>Notifications</h2>
//             {error && <p className="error">{error}</p>}
//             <ul>
//                 {notifications.length > 0 ? (
//                     notifications.map((notification, index) => (
//                         <li key={index}>
//                             {notification.message} - {new Date(notification.date).toLocaleString()}
//                         </li>
//                     ))
//                 ) : (
//                     <li>No notifications available</li>
//                 )}
//             </ul>
//             <div>
//                 <h3>User ID from Token: {userId ? userId : 'Not available'}</h3>
//             </div>
//         </div>
//     );
// };

// export default NotificationPage;






// "use client";

// import React, { useState } from 'react'

// import Link from 'next/link';
// import Image from "next/image";
// import notification_system_bg from '../../public/rectangle46.png'
// import volunteerProfilePic from '../../public/volunteer1pfp.jpg'

// import { useAuth } from '@/hooks/auth'; // authenticator

// const NotificationPage = () => {
//   const { isAuthenticated, user, isLoading } = useAuth(); // Both admins and non-admins can access (no "administrator argument")

//   // State to track the selected tab
//   const [activeTab, setActiveTab] = useState("assignments");

//   // Handle tab switching
//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   if (isLoading) {
//     return <p></p>;
//   }

//   if (!isAuthenticated || !user) {
//     return null; // Redirect handled in the hook
//   }

//   return (
//     <div
//       className="bg-white bg-opacity-80 min-h-screen flex bg-cover bg-center p-8"
//       style={{
//         backgroundImage: `url(${notification_system_bg.src})`,
//       }}
//     >
//       {/* Sidebar for tabs */}
//       <div className="w-1/4 bg-white bg-opacity-20 p-6 shadow-md">
//         {/* Profile Picture and Name */}
//         <div className="flex items-center mb-6">
//           <Image
//             src={volunteerProfilePic} // Profile picture
//             alt="Volunteer Profile Picture"
//             width={100} // Width of the profile picture
//             height={100} // Height of the profile picture
//             className="rounded-full mr-4"
//           />
//           <h2 className="text-xl text-black font-semibold">{user.username}</h2> {/* Name of volunteer */}
//         </div>
//          {/* Horizontal bar (divider) */}
//         <div className="border-b border-gray-400 mb-4"></div>

//         {/* Navigation Tabs */}
//         <ul className="space-y-4">
//           <li>
//             <button
//               onClick={() => handleTabClick("assignments")}
//               className={`${
//                 activeTab === "assignments" ? "text-black font-bold border-b-4 border-black" : "text-gray-600 border-b"
//               } text-center text-2xl w-full p-20`}
//             >
//               New Assignments
//             </button>
//           </li>
//           <li>
//             <button
//               onClick={() => handleTabClick("updates")}
//               className={`${
//                 activeTab === "updates" ? "text-black font-bold border-b-4 border-black" : "text-gray-600 border-b"
//               } text-center text-2xl w-full p-20`}
//             >
//               Updates
//             </button>
//           </li>
//           <li>
//             <button
//               onClick={() => handleTabClick("reminders")}
//               className={`${
//                 activeTab === "reminders" ? "text-black font-bold border-b-4 border-black" : "text-gray-600 border-b"
//               } text-center text-2xl w-full p-20`}
//             >
//               Reminders
//             </button>
//           </li>
//         </ul>
//       </div>

//       {/* Content Area */}
//       <div className="text-black flex-1 bg-white bg-opacity-20 p-6 ml-6 shadow-md ">
//         <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
//         <div className="border border-gray-300 p-4">
//           <h3 className="text-lg font-semibold mb-4">
//             {activeTab === "assignments" && "Assignment Notifications"}
//             {activeTab === "updates" && "Updates Notifications"}
//             {activeTab === "reminders" && "Reminders Notifications"}
//           </h3>
//           <ul className="list-disc pl-6 space-y-2">
//             <li>• Assignment/Update/Reminder</li>
//             <li>• Assignment/Update/Reminder</li>
//             <li>• Assignment/Update/Reminder</li>
//             <li>• Assignment/Update/Reminder</li>
//             <li>• Assignment/Update/Reminder</li>
//             <li>• Assignment/Update/Reminder</li>
//             <li>• Assignment/Update/Reminder</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationPage;
