import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <Image className="w-40 h-14 object-contain" src={assets.logo} alt="Go Luxus Logo" width={160} height={56} />
            </div>
            <p className="text-slate-300 max-w-md leading-relaxed mb-6">
              Discover extraordinary stays, from luxury hotels to resort escapes, all crafted for seamless booking and unforgettable journeys.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="icon-btn bg-slate-800 text-white hover:bg-slate-700">🌐</a>
              <a href="#" className="icon-btn bg-slate-800 text-white hover:bg-slate-700">📸</a>
              <a href="#" className="icon-btn bg-slate-800 text-white hover:bg-slate-700">✉️</a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black mb-6">Explore</h3>
            <ul className="space-y-4">
              <li><Link href="/all-hotels" className="text-slate-300 hover:text-white transition-colors">All Hotels</Link></li>
              <li><Link href="/flights" className="text-slate-300 hover:text-white transition-colors">Flights</Link></li>
              <li><Link href="/my-bookings" className="text-slate-300 hover:text-white transition-colors">My Bookings</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-black mb-6">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <p className="text-slate-400 text-sm">© 2026 Go Luxus. All rights reserved.</p>
            <div className="flex gap-5 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
