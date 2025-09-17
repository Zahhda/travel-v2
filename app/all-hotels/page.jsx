'use client'
import HotelCard from "@/components/HotelCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SidebarFilter from "@/components/SidebarFilter";
import { useAppContext } from "@/context/AppContext";
import { useState, useEffect } from "react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const AllHotels = () => {
  const { hotels } = useAppContext();
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    rating: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    const checkIn = urlParams.get('checkIn');
    const checkOut = urlParams.get('checkOut');
    const guests = urlParams.get('guests');
    const rooms = urlParams.get('rooms');

    if (location) {
      setFilters(prev => ({ ...prev, location }));
    }
  }, []);

  const filteredHotels = hotels.filter(hotel => {
    // Category filter
    if (filters.category && !hotel.category.toLowerCase().includes(filters.category.toLowerCase())) {
      return false;
    }

    // Location filter
    if (filters.location && 
        !hotel.location.toLowerCase().includes(filters.location.toLowerCase()) && 
        !hotel.city.toLowerCase().includes(filters.location.toLowerCase()) &&
        !hotel.country.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Rating filter
    if (filters.rating && hotel.rating < parseFloat(filters.rating)) {
      return false;
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (hotel.pricePerNight < minPrice || hotel.pricePerNight > maxPrice) {
        return false;
      }
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        hotel.amenities && hotel.amenities.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    // Room types filter
    if (filters.roomTypes && filters.roomTypes.length > 0) {
      const hasMatchingRoomType = hotel.roomTypes && hotel.roomTypes.some(room => 
        filters.roomTypes.includes(room.type)
      );
      if (!hasMatchingRoomType) {
        return false;
      }
    }

    return true;
  });

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">All Hotels</h1>
                <p className="text-lg text-gray-600">
                  {filteredHotels.length} hotels found
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <button
                  onClick={() => handleApplyFilters(filters)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Filter */}
          {showFilters && (
            <div className="lg:hidden mb-6">
              <SidebarFilter 
                filters={filters}
                setFilters={setFilters}
                onApplyFilters={handleApplyFilters}
              />
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter - Desktop */}
            <div className="hidden lg:block">
              <SidebarFilter 
                filters={filters}
                setFilters={setFilters}
                onApplyFilters={handleApplyFilters}
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-md border border-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="font-medium">Filters</span>
              </button>
            </div>

            {/* Mobile Sidebar Filter */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <SidebarFilter 
                  filters={filters}
                  setFilters={setFilters}
                  onApplyFilters={handleApplyFilters}
                />
              </div>
            )}

            {/* Hotel Grid */}
            <div className="flex-1">
              {filteredHotels.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏨</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No hotels found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                  <button
                    onClick={() => setFilters({ category: '', priceRange: '', rating: '', location: '' })}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredHotels.map((hotel, index) => (
                    <HotelCard key={index} hotel={hotel} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllHotels;