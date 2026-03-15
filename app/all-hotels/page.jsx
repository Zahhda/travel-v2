'use client'
import HotelCard from "@/components/HotelCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SidebarFilter from "@/components/SidebarFilter";
import { useAppContext } from "@/context/AppContext";
import { useMemo, useState, useEffect } from "react";

// Ensure proper rendering
export const dynamic = 'auto';

const AllHotels = () => {
  const { hotels } = useAppContext();
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    rating: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      rating: '',
      location: ''
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');

    if (location) {
      setFilters(prev => ({ ...prev, location }));
    }
  }, []);

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const category = (hotel.category || '').toLowerCase();
      const location = (hotel.location || '').toLowerCase();
      const city = (hotel.city || '').toLowerCase();
      const country = (hotel.country || '').toLowerCase();
      const amenities = hotel.amenities || [];
      const roomTypes = hotel.roomTypes || [];
      const rating = Number(hotel.rating) || 0;

      if (filters.category && !category.includes(filters.category.toLowerCase())) {
        return false;
      }

      if (filters.location &&
          !location.includes(filters.location.toLowerCase()) &&
          !city.includes(filters.location.toLowerCase()) &&
          !country.includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.rating && rating < parseFloat(filters.rating)) {
        return false;
      }

      if (filters.priceRange && filters.priceRange.length === 2) {
        const [minPrice, maxPrice] = filters.priceRange;
        if (hotel.pricePerNight < minPrice || hotel.pricePerNight > maxPrice) {
          return false;
        }
      }

      if (filters.amenities?.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => amenities.includes(amenity));
        if (!hasAllAmenities) {
          return false;
        }
      }

      if (filters.roomTypes?.length > 0) {
        const hasMatchingRoomType = roomTypes.some(room => filters.roomTypes.includes(room.type));
        if (!hasMatchingRoomType) {
          return false;
        }
      }

      return true;
    });
  }, [filters, hotels]);

  const sortedHotels = useMemo(() => {
    const list = [...filteredHotels];

    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.offerPrice - b.offerPrice);
    }

    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.offerPrice - a.offerPrice);
    }

    if (sortBy === 'rating') {
      return list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }

    if (sortBy === 'reviews') {
      return list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return list;
  }, [filteredHotels, sortBy]);

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
                  {sortedHotels.length} hotels found
                </p>
              </div>

              <div className="flex gap-3 items-center flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <label className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-sm">
                  <span className="text-gray-600 mr-2">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="bg-transparent outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="rating">Top Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="reviews">Most Reviewed</option>
                  </select>
                </label>
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

            {/* Hotel Grid */}
            <div className="flex-1">
              {sortedHotels.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏨</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No hotels found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                  <button
                    onClick={clearFilters}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedHotels.map((hotel, index) => (
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
