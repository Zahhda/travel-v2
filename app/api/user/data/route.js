import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getDemoUser } from '@/lib/demoDataStore'

export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'User not authenticated'
            })
        }

        const user = getDemoUser(userId)

        return NextResponse.json({
            success: true,
            user
        })
    } catch (error) {
        console.error('User data fetch error:', error)
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
