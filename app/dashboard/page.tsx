"use client"
import React, { useState } from 'react'
import SearchSection from './_components/SearchSection'
import TemplateListSection from './_components/TemplateListSection'
import { BarChart3, TrendingUp, Users, Zap, FileText, Clock } from 'lucide-react'

function Dashboard() {
  const [userSearchInput, setUserInput] = useState<string>()
  
  const statsCards = [
    {
      title: "Monthly Generations",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
      color: "teal"
    },
    {
      title: "Words Generated",
      value: "45.2k",
      change: "+8%", 
      trend: "up",
      icon: FileText,
      color: "blue"
    },
    {
      title: "Active Templates",
      value: "24",
      change: "+3",
      trend: "up", 
      icon: Zap,
      color: "purple"
    },
    {
      title: "Avg. Response Time",
      value: "2.1s",
      change: "-0.3s",
      trend: "down",
      icon: Clock,
      color: "green"
    }
  ]

  return (
    <div className="min-h-screen" style={{backgroundColor: '#EDF2F4'}}>
      {/* Stats Grid */}
      <div className="p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  stat.color === 'teal' ? 'bg-teal-100' :
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'purple' ? 'bg-purple-100' : 'bg-green-100'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'teal' ? 'text-teal-600' :
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'purple' ? 'text-purple-600' : 'text-green-600'
                  }`} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <SearchSection onSearchInput={(value: string) => setUserInput(value)} />

      {/* Template List Section */}
      <TemplateListSection userSearchInput={userSearchInput} />
    </div>
  )
}

export default Dashboard
