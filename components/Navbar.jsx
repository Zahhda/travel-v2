"use client"
import React, { useState } from "react";
import { assets, BoxIcon, CartIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isHotelManager, router, user, bookings } = useAppContext();
  const { openSignIn } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuLinks = [
    { href: '/', label: 'Home' },
    { href: '/all-hotels', label: 'Hotels' },
    { href: '/flights', label: 'Flights' },
    { href: '/my-bookings', label: 'My Bookings' },
    { href: '/contact', label: 'Contact' }
  ];

  const iconMap = {
    booking: (active) => (
      <svg className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-700'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m7 6 5 5 5-5m-5 5V2m-8 2 5 5 5-5" />
      </svg>
    ),
    hotel: (active) => (
      <svg className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-700'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8-4 8 4v13H4V7Z M8 21V11h8v10" />
      </svg>
    ),
    close: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-700'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    menu: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-700'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ui-panel glass-ring flex items-center justify-between h-16 mt-3 rounded-full px-3 sm:px-6">
          {/* Logo */}
          <Image
            className="cursor-pointer w-36 sm:w-44 h-12 sm:h-14 object-contain"
            onClick={() => router.push('/')}
            src={assets.logo}
            alt="Go Luxus Logo"
            width={160}
            height={56}
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-900/5 font-medium transition-all duration-200 text-sm"
              >
                {link.label}
              </Link>
            ))}
            {isHotelManager && (
              <button
                onClick={() => router.push('/hotel-manager')}
                className="ml-2 btn-primary px-5 py-2 text-sm"
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
                className="icon-btn relative"
                title="My Bookings"
              >
                {iconMap.booking(false)}
                {bookings && bookings.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow">
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
                className="btn-ghost px-4 py-2 text-sm"
              >
                <Image src={assets.user_icon} alt="user icon" width={16} height={16} />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {isHotelManager && (
              <button
                onClick={() => router.push('/hotel-manager')}
                className="btn-primary text-xs px-3 py-1.5"
              >
                Manager
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="icon-btn"
              aria-label="Open navigation"
            >
              {isMobileMenuOpen ? iconMap.close() : iconMap.menu()}
            </button>
            {user ? (
              <UserButton />
            ) : (
              <button 
                onClick={openSignIn} 
                className="btn-ghost px-2 py-2 text-sm"
              >
                <Image src={assets.user_icon} alt="user icon" width={16} height={16} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden ui-panel glass-ring rounded-3xl mt-2 mb-2 p-4">
            <div className="grid gap-2">
              {menuLinks.map((link) => (
                <Link
                  key={`mobile-${link.href}`}
                  href={link.href}
                  className="text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-900/5 font-medium transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
