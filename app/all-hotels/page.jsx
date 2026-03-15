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

      if (filters.category && !category.includes(filters.category.toLowerCase())) return false;

      if (filters.location &&
          !location.includes(filters.location.toLowerCase()) &&
          !city.includes(filters.location.toLowerCase()) &&
          !country.includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.rating && rating < parseFloat(filters.rating)) return false;

      if (filters.priceRange && filters.priceRange.length === 2) {
        const [minPrice, maxPrice] = filters.priceRange;
        const nightlyPrice = hotel.offerPrice || hotel.pricePerNight;
        if (nightlyPrice < minPrice || nightlyPrice > maxPrice) return false;
      }

      if (filters.amenities?.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => amenities.includes(amenity));
        if (!hasAllAmenities) return false;
      }

      if (filters.roomTypes?.length > 0) {
        const hasMatchingRoomType = roomTypes.some(room => filters.roomTypes.includes(room.type));
        if (!hasMatchingRoomType) return false;
      }

      return true;
    });
  }, [filters, hotels]);

  const sortedHotels = useMemo(() => {
    const list = [...filteredHotels];

    if (sortBy === 'price-low') return list.sort((a, b) => (a.offerPrice || a.pricePerNight) - (b.offerPrice || b.pricePerNight));
    if (sortBy === 'price-high') return list.sort((a, b) => (b.offerPrice || b.pricePerNight) - (a.offerPrice || a.pricePerNight));
    if (sortBy === 'rating') return list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    if (sortBy === 'reviews') return list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));

    return list;
  }, [filteredHotels, sortBy]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <section className="relative py-12 lg:py-16">
          <div className="absolute inset-0 pointer-events-none">
            <span className="float-orb h-28 w-28 top-6 left-10 md:left-24 opacity-20"></span>
            <span className="float-orb h-36 w-36 bottom-6 right-10 md:right-24 opacity-20"></span>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="ui-panel rounded-3xl p-6 md:p-8 lg:p-10">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm font-semibold text-amber-600">Curated Stays</p>
                  <h1 className="section-title">Find your perfect hotel</h1>
                  <p className="section-subtitle">Browse premium properties with modern comfort, thoughtful design, and high-end amenities.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4 items-end">
                  <p className="text-sm text-slate-600">{sortedHotels.length} hotel stays matching your selection</p>
                  <div className="flex gap-3 items-center flex-wrap xl:justify-end">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden btn-ghost px-4 py-3"
                    >
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    <label className="inline-flex items-center gap-2 text-sm px-4 py-3 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-slate-500">Sort</span>
                      <select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                        className="bg-transparent outline-none text-slate-900 font-semibold"
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
                      className="btn-primary px-5 py-3"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 lg:hidden">
                <SidebarFilter
                  filters={filters}
                  setFilters={setFilters}
                  onApplyFilters={handleApplyFilters}
                />
              </div>
            )}
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="hidden lg:block">
                <SidebarFilter
                  filters={filters}
                  setFilters={setFilters}
                  onApplyFilters={handleApplyFilters}
                />
              </div>

              <div className="flex-1">
                {sortedHotels.length === 0 ? (
                  <div className="ui-card rounded-3xl p-10 text-center">
                    <div className="text-6xl mb-4">🏨</div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No hotels found</h3>
                    <p className="text-slate-600 mb-6">Try adjusting your filters or search by city/country.</p>
                    <button
                      onClick={clearFilters}
                      className="btn-primary px-6 py-3"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedHotels.map((hotel, index) => (
                      <HotelCard key={index} hotel={hotel} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AllHotels;
