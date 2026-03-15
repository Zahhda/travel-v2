import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const hotelData = await request.json()

        // Validate required fields
        if (!hotelData.name || !hotelData.location || !hotelData.userId) {
            return NextResponse.json({ success: false, message: 'Missing required fields' })
        }

        return NextResponse.json({
            success: false,
            message: 'Demo mode: hotel creation is not persisted in this environment. Data is loaded from database.ts.'
        })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
