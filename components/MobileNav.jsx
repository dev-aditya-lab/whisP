'use client'
import { MessageSquareLockIcon, MessageSquareMoreIcon, ShieldUserIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

export default function MobileNav() {

  const pathname = usePathname()

  return (
    <div className='z-50 relative'>
      <nav className="fixed bottom-0 left-0 w-full bg-white h-16 border-t-2  border-gray-200 shadow-lg flex justify-around items-center z-50">

        <Link href={'/allChat'} className={`flex flex-col items-center ${pathname === '/allChat' ? 'text-blue-600' : 'text-black'}`}>
          <MessageSquareMoreIcon />
          <p className='font-medium'>Chats</p>
        </Link>

        <Link href={'/chatSetting'} className={`flex flex-col items-center ${pathname === '/chatSetting' ? 'text-blue-600' : 'text-black'}`}>
          <MessageSquareLockIcon />
          <p className='font-medium'>Chat Setting</p>
        </Link>
        
        <Link href={'/userProfile'} className={`flex flex-col items-center ${pathname === '/userProfile' ? 'text-blue-600' : 'text-black'}`}>
          <ShieldUserIcon />
          <p className='font-medium'>Profile</p>
        </Link>
      </nav>
    </div>
  )
}
