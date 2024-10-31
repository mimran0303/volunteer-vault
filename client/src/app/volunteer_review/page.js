"use client";

import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import volunteer_history_bg from '../../public/rectangle48.png';
import { useAuth } from '@/hooks/auth'; 

const volunteer_review = () => {
  const { isAuthenticated, user, isLoading } = useAuth('administrator');  

  useEffect(() => {  
    // Fetch user profile data using the GET request
    axios.get('http://localhost:8080/volunteerReview/overview', { withCredentials: true })
      .then((response) => {
        const profile = response.data;
        
        
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
  
        // Generate the error message
        let errorMessage = "An error occurred while fetching the profile.";
        if (error.response && error.response.data) {
          errorMessage += ` Reason: ${error.response.data}`;
        } else if (error.message) {
          errorMessage += ` Reason: ${error.message}`;
        }
  
        // Display the error message
        alert(errorMessage);
      });
  
  }, []); 

  if (isLoading) {
    return <p></p>;
  }

  if (!isAuthenticated || !user) {
    return null; 
  }

  return (
    <div className="bg-white bg-opacity-80 relative min-h-screen flex justify-center items-center bg-cover bg-center text-black"
      style={{ backgroundImage: `url(${volunteer_history_bg.src})`, }}>

      
    </div>
  );
}

export default volunteer_review;