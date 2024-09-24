"use client"

import React from 'react';
import Image from 'next/image';
import beachOne from '../../public/beachOne.png';

import { useAuth } from '@/hooks/auth';


export default function EventManagementForm() {
  const { isAuthenticated, user, isLoading } = useAuth('administrator'); // Only admins can access

  if (isLoading) {
    return <p></p>;
  }

  if (!isAuthenticated || !user) {
    return null; // Redirect handled in the hook
  }
  
  return (

    <section id="eventManagement" className="w-screen h-screen bg-[#FAF5F1]">

      <div className="flex flex-row space-x-10"> 
        <div className="flex flex-col space-y-12 p-20">
          <div className="font-geistMono font-normal text-5xl italic text-[#423D38] leading-snug"> EVENT MANAGEMENT FORM </div>
          <div className="flex flex-col space-y-6"> 
            <input 
            required 
            maxLength="100"
            type="text" 
            placeholder="Event Name" 
            className="p-1 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
            />

           <textarea
            required
            multiple
            placeholder="Location"
            rows="1"
            className="block w-full px-1 py-1 bg-transparent border-b border-[#423D38] focus:ring-[#423D38] focus:border-[#423D38] placeholder-[#423D38]">
            </textarea>

            <textarea
            required
            placeholder="Event Description"
            rows="4"
            className="block w-full px-2 py-2 bg-transparent border border-[#423D38] rounded-md focus:ring-[#423D38] focus:border-[#423D38] placeholder-[#423D38]">
            </textarea>

            <select
              required
              multiple
              rows="5"
              placeholder="Skills"
              className="px-1 py-2 border border-[#423D38] rounded-md bg-transparent placeholder-[#423D38]"
              > 
              <option className="text-[#423D38]" value=""> Select Skills </option>
              <option value=""> Research Skills </option>
              <option value=""> Communication Skills </option>
              <option value=""> Teamwork </option>
              <option value=""> Physical Fitness </option>
              <option value=""> Botanical Knowledge </option>
              <option value=""> Knowledge of Marine Biology </option>
              <option value=""> Project Management </option>
              <option value=""> Advocacy and Policy Work </option>
              <option value=""> Fundraising Skills </option>
              <option value=""> Diving Skills </option>                        
            </select>

            <select
              required
              className="px-1 py-2 border border-[#423D38] rounded-md bg-transparent placeholder-[#423D38]"
              > 
              <option className="text-[#423D38]" value=""> Select Urgency </option>
              <option value=""> Urgent </option>
              <option value=""> Take your time </option>
            </select>

            <input
              required
              type="date"
              id="date"
              className="block w-full px-2 py-2 bg-transparent border border-[#423D38] rounded-md focus:ring-[#423D38] focus:border-[#423D38]"
            />
          </div>
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