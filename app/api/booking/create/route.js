import connectDB from '@/config/db'
import Booking from '@/models/Order'
import Hotel from '@/models/Product'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        await connectDB()

        const { 
            userId, 
            hotelId, 
            roomType, 
            checkInDate, 
            checkOutDate, 
            guests, 
            rooms, 
            guestInfo, 
            specialRequests 
        } = await request.json()

        // Validate required fields
        if (!userId || !hotelId || !roomType || !checkInDate || !checkOutDate || !guests || !rooms) {
            return NextResponse.json({ 
                success: false, 
                message: 'Missing required booking information' 
            })
        }

        // Validate guest information
        if (!guestInfo?.firstName || !guestInfo?.lastName || !guestInfo?.email || !guestInfo?.phone) {
            return NextResponse.json({ 
                success: false, 
                message: 'Please provide complete guest information' 
            })
        }

        // Validate dates
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (checkIn < today) {
            return NextResponse.json({ 
                success: false, 
                message: 'Check-in date cannot be in the past' 
            })
        }

        if (checkOut <= checkIn) {
            return NextResponse.json({ 
                success: false, 
                message: 'Check-out date must be after check-in date' 
            })
        }

        // Get hotel details
        const hotel = await Hotel.findById(hotelId)
        if (!hotel) {
            return NextResponse.json({ 
                success: false, 
                message: 'Hotel not found' 
            })
        }

        // Find selected room type
        const selectedRoom = hotel.roomTypes.find(room => room.type === roomType)
        if (!selectedRoom) {
            return NextResponse.json({ 
                success: false, 
                message: 'Room type not found' 
            })
        }

        // Check availability
        if (selectedRoom.available < rooms) {
            return NextResponse.json({ 
                success: false, 
                message: `Only ${selectedRoom.available} rooms available for this room type` 
            })
        }

        // Calculate total amount with validation
        const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
        if (totalNights <= 0) {
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid date range' 
            })
        }

        const baseAmount = selectedRoom.price * totalNights * rooms
        const tax = Math.round(baseAmount * 0.1) // 10% tax
        const totalAmount = baseAmount + tax

        // Create booking with enhanced data
        const booking = new Booking({
            userId,
            hotel: hotelId,
            roomType,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guests,
            rooms,
            totalNights,
            amount: totalAmount,
            baseAmount,
            tax,
            guestInfo: {
                firstName: guestInfo.firstName.trim(),
                lastName: guestInfo.lastName.trim(),
                email: guestInfo.email.trim().toLowerCase(),
                phone: guestInfo.phone.trim()
            },
            specialRequests: specialRequests?.trim() || '',
            status: 'Confirmed',
            paymentStatus: 'Completed',
            bookingReference: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            date: new Date()
        })

        await booking.save()

        // Update room availability
        selectedRoom.available -= rooms
        await hotel.save()

        // Return enhanced booking response
        return NextResponse.json({ 
            success: true, 
            booking: {
                _id: booking._id,
                bookingReference: booking.bookingReference,
                hotel: {
                    _id: hotel._id,
                    name: hotel.name,
                    location: hotel.location
                },
                roomType,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
                guests,
                rooms,
                totalNights,
                amount: totalAmount,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                guestInfo: booking.guestInfo,
                specialRequests: booking.specialRequests,
                date: booking.date
            },
            bookingId: booking._id,
            message: 'Booking confirmed successfully!'
        })

    } catch (error) {
        console.error('Booking creation error:', error)
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to create booking. Please try again.' 
        })
    }
}
