import React from 'react'
import { TEMPLATE } from './TemplateListSection'
import Image from 'next/image';
import Link from 'next/link';

const TemplateCard = (item:TEMPLATE) => {
  return (
    <Link href={'/dashboard/content/'+item?.slug}>
      <div className='group relative overflow-hidden rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer' style={{backgroundColor: '#F6F4F0'}}>
        {/* Gradient overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 transition-all duration-300'></div>
        
        <div className='relative p-6 flex flex-col gap-4 h-full'>
          {/* Icon with background */}
          <div className='flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300'>
            <Image src={item.icon} alt='icon' width={32} height={32} className='group-hover:scale-110 transition-transform duration-300' />
          </div>
          
          {/* Content */}
          <div className='flex-1 space-y-2'>
            <h3 className='font-semibold text-lg text-gray-900 group-hover:text-blue-900 transition-colors duration-300 line-clamp-2'>
              {item.name}
            </h3>
            <p className='text-sm text-gray-600 leading-relaxed line-clamp-3'>
              {item.desc}
            </p>
          </div>
          
          {/* Category badge */}
          <div className='flex items-center justify-between'>
            <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300'>
              {item.category}
            </span>
            <div className='w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300'></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TemplateCard
