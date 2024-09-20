import Image from "next/image";
import waterbg from '../../public/waterbg.png';

export default function volunteerMatchForm()  {

    return (
    <> 
 
 <div className="flex h-screen">
        {/* left and center 2/3 page */}
        <div className="w-2/3 p-4 bg-cover bg-center relative flex items-center justify-center text-center" style = {{backgroundImage: `url(${waterbg.src})`}}>
        <div className="flex flex-col items-center">
          <h1 className="text-center text-3xl mb-20 font-geistMono" style={{ color: '#423D38' }}>Volunteer Matching</h1>
          
          <form className="w-full max-w-md flex flex-col items-center">
              <input
                className="w-full bg-transparent border-b-2 border-[#423D38] py-2 px-3 mb-4 focus:border-gray-500 focus:outline-none font-geistMono" style={{ color: '#423D38' }}
                type="text"
                placeholder="Volunteer Name"
                aria-label="Volunteer Name"
              />

              <input
                className="w-full bg-transparent border-b-2 border-[#423D38] py-2 px-3 mb-4 focus:border-gray-500 focus:outline-none font-geistMono" style={{ color: '#423D38' }}
                type="text"
                placeholder="Profile Preferences"
                aria-label="Profile Preferences"
              />

              <input
                className="w-full bg-transparent border-b-2 border-[#423D38] py-2 px-3 mb-4 focus:border-gray-500 focus:outline-none font-geistMono" style={{ color: '#423D38' }}
                type="text"
                placeholder="Current Matched Event(s)"
                aria-label="Current Matched Event(s)"
              />

              <input
                className="w-full bg-transparent border-b-2 border-[#423D38] py-2 px-3 mb-4 focus:border-gray-500 focus:outline-none font-geistMono" style={{ color: '#423D38' }}
                type="text"
                placeholder="Add a Matched Event"
                aria-label="Add a Matched Event"
              />
            </form>

            <button className="bg-[#423D38] hover:bg-[#B4C4C4] font-bold py-2 px-4 rounded-full mt-10 font-geistMono" style={{ color: '#FFFFFF' }} type="button">
              Match!
            </button>

          </div>
        </div>

        {/* right side 1/3 page */}
        <div className="w-1/3 bg-white p-4 flex items-center justify-center text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-center text-2xl mb-20 font-geistMono" style={{ color: '#423D38' }}>Tailored Volunteer Matches</h1>
          <p className="text-center text-lg mt-10 font-geistMono" style={{ color: '#423D38' }}>View and match volunteers <br /> to specifically chosen <br />events based on the<br /> individual’s profiles and <br />event requirement.</p>
        </div>
      </div>
      </div>

    </>

    );
}