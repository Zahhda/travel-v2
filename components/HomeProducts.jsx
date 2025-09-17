import React from "react";
import HotelCard from "./HotelCard";
import { useAppContext } from "@/context/AppContext";

const HomeHotels = () => {

  const { hotels, router } = useAppContext()

  return (
    <div className="flex flex-col items-center">
      {hotels.length === 0 ? (
        <div className="w-full text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading hotels...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
            {hotels.slice(0, 8).map((hotel, index) => <HotelCard key={index} hotel={hotel} />)}
          </div>
          <div className="mt-12 text-center">
            <button 
              onClick={() => { router.push('/all-hotels') }} 
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Hotels
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeHotels;
