import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDemoCart, setDemoCart } from '@/lib/demoDataStore'

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const cartItems = getDemoCart(userId)

        return NextResponse.json({
            success: true,
            cartItems
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { cartData } = await request.json()

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'Please sign in to update cart'
            })
        }

        const saved = setDemoCart(userId, cartData)

        return NextResponse.json({
            success: true,
            cartItems: saved
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
