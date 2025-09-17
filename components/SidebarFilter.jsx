'use client'
import React, { useState } from 'react';

const SidebarFilter = ({ filters, setFilters, onApplyFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [amenities, setAmenities] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  const amenityOptions = [
    'Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service',
    'Concierge', 'Valet Parking', 'Business Center', 'Pet Friendly', 'Airport Shuttle'
  ];

  const roomTypeOptions = [
    'Standard Room', 'Deluxe Room', 'Suite', 'Presidential Suite', 'Family Room'
  ];

  const handleAmenityToggle = (amenity) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleRoomTypeToggle = (roomType) => {
    setRoomTypes(prev => 
      prev.includes(roomType) 
        ? prev.filter(r => r !== roomType)
        : [...prev, roomType]
    );
  };

  const handleApplyFilters = () => {
    const newFilters = {
      ...filters,
      priceRange: priceRange,
      amenities: amenities,
      roomTypes: roomTypes
    };
    onApplyFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      rating: '',
      location: ''
    });
    setPriceRange([0, 5000]);
    setAmenities([]);
    setRoomTypes([]);
  };

  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Filters</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Star Rating */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Star Rating</h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating.toString()}
                onChange={(e) => setFilters({...filters, rating: e.target.value})}
                className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
              />
              <div className="flex items-center ml-3">
                {[...Array(rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-700">{rating} stars</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Amenities</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {amenityOptions.map(amenity => (
            <label key={amenity} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
              />
              <span className="ml-3 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Room Types */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Room Types</h4>
        <div className="space-y-3">
          {roomTypeOptions.map(roomType => (
            <label key={roomType} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={roomTypes.includes(roomType)}
                onChange={() => handleRoomTypeToggle(roomType)}
                className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
              />
              <span className="ml-3 text-sm text-gray-700">{roomType}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SidebarFilter;
