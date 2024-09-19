"use client";

import React from 'react'

import Link from 'next/link';

import volunteer_history_bg from '../../public/sand.png'

const VolunteerHistory = () => {
  return (
    <div
      className="relative min-h-screen flex justify-center items-center bg-cover bg-center text-black"
      style={{
        backgroundImage: `url(${volunteer_history_bg.src})`,
      }}
    >
      <div className="bg-white bg-opacity-90 p-12 rounded-lg shadow-md w-full md:w-[80%] lg:w-[100%] min-h-[750px]">
      {/* <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-11/12 md:w-3/4 lg:w-2/3 overlfow-x-auto"> */}
        <h1 className="text-3xl font-bold mb-6 text-center">VOLUNTEER HISTORY</h1>
        <table className="table-fixed w-full  min-w-full border-collapse border border-gray-400 text-left">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Volunteer Name</th>
              <th className="border border-gray-400 px-4 py-6 w-[125px] ">Participation Status</th>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Event Name</th>
              <th className="border border-gray-400 px-4 py-6 w-[125px]">Event Description</th>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Location</th>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Required Skills</th>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Urgency</th>
              <th className="border border-gray-400 px-4 py-6 w-[100px]">Event Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
              <td className="border border-gray-400 px-4 py-6"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerHistory;