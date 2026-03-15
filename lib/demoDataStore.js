import { findHotel, getHotels } from '@/database'

const rootStore = globalThis.__TRAVEL_DEMO_API_STORE || (globalThis.__TRAVEL_DEMO_API_STORE = {
  bookings: {},
  cartItems: {},
  addresses: {},
  orders: {}
});

const normalizeUserId = (userId) => userId ? `${userId}` : 'demo-visitor';

const ensureUserBucket = (bucket, userId) => {
  const key = normalizeUserId(userId)
  if (!bucket[key]) {
    bucket[key] = []
  }
  return bucket[key]
}

export const getDemoUser = (userId) => {
  const key = normalizeUserId(userId)

  return {
    _id: key,
    name: 'Demo User',
    email: `demo-${key.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}@example.com`,
    imageUrl: '',
    cartItems: getDemoCart(key)
  }
}

export const getDemoBookings = (userId) => {
  const key = normalizeUserId(userId)
  return rootStore.bookings[key] || []
}

export const addDemoBooking = (userId, bookingData) => {
  const key = normalizeUserId(userId)
  const existingHotels = getHotels()

  const hotel = findHotel(bookingData.hotelId) || existingHotels.find((item) => item.slug === bookingData.hotelId || item.name === bookingData.hotelName) || null

  if (!hotel) {
    throw new Error('Hotel not found in demo database')
  }

  const room = (hotel.roomTypes || []).find((entry) => entry.type === bookingData.roomType) || hotel
  const checkInDate = new Date(bookingData.checkInDate)
  const checkOutDate = new Date(bookingData.checkOutDate)
  const totalNights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)))
  const unitPrice = room?.price || room?.pricePerNight || hotel.offerPrice || hotel.pricePerNight || 0
  const baseAmount = bookingData.baseAmount || bookingData.amount || (unitPrice * totalNights * (bookingData.rooms || 1))
  const tax = bookingData.tax || Math.round(baseAmount * 0.1)
  const amount = bookingData.amount || baseAmount + tax

  const booking = {
    _id: `BK-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    bookingReference: `BK-${Date.now()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    userId: key,
    hotel: hotel._id,
    hotelId: hotel._id,
    hotelDetails: {
      _id: hotel._id,
      name: hotel.name,
      location: hotel.location,
      images: hotel.images,
    },
    status: bookingData.status || 'Confirmed',
    paymentStatus: bookingData.paymentStatus || 'Completed',
    roomType: bookingData.roomType,
    checkInDate: new Date(bookingData.checkInDate).toISOString(),
    checkOutDate: new Date(bookingData.checkOutDate).toISOString(),
    guests: Number(bookingData.guests || 1),
    rooms: Number(bookingData.rooms || 1),
    totalNights,
    amount,
    baseAmount,
    tax,
    guestInfo: bookingData.guestInfo || {},
    specialRequests: bookingData.specialRequests || '',
    date: bookingData.date || new Date().toISOString()
  }

  const list = ensureUserBucket(rootStore.bookings, key)
  list.unshift(booking)
  return booking
}

export const updateDemoBookingStatus = (bookingId, updateData = {}) => {
  const buckets = rootStore.bookings

  for (const list of Object.values(buckets)) {
    const found = (list || []).find((item) => item._id === bookingId)
    if (found) {
      Object.assign(found, updateData)
      return found
    }
  }

  return null
}

export const getAllDemoBookings = () => {
  return Object.values(rootStore.bookings).flat()
}

export const getDemoCart = (userId) => {
  const key = normalizeUserId(userId)

  if (!rootStore.cartItems[key]) {
    rootStore.cartItems[key] = {}
  }

  return rootStore.cartItems[key]
}

export const setDemoCart = (userId, cartItems) => {
  const key = normalizeUserId(userId)
  rootStore.cartItems[key] = cartItems || {}
  return rootStore.cartItems[key]
}

export const getDemoAddresses = (userId) => {
  const key = normalizeUserId(userId)

  if (!rootStore.addresses[key]) {
    rootStore.addresses[key] = []
  }

  return rootStore.addresses[key]
}

export const addDemoAddress = (userId, address) => {
  const key = normalizeUserId(userId)
  const list = getDemoAddresses(key)
  const next = {
    _id: `AD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    ...address,
    userId: key
  }

  list.push(next)
  return next
}

export const getDemoOrders = (userId) => {
  const key = normalizeUserId(userId)

  if (!rootStore.orders[key]) {
    rootStore.orders[key] = []
  }

  return rootStore.orders[key]
}

export const getAllDemoOrders = () => {
  return Object.values(rootStore.orders).flat()
}

export const createDemoOrder = (userId, orderData) => {
  const key = normalizeUserId(userId)
  const { address, items = [] } = orderData
  const products = getHotels()

  const resolvedItems = items.map((item) => {
    const product =
      typeof item?.product === 'string'
        ? products.find((hotel) => hotel._id === item.product || hotel.slug === item.product)
        : (item?.product || {})

    const productId = product?._id || `PR-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const price = product?.offerPrice || product?.pricePerNight || item?.price || 0
    return {
      ...item,
      product: {
        _id: productId,
        name: product?.name || 'Demo Hotel',
        pricePerNight: price,
        offerPrice: price
      }
    }
  })

  const itemsAmount = resolvedItems.reduce((sum, item) => {
    const rate = item?.product?.offerPrice || item?.product?.pricePerNight || 0
    const quantity = Number(item?.quantity || 1)
    return sum + rate * quantity
  }, 0)

  const order = {
    _id: `OR-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    userId: key,
    address,
    items: resolvedItems,
    amount: itemsAmount + Math.floor(itemsAmount * 0.02),
    status: 'Placed',
    paymentStatus: 'Pending',
    date: new Date().toISOString()
  }

  const list = getDemoOrders(key)
  list.unshift(order)
  return order
}

