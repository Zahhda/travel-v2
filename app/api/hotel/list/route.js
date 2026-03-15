import { getHotels } from '@/database'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const hotels = getHotels()
        return NextResponse.json({ success:true, hotels })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
