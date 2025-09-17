'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { assets } from '@/assets/assets';

const FlightsPage = () => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto relative">
              {/* Plane Animation */}
              <div className={`absolute inset-0 transition-all duration-1000 ${
                animationStep === 0 ? 'transform translate-x-0 translate-y-0 rotate-0' :
                animationStep === 1 ? 'transform translate-x-8 translate-y-4 rotate-12' :
                animationStep === 2 ? 'transform translate-x-16 translate-y-8 rotate-24' :
                'transform translate-x-24 translate-y-12 rotate-36'
              }`}>
                <svg className="w-full h-full text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              
              {/* Cloud Animation */}
              <div className={`absolute -top-4 -right-4 transition-all duration-1000 ${
                animationStep === 0 ? 'opacity-100 scale-100' :
                animationStep === 1 ? 'opacity-80 scale-90' :
                animationStep === 2 ? 'opacity-60 scale-80' :
                'opacity-40 scale-70'
              }`}>
                <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                </svg>
              </div>
              
              {/* Globe Animation */}
              <div className={`absolute -bottom-2 -left-2 transition-all duration-1000 ${
                animationStep === 0 ? 'opacity-60 scale-90' :
                animationStep === 1 ? 'opacity-70 scale-95' :
                animationStep === 2 ? 'opacity-80 scale-100' :
                'opacity-90 scale-105'
              }`}>
                <svg className="w-20 h-20 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="mb-8">
            <Image
              src={assets.logo}
              alt="Go Luxus Logo"
              width={200}
              height={70}
              className="mx-auto"
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                Flights
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Coming Soon - Your Gateway to the World
            </p>

            {/* Under Development Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-yellow-100 border border-yellow-300 rounded-full text-yellow-800 font-semibold text-lg mb-8">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
              Under Development
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Flight Search</h3>
                <p className="text-gray-600">Find the best flight deals with our advanced search engine</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Alerts</h3>
                <p className="text-gray-600">Get notified when flight prices drop to your desired level</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Deals</h3>
                <p className="text-gray-600">Exclusive offers and discounts from top airlines worldwide</p>
              </div>
            </div>


            {/* CTA Button */}
            <div className="mt-12 mb-24">
              {/* <button 
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Back to Hotels
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FlightsPage;
