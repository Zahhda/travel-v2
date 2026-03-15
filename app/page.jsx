'use client'
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHotels from "@/components/HomeProducts";
import DatePicker from "@/components/DatePicker";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";

// Ensure proper rendering
export const dynamic = 'auto';

const accentCards = [
  {
    title: 'Luxury Escapes',
    description: 'Private villas, beachside suites, and signature experiences.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    count: '50+ hotels'
  },
  {
    title: 'City Business Stays',
    description: 'Work-friendly rooms and lounges with high-speed connectivity.',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
    count: '30+ hotels'
  },
  {
    title: 'Resort Retreats',
    description: 'Pools, spas, and quiet luxury moments inspired by nature.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    count: '25+ hotels'
  },
  {
    title: 'Value Escapes',
    description: 'Premium comfort with better prices and all the essentials.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    count: '40+ hotels'
  }
];

const perks = [
  {
    icon: '✈️',
    title: 'Global Destinations',
    description: 'Curated stays from city centers to remote beach escapes.'
  },
  {
    icon: '⚡',
    title: 'Simple Booking',
    description: 'Fast checkout with clear room prices and instant confirmation.'
  },
  {
    icon: '🛎️',
    title: '24/7 Concierge',
    description: 'Support available from search to check-out and every step in-between.'
  }
];

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
  const [searchError, setSearchError] = useState('');

  const { hotels } = useAppContext();

  useEffect(() => {
    const uniqueLocations = [...new Set(hotels.map(hotel => `${hotel.city}, ${hotel.country}`))];
    setLocations(uniqueLocations);
  }, [hotels]);

  const handleSearch = () => {
    setSearchError('');

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

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop"
              alt="Luxury Hotel"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/55 to-slate-900/75"></div>
          </div>

          <div className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
              <div className="max-w-4xl mx-auto text-center mb-10 lg:mb-12">
                <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-amber-200 font-bold">Luxury Travel Redefined</p>
                <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                  Find Your Next
                  <span className="block bg-gradient-to-r from-yellow-300 to-amber-200 bg-clip-text text-transparent"> Signature Stay</span>
                </h1>
                <p className="mt-6 text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
                  Discover exceptional hotels and resorts with modern booking for smart travelers.
                </p>
              </div>

              <div className="mx-auto max-w-6xl ui-panel rounded-3xl p-5 sm:p-7 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-4">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Destination</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="City, resort, or hotel name"
                        value={searchData.location}
                        onChange={(e) => {
                          setSearchData({ ...searchData, location: e.target.value });
                          setShowLocationDropdown(true);
                        }}
                        onFocus={() => setShowLocationDropdown(true)}
                        className="w-full rounded-xl border border-slate-200/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">📍</span>

                      {showLocationDropdown && locations.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                          {locations
                            .filter(location => location.toLowerCase().includes(searchData.location.toLowerCase()))
                            .map((location, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setSearchData({ ...searchData, location });
                                  setShowLocationDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 text-sm"
                              >
                                {location}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Check-in</label>
                    <DatePicker
                      id="checkin"
                      value={searchData.checkIn}
                      onChange={(date) => setSearchData({ ...searchData, checkIn: date })}
                      minDate={new Date().toISOString().split('T')[0]}
                      unavailableDates={[]}
                      placeholder="check-in date"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Check-out</label>
                    <DatePicker
                      id="checkout"
                      value={searchData.checkOut}
                      onChange={(date) => setSearchData({ ...searchData, checkOut: date })}
                      minDate={searchData.checkIn || new Date().toISOString().split('T')[0]}
                      unavailableDates={[]}
                      placeholder="check-out date"
                    />
                  </div>

                  <div className="lg:col-span-4 flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Guests</label>
                      <div className="flex items-center border rounded-xl border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => setSearchData({ ...searchData, guests: Math.max(1, searchData.guests - 1) })}
                          className="px-3 py-3 hover:text-amber-600 transition-colors"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-medium text-slate-900 py-3">{searchData.guests}</span>
                        <button
                          type="button"
                          onClick={() => setSearchData({ ...searchData, guests: Math.min(8, searchData.guests + 1) })}
                          className="px-3 py-3 hover:text-amber-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Rooms</label>
                      <div className="flex items-center border rounded-xl border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => setSearchData({ ...searchData, rooms: Math.max(1, searchData.rooms - 1) })}
                          className="px-3 py-3 hover:text-amber-600 transition-colors"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-medium text-slate-900 py-3">{searchData.rooms}</span>
                        <button
                          type="button"
                          onClick={() => setSearchData({ ...searchData, rooms: Math.min(5, searchData.rooms + 1) })}
                          className="px-3 py-3 hover:text-amber-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-center">
                  {searchError && (
                    <p className="mb-3 text-sm text-red-500">{searchError}</p>
                  )}
                  <button
                    onClick={handleSearch}
                    className="btn-primary px-10 py-3 rounded-xl"
                  >
                    Search Hotels
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 lg:mb-14">
              <p className="text-sm uppercase tracking-[0.2em] text-amber-600 font-semibold">Featured Hotels</p>
              <h2 className="section-title">Handpicked Luxury Picks</h2>
              <p className="section-subtitle">Choose from a curated collection of standout properties across the globe.</p>
            </div>
            <HomeHotels />
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 lg:mb-14">
              <p className="text-sm uppercase tracking-[0.2em] text-amber-600 font-semibold">Explore by style</p>
              <h2 className="section-title">Popular Hotel Collections</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {accentCards.map((category, index) => (
                <Link key={index} href={`/all-hotels?category=${category.title.toLowerCase().replace(' ', '-')}`}>
                  <article className="group ui-card overflow-hidden rounded-3xl">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute left-5 top-5 text-xs font-bold px-3 py-1 rounded-full bg-white/15 backdrop-blur text-white">{category.count}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-slate-900">{category.title}</h3>
                      <p className="text-sm text-slate-600 mt-2">{category.description}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ui-panel rounded-3xl p-8 sm:p-12">
              <div className="text-center mb-10">
                <p className="text-sm uppercase tracking-[0.2em] text-amber-600 font-semibold">Why Go Luxus</p>
                <h2 className="section-title">A luxury-first booking experience</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {perks.map((feature, index) => (
                  <div key={index} className="rounded-2xl border border-slate-100 p-6 text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="ui-panel rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-yellow-100/60 to-amber-50/60">
              <h2 className="section-title">Ready for your next stay?</h2>
              <p className="section-subtitle mx-auto mb-8">Browse thousands of luxury hotels and secure your reservation in seconds.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/all-hotels')}
                  className="btn-primary px-6 py-3"
                >
                  Browse All Hotels
                </button>
                <button
                  onClick={() => router.push('/my-bookings')}
                  className="btn-ghost px-6 py-3"
                >
                  Go to My Bookings
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
