"use client"
import React, { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'

interface Props {
  loading?: boolean
  onSubmit: (payload: { prompt: string; imagesData: string[]; numImages?: string; size?: string }) => void
}

const MultiImageComposeForm = ({ loading = false, onSubmit }: Props) => {
  const [imagesData, setImagesData] = useState<string[]>([])
  const [prompt, setPrompt] = useState<string>("")
  const [numImages, setNumImages] = useState<string>('1')
  const [size, setSize] = useState<string>('768x768')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return
    // Only allow up to 4 total images; append newly added images
    const remainingSlots = Math.max(0, 4 - imagesData.length)
    if (remainingSlots === 0) return
    const selected = Array.from(files).slice(0, remainingSlots)
    const readAsDataURL = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    const dataUrls = await Promise.all(selected.map(readAsDataURL))
    setImagesData(prev => [...prev, ...dataUrls].slice(0, 4))
  }, [imagesData.length])

  const onDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    await handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const onChooseFiles = () => inputRef.current?.click()

  const removeImage = (idx: number) => {
    setImagesData(prev => prev.filter((_, i) => i !== idx))
  }

  const suggestedTemplate = "Compose a single, cohesive, high-resolution image that blends all uploaded images seamlessly. Preserve the primary subjects from each image, align perspective, match lighting and color palette, and remove seams/edges. Use a cinematic look with soft volumetric lighting, natural shadows, subtle film grain, and realistic textures. Ensure consistent style across the composition and avoid duplicating subjects. Negative: AI artifacts, blur, halos, oversaturation, duplicate subjects, text, watermarks, distorted anatomy.";

  return (
    <div className='flex flex-col gap-6'>
      <div 
        className='border-2 border-dashed rounded-2xl p-6 transition-colors' style={{backgroundColor: '#F6F4F0'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0ECE6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F6F4F0'}
        onDragOver={(e)=>e.preventDefault()}
        onDrop={onDrop}
      >
        <div className='flex flex-col items-center justify-center text-center gap-3'>
          <div className='text-sm text-gray-600'>Drag & drop up to 4 images here</div>
          <div className='text-xs text-gray-500'>(Supported: PNG/JPG/WebP)</div>
          <Button type='button' variant='outline' onClick={onChooseFiles}>Choose Images</Button>
          <input 
            ref={inputRef}
            type='file' 
            accept='image/*'
            multiple 
            className='hidden'
            onChange={(e)=> handleFiles(e.target.files)}
          />
        </div>
        {imagesData.length > 0 && (
          <div className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-3'>
            {imagesData.map((src, idx)=>(
              <div key={idx} className='relative aspect-square overflow-hidden rounded-xl border bg-gray-50 group'>
                {/* Remove button */}
                <button 
                  type='button'
                  aria-label='Remove image'
                  onClick={() => removeImage(idx)}
                  className='absolute top-2 right-2 z-10 inline-flex items-center justify-center w-7 h-7 rounded-full text-gray-700 shadow transition-colors' style={{backgroundColor: '#F6F4F0F0'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F6F4F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F6F4F0F0'}
                >
                  <X className='w-4 h-4' />
                </button>
                <img src={src} alt={`input-${idx+1}`} className='w-full h-full object-cover'/>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <label className='text-sm font-medium'>Prompt to guide composition</label>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={()=> setPrompt(suggestedTemplate)}
          >
            Use suggested template
          </Button>
        </div>
        <Textarea 
          placeholder={suggestedTemplate}
          value={prompt}
          onChange={(e)=>setPrompt(e.target.value)}
          rows={4}
        />
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label className='text-sm font-medium'>Number of Outputs</label>
          <select className='border rounded p-2 w-full' value={numImages} onChange={(e)=>setNumImages(e.target.value)}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
          </select>
        </div>
        <div>
          <label className='text-sm font-medium'>Image Size</label>
          <select className='border rounded p-2 w-full' value={size} onChange={(e)=>setSize(e.target.value)}>
            <option value='512x512'>512 x 512 (Square)</option>
            <option value='768x768'>768 x 768 (Square)</option>
            <option value='1024x1024'>1024 x 1024 (Square)</option>
            <option value='768x1344'>768 x 1344 (Portrait)</option>
            <option value='1344x768'>1344 x 768 (Landscape)</option>
          </select>
        </div>
      </div>

      <div className='flex justify-end'>
        <Button 
          disabled={loading || imagesData.length < 2 || !prompt.trim()}
          onClick={()=> onSubmit({ prompt, imagesData, numImages, size })}
        >
          {loading ? 'Generating...' : 'Generate Combined Image(s)'}
        </Button>
      </div>
    </div>
  )
}

export default MultiImageComposeForm


