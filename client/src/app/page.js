import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import landingPage_bg from '../public/landingPage.png';
import logo from '../public/vvLogo.png';
import { HiArrowRight } from 'react-icons/hi';

export default function LandingPage() {

  /* const HoverButton = () => {
    const [isHovered, setIsHovered] = useState(false);
  
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    }; */
    
  return (
    <section id="landingPage" className="flex w-screen h-screen">
      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${landingPage_bg.src})` }}>

        <div id="topNavbar" className="sticky top-0 bg-transparent flex flex-row">
          <div className="mr-[1100px]"> <Image src={logo} alt="logo" width={100} height={100}/>  </div>
          <div className="flex flex-row space-x-5 justify-end my-10 mx-12"> 
            <Link href="register">
              <div className="font-geistMono font-bold text-md text-[#423D38] bg-white rounded-full px-5 py-1 cursor-pointer hover:-translate-y-2 duration-300"> SIGN-UP </div>
            </Link>
            <Link href="login">
              <div className="font-geistMono font-bold text-md text-[#423D38] bg-white rounded-full px-5 py-1 cursor-pointer hover:-translate-y-2 duration-300"> LOGIN </div>
            </Link>
          </div>
        </div>

        <div className="flex flex-row space-x-22">
          <div id="leftSide" className="flex flex-col space-y-32 mx-16">
            <div className="flex flex-col space-y-4 font-black text-7xl text-white font-geistMono italic pt-3  "> 
              <span> YOUR </span>
              <span> VOLUNTEER </span>
              <span> VAULT </span> 
            </div>

            <div className="flex flex-col space-y-8"> 
              <div className="font-geistMono font-semibold text-md text-[#423D38]"> JOIN HANDS FOR GLOBAL ENVIRONMENTAL CHANGE </div>
              <div className="flex flex-col space-y-4"> 
                <div className="font-geistMono font-normal text-md text-[#423D38]"> By joining us, you'll gain access to volunteer opportunities <br/> that match your skills and interests. </div>
                <div className="font-geistMono font-normal text-md text-[#423D38]"> Help us address critical environmental issues and support efforts <br/> to restore marine ecosystems and protect ocean health.
                </div>
                <div className="font-geistMono font-normal text-md text-[#423D38]"> Get involved, make a tangible difference, and be part of a <br/> community working towards meaningful environmental change. </div>
              </div>
            </div>
          </div>

          <div id="rightSide" className="flex flex-col mx-16 my-10">
            <div className="font-geistMono font-black text-6xl text-white italic mt-48 mb-16"> TAKE ON </div>
            <div className="font-geistMono font-normal text-5xl text-[#423D38] italic leading-10 mb-6"> THE WAVE OF </div>
            <div className="font-geistMono font-normal text-5xl text-[#423D38] italic leading-10"> CHANGE </div>
            <HiArrowRight className="w-12 h-12 my-6 text-[#423D38] cursor-pointer hover:translate-x-5 duration-300" />
          </div>
        </div>

      </div>
    </section>
  );
}