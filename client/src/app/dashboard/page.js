"use client"

import Image from "next/image";
import hutbg from '../../public/hut.png';
import logo from '../../public/logo_1.png';

import Link from 'next/link'
import { useEffect, useState } from "react";

import {useRouter} from 'next/navigation';

import axios from 'axios';

// sidebar color: D9D9D9
// right side bg: style = {{backgroundImage: `url(${hutbg.src})`}}

export default function dashBoard()  {
  const router = useRouter();

  const [name, setName] = useState('');
  const [adminRole, setAdminRole] = useState(false)

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:8080/dashboard')
      .then(res => {
        if (res.data.user) { // Check for the user object instead
          setName(res.data.user.username); // Set the username from the user object
          if(res.data.user.accountType === "administrator") {
            setAdminRole(true)
          }
        } else {
          setAdminRole(false)
          router.push('/login')
        }
      })
      .catch(err => {
        setAdminRole(false)
        console.log('Error during authentication check:', err);
        router.push('/login')
      });
  }, []);
  

  const handleLogout = () => {
    axios.get('http://localhost:8080/logout')
    .then(res => {
      // location.reload(true);
      router.push('/');
    }).catch(err => console.log(err))
  }

  return (
    <> 
    { adminRole?
      <div className="flex h-screen">
        {/* left 1/6 page */}
        <div className="w-1/6 p-4 bg-cover bg-center relative flex items-center justify-center text-center" style={{ backgroundColor: '#D9D9D9' }}>
          <div className="flex flex-col items-center">

            <div className="h-24 w-24 bg-center bg-no-repeat mb-10 -mt-40 absolute" style={{ backgroundImage: `url(${logo.src})` }} />
              <Link href="/userProfileManagement">
                <button className="h-12 w-40 py-2 px-4 bg-white text-[#423D38] rounded-full flex items-center justify-center mb-10 text-xs font-geistMono hover:bg-[#ACB7BC]">
                  Profile
                </button>
              </Link>  
                
              <Link href="/eventManagementForm">
                <button className="h-12 w-40 py-2 px-4 bg-white text-[#423D38] rounded-full flex items-center justify-center mb-10 text-xs font-geistMono hover:bg-[#ACB7BC]">
                    Manage Events
                </button>
              </Link>

              <Link href="/volunteer_match">
                <button className="h-12 w-40 py-2 px-4 bg-white text-[#423D38] rounded-full flex items-center justify-center mb-10 text-xs font-geistMono hover:bg-[#ACB7BC]">
                    Volunteer Matches
                </button>
              </Link>

              <Link href="/volunteer-history">
                <button className="h-12 w-40 py-2 px-4 bg-white text-[#423D38] rounded-full flex items-center justify-center mb-10 text-xs font-geistMono hover:bg-[#ACB7BC]">
                    Volunteer History
                </button>
              </Link>

              <Link href="/notification-system">
                <button className="h-12 w-40 py-2 px-4 bg-white text-[#423D38] rounded-full flex items-center justify-center text-xs font-geistMono hover:bg-[#ACB7BC]">
                    Notifications
                </button>
              </Link>
            </div>
          </div>

          {/* right side 5/6 page */}
          <div className="w-5/6 p-4 flex items-center justify-center text-center" style = {{backgroundImage: `url(${hutbg.src})`}}>
            <div className="flex flex-col items-center">
              <h1 className= "italic text-white text-3xl font-geistMono mb-10 w-1/3 relative flex self-end mr-auto -mt-20" > Create<br /> Lasting <br /> Ripples </h1>
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                <h2 className="text-black text-xl mb-4 font-geistMono mt-10 italic" style={{ color: '#423D38' }}>Our Mission</h2>
                <p className="text-gray-700 font-geistMono mb-20 mt-10" style={{ color: '#423D38' }}>Volunteering is at the heart of building strong, compassionate communities, where everyone has the opportunity to make a difference. Our mission is to create meaningful opportunities that allow individuals to contribute their time and skills, fostering a culture of giving back. By volunteering, we not only support those in need but also inspire others to take action and create lasting, positive change. Together, we can amplify our impact and shape a better future for everyone.</p>
              </div>
            </div>

            <div className="absolute pt-3 pr-3 top-4 right-4">
              <div onClick={handleLogout} className="font-geistMono font-bold text-md text-[#423D38] bg-white rounded-full px-5 py-1 cursor-pointer hover:-translate-y-2 duration-300">
                LOGOUT
              </div>
            </div>
          </div>
        </div>

    :

<div className="flex h-screen">
        {/* left 1/6 page */}
        <div className="w-1/6 p-4 bg-cover bg-center relative flex items-center justify-center text-center" style={{ backgroundColor: '#D9D9D9' }}>
          <div className="flex flex-col items-center">

            <div className="h-24 w-24 bg-center bg-no-repeat mb-10 -mt-40 absolute" style={{ backgroundImage: `url(${logo.src})` }} />
              <Link href="/userProfileManagement">
                <button className="h-12 w-40 py-2 px-4 bg-white text-[#423D38] rounded-full flex items-center justify-center mb-10 text-xs font-geistMono hover:bg-[#ACB7BC]">
                  Profile
                </button>
              </Link>  
                

              <Link href="/notification-system">
                <button className="h-12 w-40 py-2 px-4 bg-white text-[#423D38] rounded-full flex items-center justify-center text-xs font-geistMono hover:bg-[#ACB7BC]">
                    Notifications
                </button>
              </Link>
            </div>
          </div>

          {/* right side 5/6 page */}
          <div className="w-5/6 p-4 flex items-center justify-center text-center" style = {{backgroundImage: `url(${hutbg.src})`}}>
            <div className="flex flex-col items-center">
              <h1 className= "italic text-white text-3xl font-geistMono mb-10 w-1/3 relative flex self-end mr-auto -mt-20" > Create<br /> Lasting <br /> Ripples </h1>
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                <h2 className="text-black text-xl mb-4 font-geistMono mt-10 italic" style={{ color: '#423D38' }}>Our Mission</h2>
                <p className="text-gray-700 font-geistMono mb-20 mt-10" style={{ color: '#423D38' }}>Volunteering is at the heart of building strong, compassionate communities, where everyone has the opportunity to make a difference. Our mission is to create meaningful opportunities that allow individuals to contribute their time and skills, fostering a culture of giving back. By volunteering, we not only support those in need but also inspire others to take action and create lasting, positive change. Together, we can amplify our impact and shape a better future for everyone.</p>
              </div>
            </div>

            <div className="absolute pt-3 pr-3 top-4 right-4">
              <div onClick={handleLogout} className="font-geistMono font-bold text-md text-[#423D38] bg-white rounded-full px-5 py-1 cursor-pointer hover:-translate-y-2 duration-300">
                LOGOUT
              </div>
            </div>
          </div>
        </div>

      }

        
    </>

    );
    }