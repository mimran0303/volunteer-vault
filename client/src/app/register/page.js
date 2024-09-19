"use client";

import React, { useState } from 'react'

import Image from "next/image";

export function register() {
  const [accountType, setAccountType] = useState('');

  return (
    <>
      {/* Flex container for left and right sections */}
      <div className="flex">
        {/* Left side: logo, background image, text */}
        <div className="flex-[1] flex flex-col min-h-screen">
          {/* logo div */}
          <div className="pl-8 pt-8">
            logo
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
            <form className="flex flex-col items-center space-y-4">
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
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)} 
                  className="p-2 border-b-2 border-black placeholder-black focus:outline-none rounded w-[100%] transition-transform duration-300 transform focus:scale-105 text-black"
                  style={{ backgroundColor: '#FAF5F1' }}
                >
                  <option value="" disabled>
                    Account Type
                  </option>
                  <option value="Volunteer">Volunteer</option> {/* Add value attribute */}
                  <option value="Administrator">Administrator</option> {/* Add value attribute */}
                </select>

                <input
                  type="email"
                  placeholder="Email Address (Username)"
                  required
                  className="p-2 border-b-2 border-black placeholder-black text-black focus:outline-none rounded w-[100%] transition-transform duration-300 transform focus:scale-105"
                  style={{ backgroundColor: '#FAF5F1' }}
                />

                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="p-2 border-b-2 border-black placeholder-black text-black focus:outline-none rounded w-[100%] transition-transform duration-300 transform focus:scale-105" 
                  style={{ backgroundColor: '#FAF5F1' }}
                />
              </div>

              <div className="self-start pb-8 text-lg font-light" style={{ color: '#423D38' }}>
                <p className='text-left'>Already have an account?</p>
                <p className='text-left'>Login here.</p>
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