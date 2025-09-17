'use client'
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/hotel-manager/Navbar';
import Sidebar from '@/components/hotel-manager/Sidebar';
import Footer from '@/components/hotel-manager/Footer';
import Image from 'next/image';
import axios from 'axios';

const HotelManagerDashboard = () => {
  const { user, hotels } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    monthlyRevenue: 0,
    averageBookingValue: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings for all hotels managed by this user
      const bookingsResponse = await axios.get('/api/booking/list');
      if (bookingsResponse.data.success) {
        setBookings(bookingsResponse.data.bookings);
      }

      // Calculate stats
      const totalHotels = hotels.length;
      const totalBookings = bookingsResponse.data.bookings.length;
      const totalRevenue = bookingsResponse.data.bookings.reduce((sum, booking) => sum + booking.amount, 0);
      const pendingBookings = bookingsResponse.data.bookings.filter(b => b.status === 'Pending').length;
      const confirmedBookings = bookingsResponse.data.bookings.filter(b => b.status === 'Confirmed').length;
      const cancelledBookings = bookingsResponse.data.bookings.filter(b => b.status === 'Cancelled').length;
      const monthlyRevenue = bookingsResponse.data.bookings
        .filter(b => new Date(b.date).getMonth() === new Date().getMonth())
        .reduce((sum, booking) => sum + booking.amount, 0);
      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      setStats({
        totalHotels,
        totalBookings,
        totalRevenue,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        monthlyRevenue,
        averageBookingValue
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to access the hotel manager dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Hotel Manager Dashboard</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Hotels</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalHotels}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Confirmed Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.confirmedBookings}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Cancelled Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.cancelledBookings}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Booking Value</p>
                      <p className="text-2xl font-bold text-gray-900">${stats.averageBookingValue.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No bookings found</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {booking.hotelDetails?.name || 'Hotel Name'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${booking.amount}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'hotels' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Hotels</h1>
                <a
                  href="/hotel-manager/add-hotel"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Add New Hotel
                </a>
              </div>

              {hotels.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏨</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Hotels Added</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first hotel to the platform.</p>
                  <a
                    href="/hotel-manager/add-hotel"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Add Your First Hotel
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel) => (
                    <div key={hotel._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'}
                          alt={hotel.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                        <p className="text-gray-600 mb-4">{hotel.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-yellow-600">${hotel.pricePerNight}</span>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            {hotel.category}
                          </span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <a
                            href={`/hotel-manager/edit-hotel/${hotel._id}`}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium text-center transition-colors"
                          >
                            Edit
                          </a>
                          <button className="flex-1 bg-red-200 hover:bg-red-300 text-red-800 py-2 px-4 rounded-lg font-medium transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">All Bookings</h1>
              
              {bookings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-600">Bookings will appear here once customers start booking your hotels.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr key={booking._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.hotelDetails?.name || 'Hotel Name'}
                              </div>
                              <div className="text-sm text-gray-500">{booking.roomType}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{booking.guestInfo?.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${booking.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-yellow-600 hover:text-yellow-900 mr-3">View</button>
                              <button className="text-gray-600 hover:text-gray-900">Update</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HotelManagerDashboard;