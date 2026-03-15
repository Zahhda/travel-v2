import React from "react";
import HotelCard from "./HotelCard";
import { useAppContext } from "@/context/AppContext";

const HomeHotels = () => {

  const { hotels, router } = useAppContext()

  return (
    <div className="flex flex-col items-center">
      {hotels.length === 0 ? (
        <div className="w-full text-center py-20">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500"></div>
          <p className="text-gray-500 text-lg">Loading hotels...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
            {hotels.slice(0, 8).map((hotel, index) => <HotelCard key={index} hotel={hotel} />)}
          </div>
          <div className="mt-14 text-center">
            <button 
              onClick={() => { router.push('/all-hotels') }} 
              className="btn-primary px-8 py-4 rounded-2xl text-base"
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
