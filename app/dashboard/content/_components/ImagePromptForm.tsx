"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Shuffle, Eye, Check } from 'lucide-react'

interface Props {
  onRefinePrompt: (userInputs: any) => Promise<string>
  onGeneratePrompt: (prompt: string) => void
  refining?: boolean
}

const styles = ["cinematic", "documentary", "fine art", "cyberpunk", "anime", "watercolor"]
const moods = ["serene", "vibrant", "moody", "mysterious", "nostalgic", "dramatic"]
const cameraTypes = ["Full-frame DSLR", "Mirrorless", "Vintage Film Camera"]
const lenses = ["50mm f/1.8", "85mm portrait lens", "24mm wide-angle", "100mm macro"]
const apertures = ["f/1.2", "f/2.8", "f/4", "f/8"]
const angles = ["eye-level", "aerial shot", "over-the-shoulder", "close-up", "wide shot"]
const compositions = ["rule of thirds", "centered", "leading lines", "golden ratio"]
const lightingStyles = ["soft cinematic", "golden hour", "Rembrandt lighting", "neon glow", "harsh shadows"]
const atmospheres = ["fog", "mist", "haze", "rain reflections", "snowy sparkle", "heat haze", "lens flare"]
const colorGradings = ["teal & orange blockbuster", "Kodak Portra tones", "pastel palette", "desaturated cinematic"]
const filmTextures = ["35mm film grain", "Polaroid instant", "glossy HDR digital", "vintage sepia"]
const artMovements = ["Renaissance realism", "surrealism", "impressionism", "cyberpunk futurism"]
const commonNegatives = ["AI artifacts", "distorted anatomy", "plastic skin", "oversaturation", "cartoon look", "text artifacts", "watermark", "blurry", "low resolution"]

const presets = {
  "Cinematic Portrait": {
    style: "cinematic",
    mood: "dramatic",
    lens: "85mm portrait lens",
    aperture: "f/1.2",
    angle: "eye-level",
    composition: "rule of thirds",
    lightingStyle: "Rembrandt lighting",
    colorGrading: "Kodak Portra tones",
    filmTexture: "35mm film grain",
    detail: 75
  },
  "Documentary Street Photo": {
    style: "documentary",
    mood: "nostalgic",
    lens: "24mm wide-angle",
    aperture: "f/4",
    angle: "wide shot",
    composition: "leading lines",
    lightingStyle: "golden hour",
    colorGrading: "desaturated cinematic",
    filmTexture: "vintage sepia",
    detail: 50
  },
  "Cyberpunk Night City": {
    style: "cyberpunk",
    mood: "mysterious",
    lens: "50mm f/1.8",
    aperture: "f/2.8",
    angle: "over-the-shoulder",
    composition: "centered",
    lightingStyle: "neon glow",
    colorGrading: "teal & orange blockbuster",
    filmTexture: "glossy HDR digital",
    detail: 85
  },
  "Fine Art Still Life": {
    style: "fine art",
    mood: "serene",
    lens: "100mm macro",
    aperture: "f/8",
    angle: "close-up",
    composition: "golden ratio",
    lightingStyle: "soft cinematic",
    colorGrading: "pastel palette",
    filmTexture: "Polaroid instant",
    detail: 65
  }
} as const

type PresetKey = keyof typeof presets

