"use client"
import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Copy, Eye, EyeOff, Calendar, FileText, Sparkles } from 'lucide-react'

export interface HISTORY {
  id: number;
  formData: string;
  aiResponse: string | null;
  templateSlug: string;
  createdBy: string | null;
  createdAt: Date | string | null;
}

const ITEMS_PER_PAGE = 10

const HistoryClient = ({ data }: { data: HISTORY[] }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [copiedItem, setCopiedItem] = useState<number | null>(null)

  const templateMap = useMemo(() => {
    return Templates.reduce((acc, template) => {
      acc[template.slug] = template
      return acc
    }, {} as Record<string, { slug: string; name: string; icon: string; desc: string }>)
  }, [])

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = data.slice(startIndex, endIndex)

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(id)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Unknown'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getWordCount = (text: string | null) => {
    if (!text) return 0
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const formatResponse = (response: string | null) => {
    if (!response) return 'No response'
    
    // Handle image responses (base64 data URLs)
    if (response.includes('data:image/')) {
      const imageCount = (response.match(/data:image\//g) || []).length
      return `Generated ${imageCount} image${imageCount > 1 ? 's' : ''}`
    }
    
    // Handle regular text responses
    return response
  }

  const isImageResponse = (response: string | null) => {
    return response?.includes('data:image/') || false
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-6 mb-6">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No History Available</h3>
        <p className="text-gray-500 max-w-md">
          Start creating content with our AI templates to see your history here. Your past generations will be saved and easily accessible.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
              <Sparkles className="h-6 w-6 text-white" />
            </div> */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Generation History</h1>
              <p className="text-gray-600">View and manage your past AI-generated content</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <div className="text-sm text-gray-500">Total Generations</div>
          </div>
        </div>
      </div>

      {/* History Cards */}
      <div className="space-y-4">
        {currentData.map((item) => {
          const template = templateMap[item.templateSlug]
          const isExpanded = expandedItems.has(item.id)
          const isImage = isImageResponse(item.aiResponse)
          const response = formatResponse(item.aiResponse)
          
          return (
            <div key={item.id} className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200" style={{backgroundColor: '#F6F4F0'}}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {template && (
                      <>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <Image 
                            src={template.icon} 
                            alt={template.name} 
                            width={40} 
                            height={40}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-500">{template.desc}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {formatDate(item.createdAt)}
                  </div>
                </div>

                {/* Response Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">AI Response</span>
                      {isImage && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          Images
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {getWordCount(item.aiResponse)} words
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    {isImage ? (
                      <div className="text-center text-gray-600">
                        <span className="font-medium">{response}</span>
                        {isExpanded && item.aiResponse && (
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                            {item.aiResponse.split('\n').filter(line => line.includes('data:image/')).map((imageData, idx) => (
                              <div key={idx} className="aspect-square rounded-lg overflow-hidden border" style={{backgroundColor: '#F6F4F0'}}>
                                <img 
                                  src={imageData.trim()} 
                                  alt={`Generated image ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <p className={`text-gray-700 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                          {response}
                        </p>
                        {!isExpanded && response.length > 150 && (
                          <div className="text-xs text-gray-500 mt-2">
                            Click expand to see full response...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Generated on {formatDate(item.createdAt)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(item.aiResponse || '', item.id)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedItem === item.id ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4" style={{backgroundColor: '#F6F4F0'}}>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} results
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryClient


