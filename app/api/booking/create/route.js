import { addDemoBooking, getDemoBookings } from '@/lib/demoDataStore'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { userId } = getAuth(request)

        const {
            hotelId,
            roomType,
            checkInDate,
            checkOutDate,
            guests,
            rooms,
            guestInfo,
            specialRequests,
            amount,
            baseAmount,
            tax
        } = await request.json()

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'Please sign in to create a booking'
            })
        }

        if (!hotelId || !roomType || !checkInDate || !checkOutDate || !guests || !rooms) {
            return NextResponse.json({
                success: false,
                message: 'Missing required booking information'
            })
        }

        if (!guestInfo?.firstName || !guestInfo?.lastName || !guestInfo?.email || !guestInfo?.phone) {
            return NextResponse.json({
                success: false,
                message: 'Please provide complete guest information'
            })
        }

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

        const booking = addDemoBooking(userId, {
            hotelId,
            roomType,
            checkInDate,
            checkOutDate,
            guests,
            rooms,
            guestInfo: {
                firstName: guestInfo.firstName.trim(),
                lastName: guestInfo.lastName.trim(),
                email: guestInfo.email.trim().toLowerCase(),
                phone: guestInfo.phone.trim()
            },
            specialRequests,
            amount,
            baseAmount,
            tax
        })

        return NextResponse.json({
            success: true,
            booking,
            bookingId: booking._id,
            message: 'Booking confirmed successfully!'
        })
    } catch (error) {
        console.error('Booking creation error:', error)
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to create booking'
        })
    }
}

export async function GET() {
    const bookings = getDemoBookings('demo-visitor')
    return NextResponse.json({ success: true, bookings })
}
