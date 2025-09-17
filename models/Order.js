import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'user' },
    hotel: { type: String, required: true, ref: 'hotel' },
    roomType: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    rooms: { type: Number, required: true },
    totalNights: { type: Number, required: true },
    amount: { type: Number, required: true },
    guestInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    specialRequests: { type: String, default: "" },
    status: { type: String, required: true, default: 'Confirmed' }, // Confirmed, Checked-in, Checked-out, Cancelled
    date: { type: Number, required: true },
})

const Booking = mongoose.models.booking || mongoose.model('booking', bookingSchema)

export default Booking