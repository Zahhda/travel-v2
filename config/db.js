import mongoose from "mongoose";

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
    
    if (cached.conn) {
        return cached.conn
    } 

    const mongoDbUri = process.env.MONGODB_URI

    if (!mongoDbUri) {
        console.warn('MONGODB_URI is not set. Demo mode: skipping database connection.')
        return null
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands:false
        }

        cached.promise = mongoose.connect(`${mongoDbUri}/quickcart`,opts).then( mongoose => {
            return mongoose
        })

    } 

    cached.conn = await cached.promise
    return cached.conn

}

export default connectDB
