import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const HotelCard = ({ hotel }) => {
    const { currency, router } = useAppContext()

    const scrollTo = (x, y) => {
        window.scrollTo(x, y);
    };

    // Create slug from hotel name
    const createSlug = (name) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .trim();
    };

    return (
        <div
            onClick={() => { router.push('/hotel/' + createSlug(hotel.name)); scrollTo(0, 0) }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={hotel.images?.[0] || hotel.imgSrc || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'}
                    alt={hotel.name}
                    className="group-hover:scale-110 transition-transform duration-500 object-cover w-full h-full"
                    width={400}
                    height={256}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Favorite Button */}
                <button className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors">
                    <Image
                        className="h-4 w-4"
                        src={assets.heart_icon}
                        alt="heart_icon"
                        width={16}
                        height={16}
                    />
                </button>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {hotel.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Hotel Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                    {hotel.name}
                </h3>
                
                {/* Location */}
                <p className="text-gray-600 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {hotel.location}
                </p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Image
                                key={i}
                                className="h-4 w-4"
                                src={i < Math.floor(hotel.rating) ? assets.star_icon : assets.star_dull_icon}
                                alt="star"
                                width={16}
                                height={16}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{hotel.rating}</span>
                    <span className="text-sm text-gray-500">(Excellent)</span>
                </div>
                
                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-2xl font-bold text-gray-900">{currency}{hotel.offerPrice}</span>
                        <span className="text-sm text-gray-500 ml-2 line-through">{currency}{hotel.pricePerNight}</span>
                    </div>
                    <span className="text-sm text-gray-500">per night</span>
                </div>
                
                {/* Book Button */}
                <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                    Book Now
                </button>
            </div>
        </div>
    )
}

export default HotelCard