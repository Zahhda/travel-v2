import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "user" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    images: { type: Array, required: true },
    amenities: { type: Array, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    roomTypes: [{
        type: { type: String, required: true },
        price: { type: Number, required: true },
        maxGuests: { type: Number, required: true },
        available: { type: Number, required: true }
    }],
    checkInTime: { type: String, default: "15:00" },
    checkOutTime: { type: String, default: "11:00" },
    category: { type: String, required: true }, // luxury, business, budget, resort, etc.
    date: { type: Number, required: true }
})

const Hotel = mongoose.models.hotel || mongoose.model('hotel', hotelSchema)

export default Hotel