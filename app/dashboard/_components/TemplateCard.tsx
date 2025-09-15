import React from 'react'
import { TEMPLATE } from './TemplateListSection'
import Image from 'next/image';
import Link from 'next/link';

const TemplateCard = (item:TEMPLATE) => {
  // Define subtle accent colors for different categories
  const getCategoryColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'content writing':
        return 'text-blue-600 bg-blue-50 border-blue-100'
      case 'social media':
        return 'text-rose-600 bg-rose-50 border-rose-100'
      case 'email':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100'
      case 'marketing':
        return 'text-purple-600 bg-purple-50 border-purple-100'
      case 'blog':
        return 'text-orange-600 bg-orange-50 border-orange-100'
      case 'youtube':
        return 'text-red-600 bg-red-50 border-red-100'
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-100'
    }
  }

  const getIconBackground = (category: string) => {
    switch(category.toLowerCase()) {
      case 'content writing':
        return 'bg-blue-50 border-blue-100'
      case 'social media':
        return 'bg-rose-50 border-rose-100'
      case 'email':
        return 'bg-emerald-50 border-emerald-100'
      case 'marketing':
        return 'bg-purple-50 border-purple-100'
      case 'blog':
        return 'bg-orange-50 border-orange-100'
      case 'youtube':
        return 'bg-red-50 border-red-100'
      default:
        return 'bg-emerald-50 border-emerald-100'
    }
  }

  return (
    <Link href={'/dashboard/content/'+item?.slug}>
      <div className='group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1 overflow-hidden'>
        
        {/* Subtle top accent line */}
        <div className={`h-1 ${getCategoryColor(item.category).split(' ')[1]}`}></div>
        
        <div className='p-5'>
          {/* Icon and title row */}
          <div className='flex items-start gap-3 mb-3'>
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getIconBackground(item.category)} border group-hover:scale-105 transition-transform duration-200 flex-shrink-0`}>
              <Image src={item.icon} alt='icon' width={20} height={20} className='opacity-80' />
            </div>
            
            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold text-base text-gray-900 leading-tight line-clamp-2 mb-1'>
                {item.name}
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>
          </div>
          
          {/* Description */}
          <p className='text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4'>
            {item.desc}
          </p>
          
          {/* Bottom action area */}
          <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
            <div className='flex items-center space-x-1'>
              <div className='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>
              <div className='w-1.5 h-1.5 bg-gray-200 rounded-full'></div>
              <div className='w-1.5 h-1.5 bg-gray-100 rounded-full'></div>
            </div>
            
            <div className='flex items-center text-gray-500 text-xs font-medium group-hover:text-gray-700 transition-colors duration-200'>
              <span className='mr-1'>Try</span>
              <svg className='w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TemplateCard