const ImagePromptForm = ({ onRefinePrompt, onGeneratePrompt, refining = false }: Props) => {
  // Core with placeholders
  const [idea, setIdea] = useState("A cyberpunk samurai in neon-lit Tokyo streets")
  const [style, setStyle] = useState("cinematic")
  const [mood, setMood] = useState("dramatic")
  const [artist, setArtist] = useState("")

  // Photography with defaults
  const [lens, setLens] = useState("85mm portrait lens")
  const [aperture, setAperture] = useState("f/1.2")
  const [lightingStyle, setLightingStyle] = useState("neon glow")

  // Artistic with defaults
  const [colorGrading, setColorGrading] = useState("teal & orange blockbuster")
  const [filmTexture, setFilmTexture] = useState("35mm film grain")

  // Negatives with smart defaults
  const [negSelected, setNegSelected] = useState<string[]>(["AI artifacts", "plastic skin", "text artifacts", "watermark"])
  const [negCustom, setNegCustom] = useState("")

  // Output controls
  const [mode, setMode] = useState<'simple'|'detailed'|'expert'>("detailed")
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Suggestions: simple heuristic
  useEffect(() => {
    const s = idea.toLowerCase()
    if (s.includes("portrait") && !lens) setLens("85mm portrait lens")
    if (s.includes("landscape") && !aperture) setAperture("f/8")
    if (s.includes("street") && !style) setStyle("documentary")
    if (s.includes("night") && !lightingStyle) setLightingStyle("neon glow")
  }, [idea])

  const toggleNegative = (val: string) => {
    setNegSelected((prev) => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
  }

  const applyPreset = (key: PresetKey) => {
    const p = presets[key]
    setStyle(p.style)
    setMood(p.mood)
    setLens(p.lens)
    setAperture(p.aperture)
    setLightingStyle(p.lightingStyle)
    setColorGrading(p.colorGrading)
    setFilmTexture(p.filmTexture)
  }

  const randomize = () => {
    const rand = (arr: string[]) => arr[Math.floor(Math.random()*arr.length)]
    setStyle(rand(styles))
    setMood(rand(moods))
    setLens(rand(lenses))
    setAperture(rand(apertures))
    setLightingStyle(rand(lightingStyles))
    setColorGrading(rand(colorGradings))
    setFilmTexture(rand(filmTextures))
  }

  const buildPrompt = useMemo(() => {
    const blocks: string[] = []
    // Core subject line
    const core = [idea, style && `in a ${style} style`, mood && `mood: ${mood}`].filter(Boolean).join(', ')
    if (core) blocks.push(core)

    if (mode !== 'simple') {
      const camera = [lens, aperture && `${aperture} aperture`].filter(Boolean).join(', ')
      if (camera) blocks.push(camera)

      if (lightingStyle) blocks.push(lightingStyle)
      if (colorGrading) blocks.push(colorGrading)
      if (filmTexture) blocks.push(filmTexture)
    }

    if (artist) blocks.push(`Inspired by ${artist}`)

    const negatives = [...negSelected, ...(negCustom ? negCustom.split(',').map(s=>s.trim()).filter(Boolean) : [])]
    if (negatives.length) blocks.push(`Negative: ${negatives.join(', ')}`)

    // Expert mode adds technical tags
    if (mode === 'expert') {
      blocks.push('shot on full-frame sensor, high dynamic range, 8k, ultra sharp')
    }

    return blocks.filter(Boolean).join('. ')
  }, [idea, style, mood, artist, lens, aperture, lightingStyle, colorGrading, filmTexture, negSelected, negCustom, mode])

  const handleGeneratePrompt = () => {
    onGeneratePrompt(buildPrompt)
  }

  const handleRefinePrompt = async () => {
    const userInputs = {
      idea, style, mood, artist, lens, aperture, lightingStyle, 
      colorGrading, filmTexture, negSelected, negCustom, mode
    }
    const refined = await onRefinePrompt(userInputs)
    // The refined prompt will be handled by the parent component
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-primary'>Image Prompt Generator</h2>
        <div className='flex gap-2'>
          <Button type='button' variant='outline' size='sm' onClick={randomize}>
            <Shuffle className='w-4 h-4 mr-1'/> Randomize
          </Button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className='flex flex-wrap gap-2'>
        <Button type='button' variant='outline' size='sm' onClick={() => applyPreset('Cinematic Portrait')}>Portrait</Button>
        <Button type='button' variant='outline' size='sm' onClick={() => applyPreset('Documentary Street Photo')}>Documentary</Button>
        <Button type='button' variant='outline' size='sm' onClick={() => applyPreset('Cyberpunk Night City')}>Cyberpunk</Button>
        <Button type='button' variant='outline' size='sm' onClick={() => applyPreset('Fine Art Still Life')}>Fine Art</Button>
      </div>

      {/* Core Fields */}
      <div className='space-y-4'>
        <div>
          <label className='text-sm font-medium mb-2 block'>What do you want to see?</label>
          <Textarea 
            value={idea} 
            onChange={e=>setIdea(e.target.value)} 
            placeholder='A cyberpunk samurai in neon-lit Tokyo streets'
            rows={2}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='text-sm font-medium mb-2 block'>Style</label>
            <select className='border rounded p-2 w-full' value={style} onChange={e=>setStyle(e.target.value)}>
              {styles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>Mood</label>
            <select className='border rounded p-2 w-full' value={mood} onChange={e=>setMood(e.target.value)}>
              {moods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>Artist (optional)</label>
            <Input value={artist} onChange={e=>setArtist(e.target.value)} placeholder='Annie Leibovitz, Roger Deakins' />
          </div>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <div>
        <Button 
          type='button' 
          variant='ghost' 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className='text-sm'
        >
          {showAdvanced ? '▼' : '▶'} Advanced Settings
        </Button>
      </div>

      {showAdvanced && (
        <div className='space-y-4 border-l-2 border-muted pl-4'>
          {/* Camera */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>Lens</label>
              <select className='border rounded p-2 w-full' value={lens} onChange={e=>setLens(e.target.value)}>
                {lenses.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>Aperture</label>
              <select className='border rounded p-2 w-full' value={aperture} onChange={e=>setAperture(e.target.value)}>
                {apertures.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Style */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>Lighting</label>
              <select className='border rounded p-2 w-full' value={lightingStyle} onChange={e=>setLightingStyle(e.target.value)}>
                {lightingStyles.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>Color Grading</label>
              <select className='border rounded p-2 w-full' value={colorGrading} onChange={e=>setColorGrading(e.target.value)}>
                {colorGradings.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>Film Texture</label>
              <select className='border rounded p-2 w-full' value={filmTexture} onChange={e=>setFilmTexture(e.target.value)}>
                {filmTextures.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Negatives */}
          <div>
            <label className='text-sm font-medium mb-2 block'>Avoid (optional)</label>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-2 p-3 border rounded'>
              {commonNegatives.slice(0,4).map(v => (
                <label key={v} className='flex items-center gap-2 text-xs'>
                  <input type='checkbox' checked={negSelected.includes(v)} onChange={()=>toggleNegative(v)} />
                  {v}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className='flex flex-wrap justify-end gap-3 pt-4 border-t'>
        <Button 
          type='button' 
          variant='outline'
          disabled={!idea.trim()} 
          onClick={handleGeneratePrompt}
        >
          Generate the Prompt
        </Button>
        <Button 
          type='button' 
          disabled={refining || !idea.trim()}
          onClick={handleRefinePrompt}
        >
          {refining ? 'Refining...' : 'Refine the Prompt using AI'}
        </Button>
      </div>
    </div>
  )
}

export default ImagePromptForm


