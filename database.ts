import { hotels as seedHotels } from "@/assets/productData"

const normalizeText = (value = "") =>
    value.toString().trim().toLowerCase();

const createSlug = (value = "") =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

const addRatingSignals = () => {
    const reviewCounts = [1420, 2190, 1880, 960, 3200, 2740, 1320, 2050, 1110, 2460];
    const ratings = [4.8, 4.9, 4.7, 4.6, 4.8, 4.7, 4.5, 4.6, 4.4, 4.8];

    return seedHotels.map((hotel, index) => {
        const city = hotel.city?.trim() || "";
        const country = hotel.country?.trim() || "";
        const images = hotel.images || [hotel.imgSrc].filter(Boolean);

        return {
            ...hotel,
            _id: `demo-hotel-${index + 1}`,
            slug: createSlug(hotel.name),
            city,
            country,
            location: `${hotel.location}`,
            images,
            reviewCount: reviewCounts[index % reviewCounts.length],
            rating: ratings[index % ratings.length],
            highlights: [
                `${city}, ${country}`,
                `From ${hotel.offerPrice}/night`,
                "Flexible cancellation"
            ].filter(Boolean),
            isDemoHotel: true,
            searchTags: [hotel.name, city, country, hotel.category, ...hotel.amenities].map(normalizeText),
            displayPrice: hotel.offerPrice
        }
    });
}

export const DEMO_HOTELS = addRatingSignals();

export const getHotels = () => DEMO_HOTELS;

export const findHotel = (identifier) => {
    const value = identifier?.toString().toLowerCase();
    if (!value) return null;

    return DEMO_HOTELS.find((hotel) =>
        hotel._id.toString() === value ||
        hotel.slug === value ||
        hotel.name.toLowerCase() === value
    ) || null;
}

export const getHotelOptions = () => DEMO_HOTELS.map((hotel) => ({
    label: hotel.name,
    value: hotel._id
}));
