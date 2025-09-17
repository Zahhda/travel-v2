'use client'
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/hotel-manager/Navbar';
import Sidebar from '@/components/hotel-manager/Sidebar';
import Footer from '@/components/hotel-manager/Footer';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AddHotel = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    city: '',
    country: '',
    pricePerNight: '',
    offerPrice: '',
    images: [''],
    amenities: [],
    rating: 5,
    roomTypes: [{
      type: 'Standard Room',
      price: '',
      maxGuests: 2,
      available: 10
    }],
    checkInTime: '15:00',
    checkOutTime: '11:00',
    category: 'luxury'
  });

  const amenityOptions = [
    'Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service',
    'Concierge', 'Valet Parking', 'Business Center', 'Pet Friendly', 'Airport Shuttle'
  ];

  const categoryOptions = [
    { value: 'luxury', label: 'Luxury' },
    { value: 'business', label: 'Business' },
    { value: 'resort', label: 'Resort' },
    { value: 'budget', label: 'Budget' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleRoomTypeChange = (index, field, value) => {
    const newRoomTypes = [...formData.roomTypes];
    newRoomTypes[index] = {
      ...newRoomTypes[index],
      [field]: field === 'price' || field === 'maxGuests' || field === 'available' ? parseInt(value) : value
    };
    setFormData(prev => ({
      ...prev,
      roomTypes: newRoomTypes
    }));
  };

  const addRoomType = () => {
    setFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, {
        type: 'Standard Room',
        price: '',
        maxGuests: 2,
        available: 10
      }]
    }));
  };

  const removeRoomType = (index) => {
    if (formData.roomTypes.length > 1) {
      const newRoomTypes = formData.roomTypes.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        roomTypes: newRoomTypes
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hotelData = {
        ...formData,
        userId: user.id,
        pricePerNight: parseInt(formData.pricePerNight),
        offerPrice: parseInt(formData.offerPrice),
        images: formData.images.filter(img => img.trim() !== ''),
        date: Date.now()
      };

      const { data } = await axios.post('/api/hotel/add', hotelData);
      
      if (data.success) {
        alert('Hotel added successfully!');
        router.push('/hotel-manager');
      } else {
        alert('Error adding hotel: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Error adding hotel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to add hotels.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab="hotels" setActiveTab={() => {}} />
        
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Hotel</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Night *</label>
                    <input
                      type="number"
                      name="pricePerNight"
                      value={formData.pricePerNight}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Offer Price *</label>
                    <input
                      type="number"
                      name="offerPrice"
                      value={formData.offerPrice}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Hotel Images</h2>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-4 mb-4">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Enter image URL"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Add Image
                </button>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenityOptions.map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Room Types */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Room Types</h2>
                {formData.roomTypes.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                        <input
                          type="text"
                          value={room.type}
                          onChange={(e) => handleRoomTypeChange(index, 'type', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                          type="number"
                          value={room.price}
                          onChange={(e) => handleRoomTypeChange(index, 'price', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests</label>
                        <input
                          type="number"
                          value={room.maxGuests}
                          onChange={(e) => handleRoomTypeChange(index, 'maxGuests', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label>
                        <input
                          type="number"
                          value={room.available}
                          onChange={(e) => handleRoomTypeChange(index, 'available', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    {formData.roomTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoomType(index)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove Room Type
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRoomType}
                  className="px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Add Room Type
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/hotel-manager')}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding Hotel...' : 'Add Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddHotel;
