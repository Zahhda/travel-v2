import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { createDemoOrder } from '@/lib/demoDataStore'

export async function POST(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'Please sign in to place order'
            })
        }

        const { address, items } = await request.json()

        if (!address || !items || items.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Invalid data'
            })
        }

        createDemoOrder(userId, { address, items })

        return NextResponse.json({
            success: true,
            message: 'Order Placed'
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
