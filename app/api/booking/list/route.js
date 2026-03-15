import { getAllDemoBookings, getDemoBookings } from '@/lib/demoDataStore'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const { searchParams } = new URL(request.url)
        const queryUserId = searchParams.get('userId')

        const effectiveUser = queryUserId || userId
        const bookings = effectiveUser
            ? getDemoBookings(effectiveUser)
            : getAllDemoBookings()

        return NextResponse.json({
            success: true,
            bookings
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
