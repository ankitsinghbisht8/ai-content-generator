"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import { FileClock, Home, Settings, WalletCards } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import UsageTrack from './UsageTrack'

function SideNav() {
    const router = useRouter(); // Use the router to navigate

    const MenuList = [
        {
            name: 'Home',
            icon: Home,
            path: '/dashboard'
        },
        {
            name: 'History',
            icon: FileClock,
            path: '/dashboard/history'
        },
        {
            name: 'Billing',
            icon: WalletCards,
            path: '/dashboard/billing'
        },
        {
            name: 'Setting',
            icon: Settings,
            path: '/dashboard/settings'
        },

    ]

    const path = usePathname();
    useEffect(() => {
        console.log(path)
    }, [path])
    return (
        <div className='h-screen relative border-r border-gray-100' style={{backgroundColor: '#F6F4F0'}}>
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 justify-center">
                    <div className="w-15 h-15 rounded-lg flex items-center justify-center">
                        <Image src="/logoCrescent.svg" alt="AIContent" width={30} height={30} className="text-white" />
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Crescent
                    </span>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className='p-4 space-y-2'>
                {MenuList.map((menu, index) => (
                    <div 
                        key={index}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                            path == menu.path 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                        }`} 
                        onClick={() => router.push(menu.path)}
                    >
                        <menu.icon className={`h-5 w-5 ${path == menu.path ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                        <span className={`font-medium ${path == menu.path ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                            {menu.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Usage Track */}
            <div className='absolute bottom-0 left-0 right-0 p-4'>
                <UsageTrack />
            </div>
        </div>
    )
}

export default SideNav;
