import { getAllDemoBookings, updateDemoBookingStatus } from '@/lib/demoDataStore'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { bookingId, status, ...updateData } = await request.json()

        if (!bookingId) {
            return NextResponse.json({
                success: false,
                message: 'Missing booking ID'
            })
        }

        const booking = updateDemoBookingStatus(bookingId, {
            status: status || updateData.status,
            ...updateData
        })

        if (!booking) {
            return NextResponse.json({
                success: false,
                message: 'Booking not found'
            })
        }

        return NextResponse.json({
            success: true,
            booking
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
