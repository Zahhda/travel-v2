import connectDB from '@/config/db'
import Booking from '@/models/Order'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {

        await connectDB()

        const { bookingId, status, ...updateData } = await request.json()

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { 
                status: status || updateData.status,
                ...updateData
            },
            { new: true }
        )

        if (!booking) {
            return NextResponse.json({ success: false, message: 'Booking not found' })
        }

        return NextResponse.json({ success: true, booking })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
