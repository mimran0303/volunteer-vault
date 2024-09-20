"use client";

import React, { useState } from 'react'

import Link from 'next/link';
import Image from "next/image";
import notification_system_bg from '../../public/rectangle46.png'
import volunteerProfilePic from '../../public/volunteer1pfp.jpg'

const NotificationPage = () => {
  // State to track the selected tab
  const [activeTab, setActiveTab] = useState("assignments");

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
          <h2 className="text-xl text-black font-semibold">Tristan Fry</h2> {/* Name of volunteer */}
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
      <div className="text-black flex-1 bg-white bg-opacity-20 p-6 ml-6 shadow-md ">
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        <div className="border border-gray-300 p-4">
          <h3 className="text-lg font-semibold mb-4">
            {activeTab === "assignments" && "Assignment Notifications"}
            {activeTab === "updates" && "Updates Notifications"}
            {activeTab === "reminders" && "Reminders Notifications"}
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>• Assignment/Update/Reminder</li>
            <li>• Assignment/Update/Reminder</li>
            <li>• Assignment/Update/Reminder</li>
            <li>• Assignment/Update/Reminder</li>
            <li>• Assignment/Update/Reminder</li>
            <li>• Assignment/Update/Reminder</li>
            <li>• Assignment/Update/Reminder</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
