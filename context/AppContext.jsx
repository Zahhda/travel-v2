'use client'
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const { user } = useUser()
    const { getToken } = useAuth()

    const [hotels, setHotels] = useState([])
    const [userData, setUserData] = useState(false)
    const [isHotelManager, setIsHotelManager] = useState(false)
    const [bookings, setBookings] = useState({})
    const [cartItems, setCartItems] = useState({})

    const fetchHotelData = async () => {
        try {
            const {data} = await axios.get('/api/hotel/list')

            if (data.success) {
                setHotels(data.hotels)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {
            if (!user) {
                return;
            }

            if (user.publicMetadata?.role === 'seller' || user.publicMetadata?.role === 'hotel_manager') {
                setIsHotelManager(true)
            }

            const token = await getToken()

            const { data } = await axios.get('/api/user/data', { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setUserData(data.user)
                setBookings(data.user.bookings)
            } else {
                console.error('User data fetch failed:', data.message)
            }

        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    const createBooking = async (hotelId, bookingData) => {

        if (!user) {
            return toast('Please login',{
                icon: '⚠️',
              })
        }

        try {
            const token = await getToken()
            const { data } = await axios.post('/api/booking/create', {
                userId: user.id,
                hotelId,
                ...bookingData
            }, {headers:{Authorization: `Bearer ${token}`}} )
            
            if (data.success) {
                toast.success('Booking created successfully')
                return data.booking
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const updateBooking = async (bookingId, updateData) => {

        try {
            const token = await getToken()
            const { data } = await axios.post('/api/booking/update', {
                bookingId,
                ...updateData
            }, {headers:{Authorization: `Bearer ${token}`}} )
            
            if (data.success) {
                toast.success('Booking updated successfully')
                return data.booking
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getBookingCount = () => {
        return Object.keys(bookings).length;
    }

    const getBookingAmount = () => {
        let totalAmount = 0;
        for (const bookingId in bookings) {
            let booking = bookings[bookingId];
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

    useEffect(() => {
        fetchHotelData()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
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
        cartItems, addToCart, updateCartQuantity, getCartCount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}