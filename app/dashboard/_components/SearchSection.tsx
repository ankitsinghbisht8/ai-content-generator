import { Search } from 'lucide-react'
import React from 'react'

const SearchSection = ({onSearchInput}:any) => {
  return (
    <div className='relative overflow-hidden'>
      {/* Background with subtle gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'></div>
      <div className='absolute inset-0 backdrop-blur-sm' style={{backgroundColor: '#F6F4F0AA'}}></div>
      
      {/* Content */}
      <div className='relative px-6 py-16 md:py-20 flex flex-col justify-center items-center text-center max-w-4xl mx-auto'>
        <div className='mb-8 space-y-4'>
          <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent'>
            Browse All Templates
          </h1>
          <p className='text-lg md:text-xl text-gray-600 font-medium'>
            What would you like to create today?
          </p>
        </div>
        
        {/* Enhanced Search */}
        <div className='w-full max-w-2xl'>
          <div className='relative group'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity'></div>
            <div className='relative flex items-center rounded-2xl shadow-lg border border-gray-200/50 p-4 transition-all group-hover:shadow-xl' style={{backgroundColor: '#F6F4F0'}}>
              <Search className='text-gray-400 mr-4 h-5 w-5'/>
              <input 
                type="text" 
                placeholder='Search templates...'
                onChange={(event)=>onSearchInput(event.target.value)}
                className='flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-lg'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchSection
