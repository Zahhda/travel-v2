import connectDB from '@/config/db'
import Booking from '@/models/Order'
import Hotel from '@/models/Product'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {

        await connectDB()

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ success: false, message: 'User ID is required' })
        }

        const bookings = await Booking.find({ userId }).sort({ date: -1 })

        // Populate hotel details for each booking
        const populatedBookings = await Promise.all(
            bookings.map(async (booking) => {
                const hotel = await Hotel.findById(booking.hotel)
                return {
                    ...booking.toObject(),
                    hotelDetails: hotel
                }
            })
        )
        
        return NextResponse.json({ success: true, bookings: populatedBookings })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
