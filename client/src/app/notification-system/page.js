"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "@/hooks/auth"; // Import the useAuth hook

import notification_system_bg from '../../public/rectangle46.png';
import volunteerProfilePic from '../../public/volunteer1pfp.jpg';

const NotificationPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth(); // Destructure the useAuth hook
  const [activeTab, setActiveTab] = useState("assignments");
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

const fetchNotifications = async () => {
    if (!isAuthenticated || !user || !user.id) { // Check if user.id is defined
        setError("User not authenticated or missing ID.");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        setError("No token found. Please log in.");
        return;
    }

    try {
        const response = await axios.get(`http://localhost:8080/api/notifications/${user.id}`, {  // Use `user.id` here safely
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
    if (!isLoading) {
      fetchNotifications();
    }
  }, [isLoading]);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "assignments") {
      return notification.message.includes("assigned"); // Filter for assignment notifications
    }
    // Expand filters if needed for "updates" or "reminders" tabs
    return false;
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
          <h2 className="text-xl text-black font-semibold">
            {isAuthenticated && user ? user.username : "Loading..."}
          </h2>
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
                      <small>{new Date(notification.date).toLocaleDateString()}</small>
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
//
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Image from "next/image";
// import { useAuth } from "@/hooks/auth"; // Import the useAuth hook
//
// import notification_system_bg from '../../public/rectangle46.png';
// import volunteerProfilePic from '../../public/volunteer1pfp.jpg';
//
// const NotificationPage = () => {
//   const { isAuthenticated, user, isLoading } = useAuth(); // Destructure the useAuth hook
//   const [activeTab, setActiveTab] = useState("assignments");
//   const [notifications, setNotifications] = useState([]);
//   const [error, setError] = useState("");
//
//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };
//
//   // Fetch notifications from the backend
//   const fetchNotifications = async () => {
//     if (!isAuthenticated || !user) {
//       setError("User not authenticated.");
//       return;
//     }
//
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("No token found. Please log in.");
//       return;
//     }
//
//     try {
//       const response = await axios.get("http://localhost:8080/api/notifications", {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//
//       console.log("API response:", response.data);
//
//       if (response.data.success) {
//         setNotifications(response.data.notifications);
//       } else {
//         setError(response.data.message || "Failed to fetch notifications.");
//       }
//     } catch (err) {
//       setError("An error occurred while fetching notifications.");
//       console.error("Error fetching notifications:", err);
//     }
//   };
//
//   useEffect(() => {
//     if (!isLoading) {
//       fetchNotifications();
//     }
//   }, [isLoading]);
//
//   // Filter notifications based on active tab
//   const filteredNotifications = notifications.filter((notification) => {
//     return activeTab === "assignments";
//   });
//
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
//           <h2 className="text-xl text-black font-semibold">
//             {isAuthenticated && user ? user.username : "Loading..."}
//           </h2>
//         </div>
//         {/* Horizontal bar (divider) */}
//         <div className="border-b border-gray-400 mb-4"></div>
//
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
//
//       {/* Content Area */}
//       <div className="text-black flex-1 bg-white bg-opacity-20 p-6 ml-6 shadow-md">
//         <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
//         <div className="border border-gray-300 p-4">
//           <h3 className="text-lg font-semibold mb-4">
//             {activeTab === "assignments" && "Assignment Notifications"}
//             {activeTab === "updates" && "Updates Notifications"}
//             {activeTab === "reminders" && "Reminders Notifications"}
//           </h3>
//           {filteredNotifications.length > 0 ? (
//             <ul className="list-disc pl-6 space-y-2">
//               {filteredNotifications.map((notification, index) => (
//                 <li key={index}>
//                   {activeTab === "assignments" ? (
//                     <div>
//                       <p className="font-bold">{notification.message}</p>
//                     </div>
//                   ) : (
//                     <p>{notification.message}</p>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No notifications available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default NotificationPage;
//
