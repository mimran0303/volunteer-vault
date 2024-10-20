"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import logo from '../../public/logo.svg';
import login_bg from '../../public/beachThree.png';
import { useRouter } from 'next/navigation'; // Routes users to different pages
import axios from 'axios';
import Modal from 'react-modal';

export function login() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false); 
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [profileValues, setProfileValues] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    skills: '',
    preferences: '',
    availability: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;

    axios.post('http://localhost:8080/auth/login', values)
      .then(res => {
        if(res.data.Status === "Success") {
          const token = res.data.token;
          console.log("Token received: ", token);
          localStorage.setItem('token', token);
          
          // Check isVerified status
          if (res.data.isVerified === 0) {
            // Show modal if user is not verified
            setShowModal(true);
          } else {
            router.push('/dashboard');
          }
        } else {
          alert(res.data.Error);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileValues(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;

    // Send profile data to server
    axios.post('http://localhost:8080/userProfile/userProfileManagement/create', profileValues)
      .then(res => {
        if (res.status === 201) {
          setShowModal(false);
          router.push('/dashboard'); // Redirect to dashboard after form submission
        } else {
          alert("Error submitting profile data");
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="flex font-geistMono">
        {/* Left side: logo, background image, text */}
        <div className="flex-[1] flex flex-col min-h-screen" 
          style={{ backgroundImage: `url(${login_bg.src})`,
            backgroundPosition: 'bottom',
            backgroundSize: 'cover', 
            backgroundRepeat: 'no-repeat'
          }} 
        >
          <div className="absolute top-0 left-0 ">
            <Image src={logo} width={150} height={150} alt="logo" />
          </div>
          <div className="mb-8 flex-grow flex justify-center items-center">
            <span className="font-medium text-3xl text-white font-medium italic hidden md:block">
              GLAD TO SEE YOU AGAIN
            </span>
          </div>
        </div>

        {/* Right side: form */}
        <div className="flex-[2.56] flex flex-row min-h-screen justify-center items-center" style={{ backgroundColor: '#FAF5F1' }}>
          <div className="text-center w-[66%]">
            <form className="flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
              <span className="font-medium text-5xl font-normal pb-16 italic" style={{ color: '#423D38' }}>
                { "Start Making Waves".split("").map((char, index) => (
                  <span key={index} className="inline-block wave-letter" style={{ animationDelay: `${index * 0.1}s` }}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>

              <div className="flex flex-col space-y-16 w-[100%]">
                <input
                  type="email"
                  placeholder="Email Address (Username)"
                  name='email'
                  onChange={e => { setValues({ ...values, email: e.target.value }) }}
                  required
                  className="p-2 border-b-2 border-black placeholder-black text-black	 focus:outline-none rounded w-[100%] transition-transform duration-300 transform focus:scale-105"
                  style={{ backgroundColor: '#FAF5F1' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name='password'
                  onChange={e => { setValues({ ...values, password: e.target.value }) }}
                  required
                  className="p-2 border-b-2 border-black placeholder-black text-black	 focus:outline-none rounded w-[100%] transition-transform duration-300 transform focus:scale-105" 
                  style={{ backgroundColor: '#FAF5F1' }}
                />
              </div>

              <div className="self-start pb-8 text-lg font-light" style={{ color: '#423D38' }}>
                <p className='text-left'>Do not have an account?</p>
                <Link href="/register" className="text-left block hover:underline">Register here.</Link>
              </div>

              <button type="submit" className="p-2 text-white rounded-full w-[38%] text-base font-bold transform transition-transform duration-300 hover:scale-105" style={{ backgroundColor: '#423D38' }}>
                LET'S GO
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for profile form */}
      <Modal isOpen={showModal} 
      onRequestClose={() => setShowModal(false)} 
      className="bg-white w-full max-w-lg mx-auto my-20 p-6 rounded-lg shadow-lg relative" // Modal content styling
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center" // Overlay background
      ariaHideApp={false}>
        <h2 className="text-2xl font-bold text-center mb-6 text-[#423D38]">Complete Your Profile</h2>
        <form onSubmit={handleProfileSubmit} className="flex flex-col space-y-4">

          <input
            required
            maxLength="50"
            type="text"
            name="fullName"
            value={profileValues.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="block w-full p-2 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
          />

          <input
            required
            maxLength="100"
            type="text"
            name="address1"
            value={profileValues.address1}
            onChange={handleChange}
            placeholder="Address Line 1"
            className="block w-full p-2 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
          />

          <input
            maxLength="100"
            type="text"
            name="address2"
            value={profileValues.address2}
            onChange={handleChange}
            placeholder="Address Line 2"
            className="block w-full p-2 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
          />

          <div className="flex flex-col md:flex-row gap-6">
            <input
              required
              maxLength="100"
              type="text"
              name="city"
              value={profileValues.city}
              onChange={handleChange}
              placeholder="City"
              className="block w-full p-2 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
            />

            <select
              required
              name="state"
              value={profileValues.state}
              onChange={handleChange}
              className="block w-full p-2 border-b border-[#423D38] bg-transparent"
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
              name="zipcode"
              value={profileValues.zipcode}
              onChange={handleChange}
              placeholder="Zipcode"
              className="block w-full p-2 border-b border-[#423D38] bg-transparent placeholder-[#423D38]"
            />
          </div>

          <select
            required
            name="skills"
            value={profileValues.skills}
            onChange={handleChange}
            className="block w-full p-2 border-b border-[#423D38] bg-transparent"
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
            name="preferences"
            value={profileValues.preferences}
            onChange={handleChange}
            placeholder="Add your preferences here"
            rows="5"
            className="block w-full p-2 border border-[#423D38] bg-transparent rounded-md placeholder-[#423D38]"
          ></textarea>

          <input
            required
            type="date"
            name="availability"
            value={profileValues.availability}
            onChange={handleChange}
            className="block w-full p-2 border border-[#423D38] bg-transparent rounded-md"
          />

          <button
            type="submit"
            className="w-full bg-[#423D38] hover:bg-[#B4C4C4] text-white font-bold py-2 px-4 rounded-full mt-6"
          >
            Submit Profile
          </button>
        </form>
      </Modal>

      {/* Wave animation CSS */}
      <style jsx>{`
        .wave-letter {
          display: inline-block;
          animation: wave 1s ease-in-out;
        }

        @keyframes wave {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default login;