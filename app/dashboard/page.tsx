"use client"
import React, { useState } from 'react'
import SearchSection from './_components/SearchSection'
import TemplateListSection from './_components/TemplateListSection'

function Dashboard() {
  const [userSearchInput, setUserInput] = useState<string>()
  return (
    <div className="min-h-screen">
      {/* Search Section */}
      <SearchSection onSearchInput={(value: string) => setUserInput(value)} />

      {/* Template List Section */}
      <TemplateListSection userSearchInput={userSearchInput} />
    </div>
  )
}

export default Dashboard
