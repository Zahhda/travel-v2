'use client'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import axios from 'axios'

const HotelList = () => {

    const { user, getToken } = useAppContext()
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchHotels()
        }
    }, [user])

    const fetchHotels = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/hotel/list', {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (data.success) {
                setHotels(data.hotels)
            }
        } catch (error) {
            console.error('Error fetching hotels:', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteHotel = async (hotelId) => {
        if (!confirm('Are you sure you want to delete this hotel?')) return

        try {
            const token = await getToken()
            const { data } = await axios.delete(`/api/hotel/${hotelId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (data.success) {
                setHotels(hotels.filter(hotel => hotel._id !== hotelId))
            }
        } catch (error) {
            console.error('Error deleting hotel:', error)
        }
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
                    <p className="text-gray-600">You need to be signed in to manage hotels.</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading hotels...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Hotel List</h1>
            
            {hotels.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏨</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Hotels Yet</h3>
                    <p className="text-gray-600">Start by adding your first hotel!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                        <div key={hotel._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                            <div className="h-48 bg-gray-200">
                                <Image
                                    src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'}
                                    alt={hotel.name}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                        {hotel.category}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-medium">{hotel.rating}</span>
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <span key={index} className="text-yellow-400 text-sm">
                                                    {index < Math.floor(hotel.rating) ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">${hotel.offerPrice}</p>
                                        <p className="text-sm text-gray-500 line-through">${hotel.pricePerNight}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteHotel(hotel._id)}
                                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
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

export default HotelList
