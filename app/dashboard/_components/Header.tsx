import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { Search, Menu, X } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/utils/db'
import { UserSubscription } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext'
import SideNav from './SideNav'

function Header() {
  const router = useRouter();
  const { user } = useUser();
  const { userSubscription, setUserSubscription } = useContext(UserSubscriptionContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;
      try {
        const result = await db
          .select()
          .from(UserSubscription)
          .where(eq(UserSubscription.email, email));
        if (result.length > 0) {
          setUserSubscription(true);
        }
      } catch (e) {
        // noop
      }
    };
    load();
  }, [user, setUserSubscription]);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);
  return (
    <div className='bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm'>
      <div className='px-6 py-4 flex justify-between items-center'>
        {/* Search - Hidden on smaller screens for cleaner look */}
        <div className='flex items-center gap-3'>
          {/* Mobile menu button */}
          <button
            aria-label='Open menu'
            className='md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50'
            onClick={() => setMobileOpen(true)}
          >
            <Menu className='w-5 h-5 text-gray-700' />
          </button>
          <div className='hidden md:flex items-center max-w-md'>
          <div className='relative group'>
            <div className='flex items-center bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 transition-all duration-200'>
              <Search className='text-gray-400 mr-3 h-4 w-4'/>
              <input 
                type="text" 
                placeholder='Quick search...'
                className='bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm w-64'
              />
            </div>
          </div>
          </div>
        </div>

        {/* Right side */}
        <div className='flex items-center gap-4'>
          {/* Membership CTA */}
          {!userSubscription && (
            <div className='hidden lg:block'>
              <div className='bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105' onClick={() => router.push('/dashboard/billing')}>
                ✨ Upgrade to Pro - $9.99/month
              </div>
            </div>
          )}
          
          {/* Auth Controls */}
          <div className='relative'>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 rounded-xl border-2 border-gray-200 hover:border-emerald-300 transition-colors"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <div className='bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105'>
                  Sign in
                </div>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Mobile drawer for SideNav */}
      {mobileOpen && (
        <div className='fixed inset-0 z-50 md:hidden'>
          <div className='absolute inset-0 bg-black/50' onClick={() => setMobileOpen(false)}></div>
          <div className='absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-[#2B2D42] shadow-2xl overflow-hidden'>
            <button
              aria-label='Close menu'
              className='absolute top-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-gray-800 shadow hover:bg-white'
              onClick={() => setMobileOpen(false)}
            >
              <X className='w-5 h-5' />
            </button>
            <SideNav />
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
