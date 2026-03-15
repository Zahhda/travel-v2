import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDemoOrders } from '@/lib/demoDataStore'

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const orders = getDemoOrders(userId)

        return NextResponse.json({
            success: true,
            orders: [...orders]
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
