'use client'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import axios from 'axios'

const Bookings = () => {

    const { user, getToken } = useAppContext()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        if (user) {
            fetchBookings()
        }
    }, [user])

    const fetchBookings = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/booking/list', {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (data.success) {
                setBookings(data.bookings)
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/booking/update', {
                bookingId,
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (data.success) {
                setBookings(bookings.map(booking => 
                    booking._id === bookingId 
                        ? { ...booking, status: newStatus }
                        : booking
                ))
            }
        } catch (error) {
            console.error('Error updating booking:', error)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 text-green-800'
            case 'Checked-in':
                return 'bg-blue-100 text-blue-800'
            case 'Checked-out':
                return 'bg-gray-100 text-gray-800'
            case 'Cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const filteredBookings = filter === 'all' 
        ? bookings 
        : bookings.filter(booking => booking.status === filter)

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
                    <p className="text-gray-600">You need to be signed in to view bookings.</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading bookings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                    <option value="all">All Bookings</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Checked-in">Checked-in</option>
                    <option value="Checked-out">Checked-out</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            
            {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Bookings Found</h3>
                    <p className="text-gray-600">
                        {filter === 'all' 
                            ? "No bookings have been made yet." 
                            : `No bookings with status "${filter}" found.`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                        <div key={booking._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={booking.hotel?.images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'}
                                                alt={booking.hotel?.name}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{booking.hotel?.name}</h3>
                                            <p className="text-gray-600 text-sm">{booking.hotel?.location}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span>Room: {booking.roomType}</span>
                                                <span>•</span>
                                                <span>Guests: {booking.guests}</span>
                                                <span>•</span>
                                                <span>Rooms: {booking.rooms}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <span className="text-gray-600">
                                                    Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                                                </span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-gray-600">
                                                    Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600">
                                                <p><strong>Guest:</strong> {booking.guestInfo.firstName} {booking.guestInfo.lastName}</p>
                                                <p><strong>Email:</strong> {booking.guestInfo.email}</p>
                                                <p><strong>Phone:</strong> {booking.guestInfo.phone}</p>
                                            </div>
                                            {booking.specialRequests && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <p><strong>Special Requests:</strong> {booking.specialRequests}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-2xl font-bold text-gray-900">${booking.amount}</p>
                                        <p className="text-sm text-gray-500">Total for {booking.totalNights} nights</p>
                                    </div>
                                    <div className="mt-4 space-x-2">
                                        {booking.status === 'Confirmed' && (
                                            <button 
                                                onClick={() => updateBookingStatus(booking._id, 'Checked-in')}
                                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                            >
                                                Check In
                                            </button>
                                        )}
                                        {booking.status === 'Checked-in' && (
                                            <button 
                                                onClick={() => updateBookingStatus(booking._id, 'Checked-out')}
                                                className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                            >
                                                Check Out
                                            </button>
                                        )}
                                        {booking.status === 'Confirmed' && (
                                            <button 
                                                onClick={() => updateBookingStatus(booking._id, 'Cancelled')}
                                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Bookings
