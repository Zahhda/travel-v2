import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {

  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b bg-yellow-50'>
      <Image onClick={()=>router.push('/')} className='w-28 lg:w-32 cursor-pointer' src={assets.logo} alt="" width={128} height={48} />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Hotel Manager Dashboard</span>
        <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
