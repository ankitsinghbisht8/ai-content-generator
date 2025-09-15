"use client"

import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { FileClock, Home, Settings, WalletCards } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import UsageTrack from './UsageTrack'

function SideNav() {
    const { isSignedIn } = useUser();
    const router = useRouter(); // Use the router to navigate

    const MenuList = [
        {
            name: 'Home',
            icon: Home,
            path: '/dashboard'
        },
        ...(isSignedIn ? [{
            name: 'History',
            icon: FileClock,
            path: '/dashboard/history'
        }] : []),
        {
            name: 'Billing',
            icon: WalletCards,
            path: '/dashboard/billing'
        },
        ...(isSignedIn ? [{
            name: 'Setting',
            icon: Settings,
            path: '/dashboard/settings'
        }] : []),

    ]

    const path = usePathname();
    useEffect(() => {
        console.log(path)
    }, [path])
    return (
        <div className='h-screen relative shadow-sm' style={{backgroundColor: '#2B2D42'}}>
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-600/30">
                <div className="flex items-center space-x-3 justify-center">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                        <Image src="/logoCrescent.svg" alt="Crescent" width={34} height={34} className="text-white filter brightness-0 invert" />
                    </div>
                    <span className="font-bold text-xl text-white">
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
                                ? 'bg-teal-600 text-white shadow-lg' 
                                : 'hover:bg-white/10 text-gray-300 hover:text-white'
                        }`} 
                        onClick={() => router.push(menu.path)}
                    >
                        <menu.icon className={`h-5 w-5 ${path == menu.path ? 'text-white' : 'text-gray-400 group-hover:text-teal-400'}`} />
                        <span className={`font-medium ${path == menu.path ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
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
