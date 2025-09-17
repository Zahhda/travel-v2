'use client'
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const PaymentPopup = ({ isOpen, onClose, onSuccess, bookingData }) => {
  const [currentStep, setCurrentStep] = useState('processing');
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [isCompleted, setIsCompleted] = useState(false);
  const progressIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const hasStartedRef = useRef(false);

  // Only run when popup opens, not when it closes
  useEffect(() => {
    if (isOpen && !hasStartedRef.current) {
      console.log('PaymentPopup: Opening popup');
      hasStartedRef.current = true;
      setCurrentStep('processing');
      setProgress(0);
      setCountdown(3);
      setIsCompleted(false);
      
      // Start processing immediately
      startProcessing();
    }
  }, [isOpen]);

  // Reset the hasStarted flag when popup closes
  useEffect(() => {
    if (!isOpen) {
      hasStartedRef.current = false;
      // Clean up intervals
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }
  }, [isOpen]);

  const startProcessing = () => {
    console.log('PaymentPopup: Starting processing');
    let currentProgress = 0;
    
    progressIntervalRef.current = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setProgress(100);
        console.log('PaymentPopup: Processing complete, showing success');
        setCurrentStep('success');
        startCountdown();
      }
    }, 80); // 4 seconds total
  };

  const startCountdown = () => {
    console.log('PaymentPopup: Starting countdown');
    let timeLeft = 3;
    setCountdown(3);
    
    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      
      if (timeLeft <= 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        console.log('PaymentPopup: Countdown complete, triggering success');
        completePayment();
      }
    }, 1000);
  };

  const completePayment = async () => {
    if (isCompleted) {
      console.log('PaymentPopup: Already completed, skipping');
      return;
    }
    
    setIsCompleted(true);
    console.log('PaymentPopup: Completing payment and creating booking');
    
    try {
      const result = await onSuccess();
      console.log('PaymentPopup: Booking creation result:', result);
      
      if (result && result.bookingId) {
        console.log('PaymentPopup: Booking created successfully');
        
        // Wait a moment then redirect
        setTimeout(() => {
          console.log('PaymentPopup: Redirecting to bookings page');
          onClose();
          window.location.href = '/my-bookings';
        }, 1000);
      } else {
        throw new Error('Booking creation failed - no booking ID returned');
      }
    } catch (error) {
      console.error('PaymentPopup: Error completing payment:', error);
      alert(`Failed to complete booking: ${error.message || 'Please try again.'}`);
      onClose();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image
              src={assets.logo}
              alt="Go Luxus"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStep === 'processing' ? 'Processing Payment' : 'Booking Confirmed!'}
          </h2>
          <p className="text-gray-600">
            {currentStep === 'processing' 
              ? 'Please wait while we process your payment...' 
              : 'Your hotel booking has been confirmed successfully!'
            }
          </p>
        </div>

        {/* Processing Step */}
        {currentStep === 'processing' && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Animated Dots */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>

            {/* Development Mode Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-800 font-medium">
                Development Mode - Testing Purpose Only
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This is a simulated payment process
              </p>
            </div>
          </div>
        )}

        {/* Success Step */}
        {currentStep === 'success' && (
          <div className="space-y-6">
            {/* Success Animation */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Booking Details */}
            {bookingData && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Booking Summary</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Hotel:</span>
                    <span className="text-right">{bookingData.hotelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Room Type:</span>
                    <span className="text-right">{bookingData.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Check-in:</span>
                    <span className="text-right">{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Check-out:</span>
                    <span className="text-right">{new Date(bookingData.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Nights:</span>
                    <span className="text-right">{bookingData.totalNights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Rooms:</span>
                    <span className="text-right">{bookingData.rooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Guests:</span>
                    <span className="text-right">{bookingData.guests}</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">${bookingData.amount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Countdown */}
            <div className="text-center">
              <p className="text-gray-600 mb-2">Redirecting to your bookings in:</p>
              <div className="text-3xl font-bold text-yellow-600">
                {countdown}
              </div>
            </div>

            {/* Development Mode Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-green-800 font-medium">
                ✓ Test Payment Completed Successfully
              </p>
              <p className="text-xs text-green-600 mt-1">
                Your booking has been created in the system
              </p>
            </div>
          </div>
        )}

        {/* Close Button (only show if not completed) */}
        {!isCompleted && (
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Cancel Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPopup;