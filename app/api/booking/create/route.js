import connectDB from '@/config/db'
import Booking from '@/models/Order'
import Hotel from '@/models/Product'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {

        await connectDB()

        const { userId, hotelId, roomType, checkInDate, checkOutDate, guests, rooms, guestInfo, specialRequests } = await request.json()

        // Get hotel details
        const hotel = await Hotel.findById(hotelId)
        if (!hotel) {
            return NextResponse.json({ success: false, message: 'Hotel not found' })
        }

        // Find selected room type
        const selectedRoom = hotel.roomTypes.find(room => room.type === roomType)
        if (!selectedRoom) {
            return NextResponse.json({ success: false, message: 'Room type not found' })
        }

        // Check availability
        if (selectedRoom.available < rooms) {
            return NextResponse.json({ success: false, message: 'Not enough rooms available' })
        }

        // Calculate total amount
        const totalNights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
        const amount = selectedRoom.price * totalNights * rooms

        // Create booking
        const booking = new Booking({
            userId,
            hotel: hotelId,
            roomType,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
            guests,
            rooms,
            totalNights,
            amount,
            guestInfo,
            specialRequests,
            status: 'Confirmed',
            date: Date.now()
        })

        await booking.save()

        // Update room availability
        selectedRoom.available -= rooms
        await hotel.save()

        return NextResponse.json({ 
            success: true, 
            booking,
            bookingId: booking._id 
        })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
