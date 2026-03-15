import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getAllDemoOrders } from '@/lib/demoDataStore'

export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'not authorized'
            })
        }

        const orders = getAllDemoOrders()
        return NextResponse.json({
            success: true,
            orders
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}

