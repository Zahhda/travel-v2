"use client"
import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isHotelManager, router, user, bookings } = useAppContext();
  const { openSignIn } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Image
            className="cursor-pointer w-40 h-14 object-contain"
            onClick={() => router.push('/')}
            src={assets.logo}
            alt="Go Luxus Logo"
            width={160}
            height={56}
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-300">
              Home
            </Link>
            <Link href="/all-hotels" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-300">
              Hotels
            </Link>
            <Link href="/flights" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-300">
              Flights
            </Link>
            <Link href="/my-bookings" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-300">
              My Bookings
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-300">
              Contact
            </Link>
            {isHotelManager && (
              <button
                onClick={() => router.push('/hotel-manager')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Hotel Manager
              </button>
            )}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <button 
                onClick={() => router.push('/my-bookings')}
                className="relative p-2 text-gray-600 hover:text-yellow-600 transition-colors"
              >
                <Image className="w-5 h-5" src={assets.order_icon} alt="bookings icon" width={20} height={20} />
                {bookings && bookings.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {bookings.length}
                  </span>
                )}
              </button>
            )}
            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="My Bookings" labelIcon={<CartIcon />} onClick={() => router.push('/my-bookings')} />
                  <UserButton.Action label="Contact" labelIcon={<BoxIcon />} onClick={() => router.push('/contact')} />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <button 
                onClick={openSignIn} 
                className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-300"
              >
                <Image src={assets.user_icon} alt="user icon" width={20} height={20} />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {isHotelManager && (
              <button
                onClick={() => router.push('/hotel-manager')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-300"
              >
                Manager
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {user ? (
              <UserButton />
            ) : (
              <button 
                onClick={openSignIn} 
                className="flex items-center gap-1 text-gray-700 hover:text-yellow-600 transition-colors"
              >
                <Image src={assets.user_icon} alt="user icon" width={20} height={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-yellow-600 font-medium px-4 py-2 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/all-hotels" 
                className="text-gray-700 hover:text-yellow-600 font-medium px-4 py-2 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hotels
              </Link>
              <Link 
                href="/flights" 
                className="text-gray-700 hover:text-yellow-600 font-medium px-4 py-2 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Flights
              </Link>
              <Link 
                href="/my-bookings" 
                className="text-gray-700 hover:text-yellow-600 font-medium px-4 py-2 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-yellow-600 font-medium px-4 py-2 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;