import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <Image className="w-40 h-14 object-contain" src={assets.logo} alt="Go Luxus Logo" width={160} height={56} />
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Your premier destination for luxury hotel bookings. Experience exceptional hospitality and create unforgettable memories at the world's finest accommodations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-yellow-500 p-3 rounded-full transition-colors duration-300">
                <Image src={assets.facebook_icon} alt="Facebook" width={20} height={20} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-yellow-500 p-3 rounded-full transition-colors duration-300">
                <Image src={assets.twitter_icon} alt="Twitter" width={20} height={20} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-yellow-500 p-3 rounded-full transition-colors duration-300">
                <Image src={assets.instagram_icon} alt="Instagram" width={20} height={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/all-hotels" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">All Hotels</Link></li>
              <li><Link href="/flights" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Flights</Link></li>
              <li><Link href="/my-bookings" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">My Bookings</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">About Us</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6">Subscribe to our newsletter for exclusive deals and travel tips</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2024 Go Luxus. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;