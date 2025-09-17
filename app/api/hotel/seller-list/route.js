import connectDB from '@/config/db'
import Hotel from '@/models/Product'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        await connectDB()
        
        const hotels = await Hotel.find({})
        return NextResponse.json({ success: true, hotels })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
