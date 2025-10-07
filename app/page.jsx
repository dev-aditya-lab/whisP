import OpenInPhone from '@/components/OpenInPhone'
import Number from '@/pages/Number'
import React from 'react'

export default function page() {
  return (
    <>
      <div className='hidden md:block'>
        <OpenInPhone />
      </div>
      <div className='md:hidden pb-16'>
        {/* Main App Content for Mobile Users */}
        {/* <MobileNav/> */}
        <Number/>
      </div>
    </>
  )
}
