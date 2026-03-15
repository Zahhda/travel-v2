import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const HotelCard = ({ hotel }) => {
    const { currency, router } = useAppContext();
    const reviewCount = hotel.reviewCount || Math.round(1000 + (hotel._id?.length || 0) * 37);

    const scrollTo = (x, y) => {
        window.scrollTo(x, y);
    };

    const createSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const savings = hotel.offerPrice && hotel.pricePerNight
        ? Math.max(0, Math.round(((hotel.pricePerNight - hotel.offerPrice) / hotel.pricePerNight) * 100))
        : 0;

    return (
        <article
            onClick={() => {
                router.push('/hotel/' + (hotel.slug || createSlug(hotel.name)));
                scrollTo(0, 0);
            }}
            className="ui-card group relative cursor-pointer overflow-hidden rounded-3xl"
        >
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={hotel.images?.[0] || hotel.imgSrc || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop'}
                    alt={hotel.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="ui-chip uppercase tracking-wide">{hotel.category || 'Hotel'}</span>
                    {savings > 0 && (
                        <span className="ui-chip bg-emerald-50 text-emerald-700 border-emerald-200/80">
                            Save {savings}%
                        </span>
                    )}
                </div>

                <button className="absolute top-4 right-4 icon-btn bg-white/80" aria-label="Save hotel">
                    <Image
                        className="h-4 w-4"
                        src={assets.heart_icon}
                        alt="Save"
                        width={16}
                        height={16}
                    />
                </button>

                <div className="absolute left-4 bottom-4 right-4">
                    <div className="text-white">
                        <p className="text-sm font-semibold opacity-90">{hotel.location}</p>
                        <h3 className="text-2xl font-bold leading-tight">{hotel.name}</h3>
                    </div>
                </div>
            </div>

            <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, index) => (
                                <Image
                                    key={index}
                                    className="h-4 w-4"
                                    src={index < Math.floor(hotel.rating || 0) ? assets.star_icon : assets.star_dull_icon}
                                    alt="rating"
                                    width={16}
                                    height={16}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{hotel.rating || 0}</span>
                    </div>
                    <span className="text-xs text-slate-500">{reviewCount.toLocaleString()} reviews</span>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                        <div className="text-2xl font-black text-slate-900">
                            {currency}{hotel.offerPrice || hotel.pricePerNight}
                        </div>
                        {hotel.offerPrice && hotel.pricePerNight ? (
                            <p className="text-sm text-slate-500 line-through">{currency}{hotel.pricePerNight}</p>
                        ) : null}
                        <p className="text-xs text-slate-500 mt-1">per night</p>
                    </div>
                    <button className="btn-primary px-4 py-2.5 text-sm">
                        Book Now
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {(hotel.highlights || []).slice(0, 2).map((highlight) => (
                        <span key={highlight} className="ui-chip border-0 bg-slate-100 text-slate-700">
                            {highlight}
                        </span>
                    ))}
                    <span className="ui-chip border-0 bg-slate-100 text-slate-700">
                        {hotel.roomTypes?.length || 0} room options
                    </span>
                </div>
            </div>
        </article>
    );
};

export default HotelCard;