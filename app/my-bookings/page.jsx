'use client'
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import axios from 'axios';

const MyBookings = () => {
  const { user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`/api/booking/list?userId=${user.id}`);
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600">You need to be signed in to view your bookings.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Bookings</h1>
            <p className="text-lg text-gray-600">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start exploring our amazing hotels!</p>
              <a
                href="/all-hotels"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Browse Hotels
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Hotel Image */}
                      <div className="lg:w-80">
                        <div className="relative h-48 lg:h-40 rounded-xl overflow-hidden">
                          <Image
                            src={booking.hotelDetails?.images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'}
                            alt={booking.hotelDetails?.name || 'Hotel'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {booking.hotelDetails?.name || 'Hotel Name'}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {booking.hotelDetails?.location || 'Location'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Booking ID: {booking._id}
                            </p>
                          </div>
                          <div className="mt-4 lg:mt-0">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Check-in</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(booking.checkInDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Check-out</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(booking.checkOutDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Guests</p>
                            <p className="font-semibold text-gray-900">{booking.guests}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Rooms</p>
                            <p className="font-semibold text-gray-900">{booking.rooms}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Room Type</p>
                            <p className="font-semibold text-gray-900">{booking.roomType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-semibold text-gray-900">${booking.amount}</p>
                          </div>
                        </div>

                        {booking.guestInfo && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Guest Information</p>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-700">
                                {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                              </p>
                              <p className="text-sm text-gray-700">{booking.guestInfo.email}</p>
                              <p className="text-sm text-gray-700">{booking.guestInfo.phone}</p>
                            </div>
                          </div>
                        )}

                        {booking.specialRequests && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Special Requests</p>
                            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                              {booking.specialRequests}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            View Details
                          </button>
                          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors">
                            Cancel Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyBookings;