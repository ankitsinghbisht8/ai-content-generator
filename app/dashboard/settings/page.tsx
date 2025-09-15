import { UserProfile, SignedIn, SignedOut, SignIn } from '@clerk/nextjs'
import React from 'react'

function Settings() {
  return (
    <div className='flex items-center justify-center min-h-screen p-6' style={{backgroundColor: '#EDF2F4'}}>
      <SignedIn>
        <div className='bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl'>
          <UserProfile routing="hash" />
        </div>
      </SignedIn>
      <SignedOut>
        <div className='bg-white rounded-2xl shadow-lg p-8 w-full max-w-md'>
          <SignIn />
        </div>
      </SignedOut>
    </div>
  )
}

export default Settings
