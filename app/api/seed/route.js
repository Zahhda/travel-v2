import connectDB from '@/config/db'
import Hotel from '@/models/Product'
import { NextResponse } from 'next/server'

const hotels = [
    {
        userId: 'demo-user-1',
        name: 'The Ritz-Carlton Maldives',
        description: 'Luxury resort with overwater villas and pristine beaches. Experience unparalleled luxury in the heart of the Maldives with world-class service and breathtaking ocean views.',
        location: 'Fari Islands, Maldives',
        city: 'Malé',
        country: 'Maldives',
        pricePerNight: 1200,
        offerPrice: 960,
        images: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
        ],
        amenities: ['Spa', 'Private Beach', 'Overwater Villa', 'Fine Dining', 'Water Sports', 'Kids Club', 'Concierge', 'Room Service'],
        rating: 4.8,
        roomTypes: [
            { type: 'Overwater Villa', price: 1200, maxGuests: 2, available: 5 },
            { type: 'Beach Villa', price: 800, maxGuests: 4, available: 8 },
            { type: 'Garden Villa', price: 600, maxGuests: 2, available: 12 }
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        category: 'luxury',
        date: Date.now()
    },
    {
        userId: 'demo-user-2',
        name: 'Aman Tokyo',
        description: 'Urban luxury with traditional Japanese aesthetics. Discover the perfect blend of modern comfort and traditional Japanese hospitality in the heart of Tokyo.',
        location: 'Otemachi, Tokyo',
        city: 'Tokyo',
        country: 'Japan',
        pricePerNight: 1500,
        offerPrice: 1200,
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
        ],
        amenities: ['Spa', 'Michelin Restaurant', 'City Views', 'Concierge', 'Fitness Center', 'Library', 'Cultural Tours', 'Tea Ceremony'],
        rating: 4.9,
        roomTypes: [
            { type: 'Deluxe Room', price: 1500, maxGuests: 2, available: 3 },
            { type: 'Suite', price: 2500, maxGuests: 4, available: 2 },
            { type: 'Presidential Suite', price: 4000, maxGuests: 6, available: 1 }
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        category: 'luxury',
        date: Date.now()
    },
    {
        userId: 'demo-user-3',
        name: 'Four Seasons Resort Bora Bora',
        description: 'Tropical paradise with crystal clear waters. Immerse yourself in the beauty of French Polynesia with overwater bungalows and pristine beaches.',
        location: 'Bora Bora, French Polynesia',
        city: 'Bora Bora',
        country: 'French Polynesia',
        pricePerNight: 1800,
        offerPrice: 1440,
        images: [
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
        ],
        amenities: ['Overwater Bungalows', 'Snorkeling', 'Spa', 'Beach Access', 'Water Sports', 'Fine Dining', 'Sunset Cruises', 'Cultural Shows'],
        rating: 4.7,
        roomTypes: [
            { type: 'Overwater Bungalow', price: 1800, maxGuests: 3, available: 4 },
            { type: 'Beachfront Villa', price: 2200, maxGuests: 4, available: 3 },
            { type: 'Garden Villa', price: 1200, maxGuests: 2, available: 6 }
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        category: 'resort',
        date: Date.now()
    },
    {
        userId: 'demo-user-4',
        name: 'The Plaza New York',
        description: 'Historic luxury hotel in the heart of Manhattan. Experience the grandeur of New York City with Central Park views and legendary service.',
        location: '5th Avenue, New York',
        city: 'New York',
        country: 'USA',
        pricePerNight: 800,
        offerPrice: 640,
        images: [
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
        ],
        amenities: ['Central Park Views', 'Historic Architecture', 'Fine Dining', 'Shopping', 'Concierge', 'Fitness Center', 'Business Center', 'Valet Parking'],
        rating: 4.6,
        roomTypes: [
            { type: 'Deluxe Room', price: 800, maxGuests: 2, available: 8 },
            { type: 'Suite', price: 1500, maxGuests: 4, available: 4 },
            { type: 'Presidential Suite', price: 3000, maxGuests: 6, available: 1 }
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        category: 'business',
        date: Date.now()
    },
    {
        userId: 'demo-user-5',
        name: 'Burj Al Arab Jumeirah',
        description: 'Iconic sail-shaped hotel with unparalleled luxury. Experience the epitome of luxury in Dubai with breathtaking views and world-class amenities.',
        location: 'Jumeirah Beach, Dubai',
        city: 'Dubai',
        country: 'UAE',
        pricePerNight: 2000,
        offerPrice: 1600,
        images: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
        ],
        amenities: ['Private Beach', 'Helipad', 'Luxury Suites', 'Fine Dining', 'Spa', 'Shopping', 'Sky Bar', 'Personal Butler'],
        rating: 4.8,
        roomTypes: [
            { type: 'Deluxe Suite', price: 2000, maxGuests: 2, available: 3 },
            { type: 'Royal Suite', price: 5000, maxGuests: 4, available: 2 },
            { type: 'Presidential Suite', price: 8000, maxGuests: 6, available: 1 }
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        category: 'luxury',
        date: Date.now()
    },
    {
        userId: 'demo-user-6',
        name: 'Hotel de Crillon Paris',
        description: 'Historic palace hotel with French elegance. Discover the charm of Paris with this magnificent palace hotel offering timeless luxury.',
        location: 'Place de la Concorde, Paris',
        city: 'Paris',
        country: 'France',
        pricePerNight: 1200,
        offerPrice: 960,
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop'
        ],
        amenities: ['Historic Palace', 'Michelin Restaurant', 'Spa', 'City Views', 'Concierge', 'Art Collection', 'Wine Cellar', 'Garden Terrace'],
        rating: 4.7,
        roomTypes: [
            { type: 'Deluxe Room', price: 1200, maxGuests: 2, available: 5 },
            { type: 'Suite', price: 2000, maxGuests: 4, available: 3 },
            { type: 'Presidential Suite', price: 4000, maxGuests: 6, available: 1 }
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        category: 'luxury',
        date: Date.now()
    },
    {
        userId: 'demo-user-7',
        name: 'The Savoy London',
        description: 'Legendary hotel on the River Thames. Experience British elegance and tradition in this iconic London landmark.',
        location: 'Strand, London',
        city: 'London',
        country: 'UK',
        pricePerNight: 600,
        offerPrice: 480,
        images: [
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
        ],
        amenities: ['River Views', 'Historic Bar', 'Fine Dining', 'Theater District', 'Concierge', 'Fitness Center', 'Afternoon Tea', 'Chauffeur Service'],
        rating: 4.5,
        roomTypes: [
            { type: 'Deluxe Room', price: 600, maxGuests: 2, available: 10 },
            { type: 'Suite', price: 1200, maxGuests: 4, available: 5 },
            { type: 'Royal Suite', price: 2500, maxGuests: 6, available: 2 }
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        category: 'business',
        date: Date.now()
    },
    {
        userId: 'demo-user-8',
        name: 'Mandarin Oriental Bangkok',
        description: 'Riverside luxury with traditional Thai hospitality. Experience the perfect blend of modern luxury and Thai culture.',
        location: 'Chao Phraya River, Bangkok',
        city: 'Bangkok',
        country: 'Thailand',
        pricePerNight: 400,
        offerPrice: 320,
        images: [
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
        ],
        amenities: ['River Views', 'Spa', 'Thai Restaurant', 'Rooftop Pool', 'Concierge', 'Cultural Tours', 'Cooking Classes', 'Tuk Tuk Tours'],
        rating: 4.6,
        roomTypes: [
            { type: 'Deluxe Room', price: 400, maxGuests: 2, available: 8 },
            { type: 'Suite', price: 800, maxGuests: 4, available: 4 },
            { type: 'Presidential Suite', price: 1500, maxGuests: 6, available: 1 }
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        category: 'luxury',
        date: Date.now()
    },
    {
        userId: 'demo-user-9',
        name: 'The Langham Sydney',
        description: 'Harbor views and contemporary luxury. Enjoy stunning views of Sydney Harbor and the Opera House from this modern luxury hotel.',
        location: 'Circular Quay, Sydney',
        city: 'Sydney',
        country: 'Australia',
        pricePerNight: 500,
        offerPrice: 400,
        images: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
        ],
        amenities: ['Harbor Views', 'Rooftop Pool', 'Fine Dining', 'Opera House Views', 'Concierge', 'Fitness Center', 'Wine Bar', 'Harbor Cruises'],
        rating: 4.4,
        roomTypes: [
            { type: 'Deluxe Room', price: 500, maxGuests: 2, available: 12 },
            { type: 'Suite', price: 1000, maxGuests: 4, available: 6 },
            { type: 'Presidential Suite', price: 2000, maxGuests: 6, available: 2 }
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        category: 'business',
        date: Date.now()
    },
    {
        userId: 'demo-user-10',
        name: 'The Oberoi Udaipur',
        description: 'Palace hotel on Lake Pichola. Experience royal luxury in this magnificent palace hotel with stunning lake views.',
        location: 'Lake Pichola, Udaipur',
        city: 'Udaipur',
        country: 'India',
        pricePerNight: 700,
        offerPrice: 560,
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
        ],
        amenities: ['Lake Views', 'Palace Architecture', 'Spa', 'Cultural Experiences', 'Fine Dining', 'Boat Rides', 'Elephant Rides', 'Royal Gardens'],
        rating: 4.8,
        roomTypes: [
            { type: 'Deluxe Room', price: 700, maxGuests: 2, available: 6 },
            { type: 'Suite', price: 1400, maxGuests: 4, available: 4 },
            { type: 'Presidential Suite', price: 2800, maxGuests: 6, available: 2 }
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        category: 'resort',
        date: Date.now()
    }
];

export async function POST(request) {
    try {
        await connectDB();

        // Clear existing hotels
        await Hotel.deleteMany({});
        console.log('Cleared existing hotels');

        // Insert new hotels
        const insertedHotels = await Hotel.insertMany(hotels);
        console.log(`Successfully seeded ${insertedHotels.length} hotels`);

        return NextResponse.json({ 
            success: true, 
            message: `Successfully seeded ${insertedHotels.length} hotels`,
            count: insertedHotels.length
        });

    } catch (error) {
        console.error('Error seeding hotels:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}
