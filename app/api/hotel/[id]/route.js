import connectDB from '@/config/db'
import Hotel from '@/models/Product'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {

        await connectDB()

        const { id } = await params
        let hotel = null

        // First try to find by ID (MongoDB ObjectId)
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            hotel = await Hotel.findById(id)
        }

        // If not found by ID, try to find by slug/name
        if (!hotel) {
            const hotelName = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            hotel = await Hotel.findOne({ 
                name: { $regex: hotelName, $options: 'i' } 
            })
        }
        
        if (!hotel) {
            return NextResponse.json({ success: false, message: 'Hotel not found' })
        }

        return NextResponse.json({ success: true, hotel })

    } catch (error) {
        console.error('Error fetching hotel:', error)
        return NextResponse.json({ success: false, message: error.message })
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB()

        const { id } = await params
        let hotel = null

        // First try to find by ID (MongoDB ObjectId)
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            hotel = await Hotel.findById(id)
        }

        // If not found by ID, try to find by slug/name
        if (!hotel) {
            const hotelName = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            hotel = await Hotel.findOne({ 
                name: { $regex: hotelName, $options: 'i' } 
            })
        }
        
        if (!hotel) {
            return NextResponse.json({ success: false, message: 'Hotel not found' })
        }

        await Hotel.findByIdAndDelete(hotel._id)
        return NextResponse.json({ success: true, message: 'Hotel deleted successfully' })

    } catch (error) {
        console.error('Error deleting hotel:', error)
        return NextResponse.json({ success: false, message: error.message })
    }
}
