"use client";

import React, { useState } from 'react'

import Link from 'next/link';

import Image from "next/image";
import logo from '../../public/logo.svg';
import register_bg from '../../public/beachThree.png';

import {useRouter} from 'next/navigation'; // routes users to other pages

import axios from 'axios';

export function register() {
  const router = useRouter();
  const [accountType, setAccountType] = useState('');
  const [values, setValues] = useState({
    accountType: '',
    email: '',
    password: ''
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    // server.js: app.use("/auth", authRoutes);
    axios.post('http://localhost:8080/auth/register', values)
    .then(res => {
      // Success: handle the response data
      if(res.data.Status === "Success") {
        router.push('/login')
      }
      else {
        // TODO: keep alert() or display the error on the page
        alert(res.data.Error)
      }
    })
    .catch(err => {
      // Error: handle the error message
      console.error(err);
    });
  }

  return (
    <>
      {/* Flex container for left and right sections */}
      <div className="flex font-geistMono">
        {/* Left side: logo, background image, text */}
        <div className="flex-[1] flex flex-col min-h-screen" 
            style={{ backgroundImage: `url(${register_bg.src})`,
            backgroundPosition: 'bottom',
            backgroundSize: 'cover', 
            backgroundRepeat: 'no-repeat'
          }} 
        >
          {/* logo div */}
          <div className="absolute top-0 left-0 ">
            <Image
              src={logo}
              width={150}
              height={150}
              alt="logo"
            />
          </div>

          <div className="mb-8 flex-grow flex justify-center items-center">
            <span className="font-medium text-3xl text-white font-medium italic hidden md:block">
              REGISTER TODAY
            </span>
          </div>
        </div>

        {/* Right side: form */}
        <div className="flex-[2.56] flex flex-row min-h-screen justify-center items-center" style={{ backgroundColor: '#FAF5F1' }}>
          {/* Parent div of the form section */}
          <div className="text-center w-[66%]">
            {/* Should be completely centered */}
            <form className="flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
              <span className="font-medium text-5xl font-normal pb-16 italic" style={{ color: '#423D38' }}>
                { "Start Making Waves".split("").map((char, index) => (
                  <span
                    key={index}
                    className="inline-block wave-letter"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>

              <div className="flex flex-col space-y-16 w-[100%]">
                <select
                  required
                  value={accountType}  // This binds the select value to the accountType state
                  name='accountType'
                  onChange={e => {
                    setAccountType(e.target.value);  // Update accountType state
                    setValues({...values, accountType: e.target.value});  // Update accountType in values object
                  }}
                  className="p-2 border-b-2 border-black placeholder-black focus:outline-none rounded w-[100%] transition-transform duration-300 transform focus:scale-105 text-black"
                  style={{ backgroundColor: '#FAF5F1' }}
                >
                  <option value="" disabled>
                    Account Type
                  </option>
                  <option value="volunteer">Volunteer</option>
                  <option value="administrator">Administrator</option>
                </select>

                <input
                  type="email"
                  placeholder="Email Address (Username)"
                  name='email'
                  onChange={e => {setValues({...values, email: e.target.value})}}
                  required
                  className="p-2 border-b-2 border-black placeholder-black text-black focus:outline-none rounded w-[100%] transition-transform duration-300 transform focus:scale-105"
                  style={{ backgroundColor: '#FAF5F1' }}  
                />

                <input
                  type="password"
                  placeholder="Password"
                  name='password'
                  onChange={e => {setValues({...values, password: e.target.value})}}
                  required
                  className="p-2 border-b-2 border-black placeholder-black text-black focus:outline-none rounded w-[100%] transition-transform duration-300 transform focus:scale-105" 
                  style={{ backgroundColor: '#FAF5F1' }}
                />
              </div>

              <div className="self-start pb-8 text-lg font-light" style={{ color: '#423D38' }}>
                <p className='text-left'>Already have an account?</p>
                <Link href="/login" className="text-left block hover:underline">Login here.</Link>
              </div>

              <button
                type="submit"
                className="p-2 text-white rounded-full w-[38%] text-base font-bold transform transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: '#423D38' }}
              >
                LET'S GO
              </button>
            </form>
          </div>
        </div>
      </div>

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

export default register;