'use client'
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHotels from "@/components/HomeProducts";
import DatePicker from "@/components/DatePicker";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  const { router } = useAppContext();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });
  const [locations, setLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const { hotels } = useAppContext();

  useEffect(() => {
    // Extract unique locations from hotels
    const uniqueLocations = [...new Set(hotels.map(hotel => `${hotel.city}, ${hotel.country}`))];
    setLocations(uniqueLocations);
  }, [hotels]);

  const [searchError, setSearchError] = useState('');

  const handleSearch = () => {
    // Clear previous errors
    setSearchError('');
    
    // Validate required fields
    if (!searchData.location.trim()) {
      setSearchError('Please enter a destination');
      return;
    }
    
    if (!searchData.checkIn) {
      setSearchError('Please select check-in date');
      return;
    }
    
    if (!searchData.checkOut) {
      setSearchError('Please select check-out date');
      return;
    }
    
    // Validate date logic
    if (new Date(searchData.checkOut) <= new Date(searchData.checkIn)) {
      setSearchError('Check-out date must be after check-in date');
      return;
    }
    
    const params = new URLSearchParams({
      location: searchData.location,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests,
      rooms: searchData.rooms
    });
    router.push(`/all-hotels?${params.toString()}`);
  };

  return (
    <>
      <Navbar/>
      
      {/* Hero Section with Professional Filter */}
      <section className="relative h-[85vh] min-h-[700px]">
        {/* Background Image with Gradient */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop"
            alt="Luxury Hotel"
            fill
            className="object-cover animate-pulse-slow"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60"></div>
          {/* Animated overlay elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping animation-delay-1000"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping animation-delay-3000"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                  Find Your Perfect
                  <span className="block bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    Hotel Stay
                  </span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light">
                  Discover luxury hotels and resorts worldwide. Book with confidence and experience exceptional hospitality.
                </p>
              </div>
              
              {/* Compact Search Filter */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Destination */}
                  <div className="lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Where are you going?</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter destination, city, or hotel"
                        value={searchData.location}
                        onChange={(e) => {
                          setSearchData({...searchData, location: e.target.value});
                          setShowLocationDropdown(true);
                        }}
                        onFocus={() => setShowLocationDropdown(true)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-gray-700 placeholder-gray-400 text-sm"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      
                      {/* Location Dropdown */}
                      {showLocationDropdown && locations.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                          {locations
                            .filter(location => 
                              location.toLowerCase().includes(searchData.location.toLowerCase())
                            )
                            .map((location, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setSearchData({...searchData, location});
                                  setShowLocationDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm"
                              >
                                <div className="flex items-center gap-2">
                                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="text-gray-700">{location}</span>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Check-in */}
                  <div className="lg:col-span-2">
                    <DatePicker
                      id="checkin"
                      label="Check-in"
                      value={searchData.checkIn}
                      onChange={(date) => setSearchData({...searchData, checkIn: date})}
                      minDate={new Date().toISOString().split('T')[0]}
                      unavailableDates={[]}
                      placeholder="check-in date"
                    />
                  </div>
                  
                  {/* Check-out */}
                  <div className="lg:col-span-2">
                    <DatePicker
                      id="checkout"
                      label="Check-out"
                      value={searchData.checkOut}
                      onChange={(date) => setSearchData({...searchData, checkOut: date})}
                      minDate={searchData.checkIn || new Date().toISOString().split('T')[0]}
                      unavailableDates={[]}
                      placeholder="check-out date"
                    />
                  </div>
                  
                  {/* Guests & Rooms */}
                  <div className="lg:col-span-4 flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => setSearchData({...searchData, guests: Math.max(1, searchData.guests - 1)})}
                          className="px-3 py-3 text-gray-600 hover:text-yellow-600 transition-colors hover:bg-gray-50 rounded-l-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="flex-1 text-center font-medium text-gray-900 py-3 animate-counter-bounce">
                          {searchData.guests}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSearchData({...searchData, guests: Math.min(8, searchData.guests + 1)})}
                          className="px-3 py-3 text-gray-600 hover:text-yellow-600 transition-colors hover:bg-gray-50 rounded-r-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => setSearchData({...searchData, rooms: Math.max(1, searchData.rooms - 1)})}
                          className="px-3 py-3 text-gray-600 hover:text-yellow-600 transition-colors hover:bg-gray-50 rounded-l-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="flex-1 text-center font-medium text-gray-900 py-3 animate-counter-bounce">
                          {searchData.rooms}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSearchData({...searchData, rooms: Math.min(5, searchData.rooms + 1)})}
                          className="px-3 py-3 text-gray-600 hover:text-yellow-600 transition-colors hover:bg-gray-50 rounded-r-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  {searchError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                      {searchError}
                    </div>
                  )}
                  <button 
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-8 rounded-lg text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Search Hotels
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Featured Hotels
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Discover our handpicked selection of the world's most luxurious hotels and resorts
            </p>
          </div>
          <HomeHotels />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Hotel Categories
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Find the perfect accommodation for your travel style
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Luxury Hotels',
                description: 'Ultimate luxury and world-class service',
                image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
                count: '50+ Hotels'
              },
              {
                title: 'Business Hotels',
                description: 'Perfect for business travelers',
                image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop',
                count: '30+ Hotels'
              },
              {
                title: 'Resort Hotels',
                description: 'Relax and unwind in paradise',
                image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
                count: '25+ Hotels'
              },
              {
                title: 'Budget Hotels',
                description: 'Comfortable stays at great prices',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
                count: '40+ Hotels'
              }
            ].map((category, index) => (
              <Link key={index} href={`/all-hotels?category=${category.title.toLowerCase().replace(' ', '-')}`}>
                <div className="group cursor-pointer">
                  <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-2">{category.description}</p>
                  <p className="text-yellow-600 font-semibold">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-yellow-50">
        <div className="container mx-auto px-6 md:px-16 lg:px-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Go Luxus?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make luxury travel accessible and unforgettable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏆',
                title: 'Curated Selection',
                description: 'Handpicked luxury hotels and resorts worldwide'
              },
              {
                icon: '💎',
                title: 'Best Prices',
                description: 'Exclusive deals and competitive rates guaranteed'
              },
              {
                icon: '🛡️',
                title: '24/7 Support',
                description: 'Round-the-clock assistance for your peace of mind'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="container mx-auto px-6 md:px-16 lg:px-32 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust Go Luxus for their luxury hotel bookings
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/all-hotels')}
              className="bg-white text-yellow-600 font-semibold py-4 px-8 rounded-xl text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Browse All Hotels
            </button>
            <button
              onClick={() => router.push('/my-bookings')}
              className="border-2 border-white text-white font-semibold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-yellow-600 transition-all duration-300"
            >
              My Bookings
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
