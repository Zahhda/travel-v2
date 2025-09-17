import connectDB from '@/config/db'
import Hotel from '@/models/Product'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {

        await connectDB()

        const hotelData = await request.json()

        // Validate required fields
        if (!hotelData.name || !hotelData.location || !hotelData.userId) {
            return NextResponse.json({ success: false, message: 'Missing required fields' })
        }

        const hotel = new Hotel({
            ...hotelData,
            images: hotelData.images && hotelData.images.length > 0 ? hotelData.images : ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop']
        })

        await hotel.save()

        return NextResponse.json({ success: true, hotel })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
