'use client'
import { useParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DatePicker from "@/components/DatePicker";
import PaymentPopup from "@/components/PaymentPopup";
import axios from "axios";

const HotelDetail = () => {
    const params = useParams();
    const { user, createBooking } = useAppContext();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [bookingStep, setBookingStep] = useState('form'); // 'form', 'processing', 'confirmed'
    const [bookingId, setBookingId] = useState(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [currentBookingData, setCurrentBookingData] = useState(null);
    const [bookingData, setBookingData] = useState({
        checkInDate: '',
        checkOutDate: '',
        guests: 2,
        rooms: 1,
        guestInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        },
        specialRequests: ''
    });

    useEffect(() => {
        if (params.slug) {
            fetchHotel();
        }
    }, [params.slug]);

    const fetchHotel = async () => {
        try {
            // Use the unified API endpoint that handles both ID and slug
            const { data } = await axios.get(`/api/hotel/${params.slug}`);
            if (data.success) {
                setHotel(data.hotel);
            }
        } catch (error) {
            console.error('Error fetching hotel:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = () => {
        if (!user) {
            alert('Please sign in to make a booking');
            return;
        }

        if (!selectedRoomType || !bookingData.checkInDate || !bookingData.checkOutDate) {
            alert('Please fill in all required fields');
            return;
        }

        const selectedRoom = hotel.roomTypes.find(room => room.type === selectedRoomType);
        const totalNights = Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24));
        const totalAmount = selectedRoom.price * totalNights * bookingData.rooms;

        const bookingInfo = {
            ...bookingData,
            totalNights,
            amount: totalAmount,
            roomType: selectedRoomType,
            hotelName: hotel.name
        };

        setCurrentBookingData(bookingInfo);
        setShowPaymentPopup(true);
    };

    const handlePaymentSuccess = async () => {
        try {
            const result = await createBooking(hotel._id, currentBookingData);
            setBookingId(result?.bookingId || 'BOOK-' + Date.now());
            setBookingStep('confirmed');
            
            // Don't close the popup here - let the popup handle the redirect
            // The popup will close itself after redirecting
            
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
            // Close popup on error
            setShowPaymentPopup(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading hotel details...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!hotel) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h2>
                        <p className="text-gray-600 mb-6">The hotel you're looking for doesn't exist.</p>
                        <a
                            href="/all-hotels"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                            Browse All Hotels
                        </a>
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
                    {/* Hotel Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{hotel.name}</h1>
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-1">
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-semibold">{hotel.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{hotel.location}</span>
                            <span>•</span>
                            <span className="capitalize">{hotel.category}</span>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Main Image */}
                        <div className="lg:col-span-2">
                            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                    src={hotel.images?.[selectedImageIndex] || hotel.images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'}
                                    alt={hotel.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="space-y-4">
                            {(hotel.images || []).slice(0, 4).map((image, index) => (
                                <div
                                    key={index}
                                    className={`relative h-24 lg:h-32 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${
                                        selectedImageIndex === index ? 'ring-4 ring-yellow-500' : 'hover:scale-105'
                                    }`}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <Image
                                        src={image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'}
                                        alt={`${hotel.name} ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {selectedImageIndex === index && (
                                        <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Hotel Information */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Hotel</h2>
                                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
                            </div>

                            {/* Amenities */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {hotel.amenities?.map((amenity, index) => {
                                        const getAmenityIcon = (amenityName) => {
                                            const iconClass = "w-6 h-6 text-gray-700";
                                            switch(amenityName.toLowerCase()) {
                                                case 'free wifi':
                                                case 'wifi':
                                                case 'internet':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>;
                                                case 'pool':
                                                case 'swimming pool':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
                                                case 'spa':
                                                case 'wellness':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;
                                                case 'gym':
                                                case 'fitness':
                                                case 'fitness center':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43 2.14-2.14 1.43 1.43L4.14 12 7.71 8.43 16.29 17 12.71 20.57 14.14 22l1.43-1.43L17 22l2.14-2.14 1.43 1.43L22 16.29l-1.43-1.43z"/></svg>;
                                                case 'restaurant':
                                                case 'dining':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/></svg>;
                                                case 'bar':
                                                case 'lounge':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M5 4h14c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h14V6H5zm2 2h10v2H7V8zm0 4h10v2H7v-2z"/></svg>;
                                                case 'room service':
                                                case 'service':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;
                                                case 'concierge':
                                                case 'reception':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
                                                case 'valet parking':
                                                case 'parking':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
                                                case 'air conditioning':
                                                case 'ac':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
                                                case 'breakfast':
                                                case 'free breakfast':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h18v2H4zm0 5h18v2H4zm0 5h18v2H4z"/></svg>;
                                                case 'business center':
                                                case 'business':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM8 4h8v2H8V4zm12 16H4V8h16v12z"/></svg>;
                                                case 'laundry':
                                                case 'laundry service':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M9.65 7h4.69c.9 0 1.66.6 1.9 1.4l.81 2.4c.1.3.4.5.7.5h.1c.4 0 .7-.3.7-.7V7c0-1.1-.9-2-2-2H9.65c-.9 0-1.66.6-1.9 1.4L7 8.8c-.1.3-.4.5-.7.5H6.2c-.4 0-.7-.3-.7-.7V7c0-1.1.9-2 2-2h2.15z"/></svg>;
                                                case 'pet friendly':
                                                case 'pets allowed':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 12.75a6 6 0 0 1 6-6h.75c.41 0 .75-.34.75-.75S11.66 5.25 11.25 5.25h-.75a7.5 7.5 0 0 0-7.5 7.5v.75c0 .41.34.75.75.75s.75-.34.75-.75v-.75zm15 0a6 6 0 0 1-6 6h-.75c-.41 0-.75.34-.75.75s.34.75.75.75h.75a7.5 7.5 0 0 0 7.5-7.5v-.75c0-.41-.34-.75-.75-.75s-.75.34-.75.75v.75z"/></svg>;
                                                case 'airport shuttle':
                                                case 'shuttle':
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
                                                default:
                                                    return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
                                            }
                                        };
                                        return (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                {getAmenityIcon(amenity)}
                                                <span className="text-gray-700 font-medium">{amenity}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Room Types */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Room Types</h3>
                                <div className="space-y-4">
                                    {hotel.roomTypes?.map((room, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{room.type}</h4>
                                                    <p className="text-sm text-gray-600">Max {room.maxGuests} guests</p>
                                                    <p className="text-sm text-gray-600">{room.available} rooms available</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-yellow-600">${room.price}</p>
                                                    <p className="text-sm text-gray-600">per night</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                                <div className="text-center mb-6">
                                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                                        ${selectedRoomType ? 
                                            hotel.roomTypes?.find(room => room.type === selectedRoomType)?.price || hotel.offerPrice || hotel.pricePerNight
                                            : hotel.offerPrice || hotel.pricePerNight
                                        }
                                    </div>
                                    <div className="text-gray-600">per night</div>
                                    {hotel.offerPrice && !selectedRoomType && (
                                        <div className="text-sm text-gray-500 line-through">
                                            ${hotel.pricePerNight}
                                        </div>
                                    )}
                                </div>

                                <form className="space-y-4">
                                    {/* Room Type Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                                        <select
                                            value={selectedRoomType}
                                            onChange={(e) => setSelectedRoomType(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                        >
                                            <option value="">Select Room Type</option>
                                            {hotel.roomTypes?.map((room, index) => (
                                                <option key={index} value={room.type}>
                                                    {room.type} - ${room.price}/night
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Check-in Date */}
                                    <DatePicker
                                        label="Check-in Date"
                                        value={bookingData.checkInDate}
                                        onChange={(date) => setBookingData({...bookingData, checkInDate: date})}
                                        minDate={new Date().toISOString().split('T')[0]}
                                        unavailableDates={[]}
                                        placeholder="check-in date"
                                    />

                                    {/* Check-out Date */}
                                    <DatePicker
                                        label="Check-out Date"
                                        value={bookingData.checkOutDate}
                                        onChange={(date) => setBookingData({...bookingData, checkOutDate: date})}
                                        minDate={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                                        unavailableDates={[]}
                                        placeholder="check-out date"
                                    />

                                    {/* Guests */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => setBookingData({...bookingData, guests: Math.max(1, bookingData.guests - 1)})}
                                                className="px-3 py-3 text-gray-600 hover:text-yellow-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="flex-1 text-center font-medium">{bookingData.guests}</span>
                                            <button
                                                type="button"
                                                onClick={() => setBookingData({...bookingData, guests: Math.min(8, bookingData.guests + 1)})}
                                                className="px-3 py-3 text-gray-600 hover:text-yellow-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Rooms */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => setBookingData({...bookingData, rooms: Math.max(1, bookingData.rooms - 1)})}
                                                className="px-3 py-3 text-gray-600 hover:text-yellow-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="flex-1 text-center font-medium">{bookingData.rooms}</span>
                                            <button
                                                type="button"
                                                onClick={() => setBookingData({...bookingData, rooms: Math.min(5, bookingData.rooms + 1)})}
                                                className="px-3 py-3 text-gray-600 hover:text-yellow-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Guest Information */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">Guest Information</h4>
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={bookingData.guestInfo.firstName}
                                            onChange={(e) => setBookingData({
                                                ...bookingData,
                                                guestInfo: {...bookingData.guestInfo, firstName: e.target.value}
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={bookingData.guestInfo.lastName}
                                            onChange={(e) => setBookingData({
                                                ...bookingData,
                                                guestInfo: {...bookingData.guestInfo, lastName: e.target.value}
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={bookingData.guestInfo.email}
                                            onChange={(e) => setBookingData({
                                                ...bookingData,
                                                guestInfo: {...bookingData.guestInfo, email: e.target.value}
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            value={bookingData.guestInfo.phone}
                                            onChange={(e) => setBookingData({
                                                ...bookingData,
                                                guestInfo: {...bookingData.guestInfo, phone: e.target.value}
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    {/* Special Requests */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                                        <textarea
                                            placeholder="Any special requests?"
                                            value={bookingData.specialRequests}
                                            onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    {/* Booking Button */}
                                    {bookingStep === 'form' && (
                                        <button 
                                            onClick={handleBooking}
                                            className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-600 transition"
                                        >
                                            {user ? 'Book Now' : 'Sign In to Book'}
                                        </button>
                                    )}

                                    {bookingStep === 'processing' && (
                                        <div className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-medium text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Processing Booking...
                                            </div>
                                        </div>
                                    )}

                                    {bookingStep === 'confirmed' && (
                                        <div className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium text-center">
                                            ✅ Booking Confirmed!
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Confirmation Modal */}
            {bookingStep === 'confirmed' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                            <p className="text-gray-600 mb-6">Your hotel reservation has been successfully created.</p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                <h3 className="font-semibold text-gray-900 mb-2">Booking Details</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-medium">Booking ID:</span> {bookingId}</p>
                                    <p><span className="font-medium">Hotel:</span> {hotel?.name}</p>
                                    <p><span className="font-medium">Check-in:</span> {new Date(bookingData.checkInDate).toLocaleDateString()}</p>
                                    <p><span className="font-medium">Check-out:</span> {new Date(bookingData.checkOutDate).toLocaleDateString()}</p>
                                    <p><span className="font-medium">Guests:</span> {bookingData.guests}</p>
                                    <p><span className="font-medium">Rooms:</span> {bookingData.rooms}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => { setBookingStep('form'); setBookingId(null); }} 
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition"
                                >
                                    Book Another
                                </button>
                                <button 
                                    onClick={() => window.location.href = '/my-bookings'} 
                                    className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 transition"
                                >
                                    View Bookings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Popup */}
            <PaymentPopup
                isOpen={showPaymentPopup}
                onClose={() => setShowPaymentPopup(false)}
                onSuccess={handlePaymentSuccess}
                bookingData={currentBookingData}
            />

            <Footer />
        </>
    );
};

export default HotelDetail;
