import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { addDemoAddress } from '@/lib/demoDataStore'

export async function POST(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'Please sign in to add an address'
            })
        }

        const { address } = await request.json()
        const newAddress = addDemoAddress(userId, address)

        return NextResponse.json({
            success: true,
            message: 'Address added successfully',
            newAddress
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
