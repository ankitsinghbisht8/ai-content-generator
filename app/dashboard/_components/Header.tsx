import { UserButton } from '@clerk/nextjs'
import { Search } from 'lucide-react'
import React from 'react'

function Header() {
  return (
    <div className='backdrop-blur-md border-b border-gray-100 sticky top-0 z-40' style={{backgroundColor: '#F6F4F0CC'}}>
      <div className='px-6 py-4 flex justify-between items-center'>
        {/* Search - Hidden on smaller screens for cleaner look */}
        <div className='hidden md:flex items-center max-w-md'>
          <div className='relative group'>
            <div className='flex items-center bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 transition-all'>
              <Search className='text-gray-400 mr-3 h-4 w-4'/>
              <input 
                type="text" 
                placeholder='Quick search...'
                className='bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm w-64'
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className='flex items-center gap-4'>
          {/* Membership CTA */}
          <div className='hidden lg:block'>
            <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all cursor-pointer'>
              ✨ Upgrade to Pro - $9.99/month
            </div>
          </div>
          
          {/* User Button */}
          <div className='relative'>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
