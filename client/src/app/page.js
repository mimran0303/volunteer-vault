import React from 'react';
import landingPage_bg from '../public/landingPage.png';

export default function LandingPage() {
  return (
    <section id="landingPage" className="flex w-screen h-screen">
      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${landingPage_bg.src})` }}>
        
        <div className="flex flex-row space-x-32">
          
          <div id="leftSide" className="flex flex-col space-y-28 mx-16 my-10">
            <div className="flex flex-col space-y-5 font-bold text-7xl text-white italic pt-20 "> 
              <span> YOUR </span>
              <span> VOLUNTEER </span>
              <span> VAULT </span> 
            </div>

            <div className="flex flex-col space-y-8"> 
              <div className="font-geistMono font-semibold text-xl text-[#423D38]"> JOIN HANDS FOR GLOBAL ENVIRONMENTAL CHANGE </div>
              <div className="flex flex-col space-y-4"> 
                <div className="font-geistMono font-normal text-lg text-[#423D38]"> By joining us, you'll gain access to volunteer opportunities that match your <br/> skills and interests. Help us address critical environmental issues and support <br/> efforts to restore marine ecosystems and protect ocean health. </div>
                <div className="font-geistMono font-normal text-lg text-[#423D38]"> Your contributions will directly impact global conservation initiatives and <br/> promote sustainable practices. Get involved, make a tangible difference, and <br/> be part of a community working towards meaningful environmental change. </div>
              </div>
            </div>
          </div>

          <div id="leftSide" className="flex flex-col mx-16 my-10">
            <div className="font-bold text-6xl text-white italic mt-72 mb-20"> TAKE ON </div>
            <div className="font-normal text-5xl text-[#423D38] italic leading-10 mb-6"> THE WAVE OF </div>
            <div className="font-normal text-5xl text-[#423D38] italic leading-10"> CHANGE </div>
          </div>
          

        </div>

      </div>
    </section>
  );
}
