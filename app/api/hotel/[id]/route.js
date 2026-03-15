import { findHotel, getHotels } from '@/database'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {
        const { id } = await params
        const normalizedId = id.toString().toLowerCase().trim()
        const normalized = getHotels().find((item) => item._id === id)
        const hotel = normalized || findHotel(normalizedId) || null

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
        const { id } = await params
        const hotel = findHotel(id)

        if (!hotel) {
            return NextResponse.json({ success: false, message: 'Hotel not found' })
        }

        return NextResponse.json({
            success: false,
            message: `Demo mode: delete is read-only for ${hotel.name}`
        })

    } catch (error) {
        console.error('Error deleting hotel:', error)
        return NextResponse.json({ success: false, message: error.message })
    }
}
