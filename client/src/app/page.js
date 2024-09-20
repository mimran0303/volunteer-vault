import React from 'react';
import landingPage_bg from '../public/landingPage.png';
import { FaArrowRight } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

export default function LandingPage() {
  return (
    <section id="landingPage" className="flex w-screen h-screen">
      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${landingPage_bg.src})` }}>

        <div class="sticky top-0 bg-transparent flex flex-row space-x-10 justify-end my-6 mx-12">
          <div className="font-geistMono font-extrabold text-lg text-[#423D38] cursor-pointer hover:-translate-y-2 duration-300"> SIGN-UP </div>
          <div className="font-geistMono font-extrabold text-lg text-[#423D38] cursor-pointer hover:-translate-y-2 duration-300"> LOGIN </div>
        </div>

        <div className="flex flex-row space-x-22">
          <div id="leftSide" className="flex flex-col space-y-28 mx-16 my-10">
            <div className="flex flex-col space-y-5 font-extrabold text-7xl text-white font-geistMono italic pt-22 "> 
              <span> YOUR </span>
              <span> VOLUNTEER </span>
              <span> VAULT </span> 
            </div>

            <div className="flex flex-col space-y-8"> 
              <div className="font-geistMono font-semibold text-xl text-[#423D38]"> JOIN HANDS FOR GLOBAL ENVIRONMENTAL CHANGE </div>
              <div className="flex flex-col space-y-4"> 
                <div className="font-geistMono font-normal text-lg text-[#423D38]"> By joining us, you'll gain access to volunteer opportunities <br/> that match your skills and interests. Help us address <br/> critical environmental issues and support efforts to restore <br/> marine ecosystems and protect ocean health. </div>
                <div className="font-geistMono font-normal text-lg text-[#423D38]"> Get involved, make a tangible difference, and be part of a <br/> community working towards meaningful environmental change. </div>
              </div>
            </div>
          </div>

          <div id="rightSide" className="flex flex-col mx-16 my-10">
            <div className="font-geistMono font-extrabold text-6xl text-white italic mt-56 mb-20"> TAKE ON </div>
            <div className="font-geistMono font-normal text-5xl text-[#423D38] italic leading-10 mb-6"> THE WAVE OF </div>
            <div className="font-geistMono font-normal text-5xl text-[#423D38] italic leading-10"> CHANGE </div>
            <HiArrowRight className="w-10 h-10 my-5 text-[#423D38] cursor-pointer hover:translate-x-5 duration-300" />
          </div>
        </div>

      </div>
    </section>
  );
}
