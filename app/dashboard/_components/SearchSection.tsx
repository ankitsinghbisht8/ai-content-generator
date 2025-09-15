import { Search } from 'lucide-react'
import React from 'react'

const SearchSection = ({onSearchInput}:any) => {
  return (
    <div className='px-6 pb-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-6'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-2'>AI Content Templates</h2>
          <p className='text-gray-600'>Choose from our collection of AI-powered content generators</p>
        </div>
        
        {/* Search Bar */}
        <div className='w-full max-w-md'>
          <div className='relative'>
            <div className='flex items-center bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all'>
              <Search className='text-gray-400 mr-3 h-4 w-4'/>
              <input 
                type="text" 
                placeholder='Search templates...'
                onChange={(event)=>onSearchInput(event.target.value)}
                className='flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchSection
