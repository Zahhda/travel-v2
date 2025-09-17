'use client'
import Navbar from '@/components/hotel-manager/Navbar'
import Sidebar from '@/components/hotel-manager/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        {children}
      </div>
    </div>
  )
}

export default Layout