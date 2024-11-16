"use client";

import React, { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import userProfile_bg from '../../public/userProfile.png';
import { useAuth } from '@/hooks/auth'; 

export default function UserProfileManagement() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter(); // To redirect after successful submission
  const [profiles, setProfiles] = useState([]);
  const [isBooting, setIsBooting] = useState(true); // ? same thing as isLoading
  const [editingProfile, setEditingProfile] = useState(null); // Store the event being edited

  const [userId, setUserId] = useState(null)

  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    skills: "",
    preferences: "",
    availability: ""
  });
 
  

  useEffect(() => {
    console.log(formData);
  
    // Fetch user profile data using the GET request
    axios.get('http://localhost:8080/userProfile/profile', { withCredentials: true })
      .then((response) => {
        const profile = response.data;
        
        if (profile) {
          // converting mysql formatting to html friendly format
          const availabilityDate = profile.availability ? profile.availability.split('T')[0] : '';

          // Set the formData with fetched profile data
          setFormData({
            fullName: profile.full_name || '',
            address1: profile.address_1 || '',
            address2: profile.address_2 || '',
            city: profile.city || '',
            state: profile.state || '',
            zipcode: profile.zip_code || '',
            skills: profile.skills || '',
            preferences: profile.preferences || '',
            availability: availabilityDate 
          });
          setUserId(profile.profile_owner_id);
        }
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, 
    }));
  };
  

  // Handle form submission
 const handleSubmit = (event) => {
  event.preventDefault(); // Prevent default form submission behavior

    // Editing existing event
    axios.put(`http://localhost:8080/userProfile/edit/${userId}`, formData, { withCredentials: true })
      .then(res => {
        if (res.status === 200) {
          alert('Profile updated successfully!');
          // setProfiles(prevProfiles => prevProfiles.map(ev => ev.id === editingProfile.id ? res.data : ev)); // Update the profile in state
          setEditingProfile(null); // Reset editing profile after success
          //closeModal(); // Close the modal
          window.location.reload();
        }
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred while editing the profile');
      });


  // else {
  // // Send the form data to the server
  // axios.post('http://localhost:8080/auth/userProfileManagement/create', formData)
  //   .then(res => {
  //     if (res.status === 201) {
  //       alert('Changes have been saved'); // Show alert on success
  //     } else {
  //       alert('Error: ' + res.data.Error);
  //     }
  //   })
  //   .catch(err => {
  //     console.error(err); // Log any errors during the request
  //     alert('An error occurred while saving the profile.');
  //   });
  // }
};


  return (
    <section id="landingPage" className="flex w-screen h-screen">
      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${userProfile_bg.src})` }}>

        <div className="flex flex-col space-y-24 m-20"> 
          <div className="font-geistMono font-normal text-5xl italic text-[#423D38]"> USER PROFILE MANAGEMENT </div>
          
          <form onSubmit={handleSubmit}> {/* Connect form submission to handleSubmit */}
            <div className="flex flex-row space-x-28">
              <div className="flex flex-col space-y-14 w-[40rem]">
                <input 
                  required 
                  maxLength="50"
                  type="text" 
                  name="fullName" // Add name attribute for form data mapping
                  value={formData.fullName} // Bind value to formData state
                  onChange={e => {setFormData({...formData, fullName: e.target.value})}} // Update state on input change
                  require
                  placeholder="Full Name" 
                  className="p-1 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
                />

                <input 
                  required 
                  maxLength="100"
                  type="text" 
                  name="address1" // Add name attribute for form data mapping
                  value={formData.address1} // Bind value to formData state
                  onChange={e => {setFormData({...formData, address1: e.target.value})}} // Update state on input change
                  require
                  placeholder="Address Line 1" 
                  className="p-1 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
                />

                <input 
                  maxLength="100"
                  type="text" 
                  name="address2" // Add name attribute for form data mapping
                  value={formData.address2} // Bind value to formData state
                  onChange={e => {setFormData({...formData, address2: e.target.value})}} // Update state on input change
                  require
                  placeholder="Address Line 2" 
                  className="p-1 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
                />

                <input 
                  required 
                  maxLength="100"
                  type="text" 
                  name="city" // Add name attribute for form data mapping
                  value={formData.city} // Bind value to formData state
                  onChange={e => {setFormData({...formData, city: e.target.value})}} // Update state on input change
                  require
                  placeholder="City" 
                  className="p-1 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
                />

                <select
                  required
                  name="state" // Add name attribute for form data mapping
                  value={formData.state} // Bind value to formData state
                  onChange={e => {setFormData({...formData, state: e.target.value})}} // Update state on input change
                  require
                  className="py-1 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
                > 
                  <option className="text-[#423D38]" value="">Select a state</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>

                <input 
                  required 
                  maxLength="10"
                  minLength="5"
                  type="text" 
                  name="zipcode" // Add name attribute for form data mapping
                  value={formData.zipcode} // Bind value to formData state
                  onChange={e => {setFormData({...formData, zipcode: e.target.value})}} // Update state on input change
                  require
                  placeholder="Zipcode" 
                  className="p-1 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
                />
              </div>

              <div className="flex flex-col space-y-14 w-[40rem]">
                <select
                  required
                  name="skills" // Add name attribute for form data mapping
                  value={formData.skills} // Bind value to formData state
                  onChange={e => {setFormData({...formData, skills: e.target.value})}} // Update state on input change
                  require
                  className="p-1 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
                > 
                  <option className="text-[#423D38]" value=""> Select Skills </option>
                  <option value="Research Skills"> Research Skills </option>
                  <option value="Communication Skills"> Communication Skills </option>
                  <option value="Teamwork"> Teamwork </option>
                  <option value="Physical Fitness"> Physical Fitness </option>
                  <option value="Botanical Knowledge"> Botanical Knowledge </option>
                  <option value="Knowledge of Marine Biology"> Knowledge of Marine Biology </option>
                  <option value="Project Management"> Project Management </option>
                  <option value="Advocacy and Policy Work"> Advocacy and Policy Work </option>
                  <option value="Fundraising Skills"> Fundraising Skills </option>
                  <option value="Diving Skills"> Diving Skills </option>                        
                </select>

                <textarea
                  name="preferences" // Add name attribute for form data mapping
                  value={formData.preferences} // Bind value to formData state
                  onChange={e => {setFormData({...formData, preferences: e.target.value})}} // Update state on input change
                  require
                  placeholder="Add your preferences here: "
                  rows="11"
                  className="block w-full px-4 py-2 bg-transparent border border-[#423D38] rounded-md focus:ring-[#423D38] focus:border-[#423D38] placeholder-[#423D38]"
                ></textarea>

                <input
                  required
                  type="date"
                  name="availability" // Add name attribute for form data mapping
                  value={formData.availability} // Bind value to formData state
                  onChange={e => {setFormData({...formData, availability: e.target.value})}} // Update state on input change
                  require
                  className="block w-full px-4 py-2 bg-transparent border border-[#423D38] rounded-md focus:ring-[#423D38] focus:border-[#423D38]"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4 mt-10"> {/* Container for vertical alignment and spacing */}
  <button
    className="bg-[#423D38] hover:bg-[#B4C4C4] font-bold py-2 px-2 rounded-full font-geistMono w-40 h-12"
    style={{ color: '#FFFFFF' }}
    type="submit"
  >
    SAVE CHANGES
  </button>
  <button
    className="bg-[#423D38] hover:bg-[#B4C4C4] font-bold py-2 px-2 rounded-full font-geistMono w-40 h-12"
    style={{ color: '#FFFFFF' }}
    type="submit"
  >
    EDIT
  </button>
  <button
    className="bg-[#423D38] hover:bg-[#B4C4C4] font-bold py-2 px-2 rounded-full font-geistMono w-40 h-12"
    style={{ color: '#FFFFFF' }}
    type="submit"
  >
    DELETE
  </button>
</div>
          </form>

        </div>
      </div>
    </section>
  );
}
