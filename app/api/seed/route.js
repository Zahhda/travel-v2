import { getHotels } from '@/database'
import { NextResponse } from 'next/server'

export async function POST() {
    return NextResponse.json({
        success: true,
        message: 'Demo mode: seed endpoint reports current in-memory hotel dataset size.',
        count: getHotels().length
    })
}
