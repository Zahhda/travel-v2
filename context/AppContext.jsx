'use client'
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getHotels, findHotel } from "@/database";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD"
    const router = useRouter()

    const { user } = useUser()
    const { getToken } = useAuth()

    const [hotels, setHotels] = useState([])
    const [userData, setUserData] = useState(false)
    const [isHotelManager, setIsHotelManager] = useState(false)
    const [bookings, setBookings] = useState([])
    const [cartItems, setCartItems] = useState({})
    const loadDemoBookings = (storageKey) => {
        if (typeof window === "undefined") return []
        try {
            const rawBookings = localStorage.getItem(storageKey)
            if (!rawBookings) return []
            const parsed = JSON.parse(rawBookings)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }

    const fetchHotelData = async () => {
        const demoHotels = getHotels()
        setHotels(demoHotels)
    }

    const fetchUserData = async () => {
        if (!user) {
            setIsHotelManager(false)
            setUserData(false)
            return;
        }

        setUserData({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            role: user.publicMetadata?.role || "guest"
        })

        if (user.publicMetadata?.role === 'seller' || user.publicMetadata?.role === 'hotel_manager') {
            setIsHotelManager(true)
        } else {
            setIsHotelManager(false)
        }
    }

    const getBookingStorageKey = (userId = user?.id) => `goluxus-demo-bookings-${userId || "guest"}`

    const saveBookings = (nextBookings) => {
        const key = getBookingStorageKey()
        if (typeof window === "undefined") return
        localStorage.setItem(key, JSON.stringify(nextBookings))
    }

    const createBooking = async (hotelId, bookingData) => {

        if (!user) {
            toast('Please login',{
                icon: '⚠️',
              })
            throw new Error('User not logged in')
        }

        const hotel = findHotel(hotelId) || hotels.find((item) => item.slug === hotelId)
        if (!hotel) {
            const message = "Hotel not found in demo database";
            toast.error(message)
            throw new Error(message)
        }

        const booking = {
            _id: `BK-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
            bookingReference: `BK-${Date.now()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
            userId: user.id,
            hotel: hotel._id,
            hotelDetails: {
                _id: hotel._id,
                name: hotel.name,
                location: hotel.location,
                images: hotel.images
            },
            status: "Confirmed",
            paymentStatus: "Completed",
            roomType: bookingData.roomType,
            checkInDate: bookingData.checkInDate,
            checkOutDate: bookingData.checkOutDate,
            guests: bookingData.guests,
            rooms: bookingData.rooms,
            totalNights: bookingData.totalNights,
            amount: bookingData.amount,
            baseAmount: bookingData.baseAmount,
            tax: bookingData.tax,
            guestInfo: bookingData.guestInfo,
            specialRequests: bookingData.specialRequests || "",
            hotelName: hotel.name,
            date: new Date().toISOString()
        }

        setBookings(prev => {
            const next = [booking, ...(prev || [])]
            saveBookings(next)
            return next
        })

        toast.success('Demo booking created successfully')
        return {
            booking,
            bookingId: booking._id,
            message: "Demo booking created successfully"
        }
    }

    const updateBooking = async (bookingId, updateData) => {

        const nextBookings = (bookings || []).map(booking =>
            booking._id === bookingId ? { ...booking, ...updateData } : booking
        )
        setBookings(nextBookings)
        saveBookings(nextBookings)
        toast.success('Booking updated successfully')
        return nextBookings.find((booking) => booking._id === bookingId)
    }

    const getBookingCount = () => {
        return (bookings || []).length;
    }

    const getBookingAmount = () => {
        let totalAmount = 0;
        for (const booking of bookings || []) {
            if (booking.amount) {
                totalAmount += booking.amount;
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    // Cart functions (for compatibility)
    const addToCart = (itemId) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
    }

    const updateCartQuantity = (itemId, quantity) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: quantity
        }));
    }

    const getCartCount = () => {
        let total = 0;
        for (const itemId in cartItems) {
            total += cartItems[itemId] || 0;
        }
        return total;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const product = hotels.find(hotel => hotel._id === itemId);
            if (product && cartItems[itemId] > 0) {
                totalAmount += product.offerPrice * cartItems[itemId];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchHotelData()
    }, [])

    useEffect(() => {
        const storageKey = getBookingStorageKey()
        if (user) {
            fetchUserData()
            setBookings(loadDemoBookings(storageKey))
        } else {
            setBookings([])
        }
    }, [user])

    const value = {
        user, getToken,
        currency, router,
        isHotelManager, setIsHotelManager,
        userData, fetchUserData,
        hotels, fetchHotelData,
        bookings, setBookings,
        createBooking, updateBooking,
        getBookingCount, getBookingAmount,
        cartItems, setCartItems, addToCart, updateCartQuantity, getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
