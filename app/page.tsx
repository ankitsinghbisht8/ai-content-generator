"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronRight, Sparkles, Zap, Star, CheckCircle } from "lucide-react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slideInLeft">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logoCrescent.svg" alt="Crescent Logo" width={24} height={24} className="text-primary" />
            <span className="text-xl font-bold gradient-text">Crescent</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button size="sm" asChild className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-float delay-300" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-lg animate-bounce-slow delay-500" />
      
      <div className="container relative z-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-6 animate-fadeIn">
          <Star className="h-5 w-5 text-primary animate-pulse-slow" />
          <span className="text-sm font-medium text-primary border border-primary/20 rounded-full px-4 py-1 bg-primary/5">
            Trusted by 10,000+ creators
          </span>
          <Star className="h-5 w-5 text-primary animate-pulse-slow delay-200" />
        </div>
        
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fadeInUp">
          Unlock the Power of{" "}
          <span className="gradient-text animate-pulse-slow">AI-Generated Content</span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fadeInUp delay-200">
          Create high-quality, engaging, and SEO-optimized content in seconds with our advanced AI content generator.
          <span className="block mt-2 text-primary font-medium">Join the content revolution!</span>
        </p>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground animate-fadeIn delay-300">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Free forever plan</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Instant setup</span>
          </div>
        </div>
        
        <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-fadeInUp delay-400">
          <Button size="lg" className="group transition-all duration-300 hover:scale-105 hover:shadow-xl gradient-bg" asChild>
            <Link href="/dashboard">
              Get Started Free 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="transition-all duration-300 hover:scale-105 hover:shadow-lg border-primary/20 hover:border-primary" asChild>
            <Link href="#features">
              Watch Demo 
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 w-full max-w-5xl animate-fadeInUp delay-600">
          <div className="relative overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all duration-500 hover:shadow-3xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />
            <img
              src="/Dashboard.png?height=600&width=1200"
              alt="AI Content Generator Dashboard Preview"
              className="w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 ring-1 ring-primary/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      title: "AI Blog Title Generator",
      description: "Generate catchy, SEO-optimized blog titles that drive traffic and engagement.",
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      color: "from-purple-500/20 to-pink-500/20",
      delay: "delay-100"
    },
    {
      title: "SEO-Optimized Content",
      description: "Create content that ranks higher in search engines with built-in SEO optimization.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m16 8-4 4-4-4" />
          <path d="M12 16V8" />
        </svg>
      ),
      color: "from-blue-500/20 to-cyan-500/20",
      delay: "delay-200"
    },
    {
      title: "Plagiarism-Free Article Rewriter",
      description: "Transform existing content into unique, plagiarism-free articles with a single click.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M12 3v12" />
          <path d="m8 11 4 4 4-4" />
          <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
        </svg>
      ),
      color: "from-green-500/20 to-emerald-500/20",
      delay: "delay-300"
    },
    {
      title: "YouTube Content Tools",
      description: "Generate video scripts, descriptions, and tags optimized for YouTube's algorithm.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="m22 8-6 4 6 4V8Z" />
          <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
        </svg>
      ),
      color: "from-red-500/20 to-orange-500/20",
      delay: "delay-400"
    },
  ]

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-block mb-4">
            <span className="text-primary font-semibold text-sm uppercase tracking-wide border border-primary/20 rounded-full px-4 py-2 bg-primary/5">
              Powerful Features
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything You Need for{" "}
            <span className="gradient-text">Content Creation</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered tools help you create high-quality content faster than ever before
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group flex flex-col items-center rounded-2xl border bg-background p-8 text-center shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-105 hover:-translate-y-2 animate-fadeInUp ${feature.delay}`}
            >
              <div className={`relative mb-6 rounded-2xl bg-gradient-to-br ${feature.color} p-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-primary">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center animate-fadeInUp delay-500">
          <Button size="lg" className="group transition-all duration-300 hover:scale-105 hover:shadow-xl gradient-bg" asChild>
            <Link href="/dashboard">
              Explore All Features 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      title: "Choose Your Content Type",
      description: "Select from blog posts, social media content, product descriptions, and more.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
          <path d="M17 3h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1" />
          <path d="M12 12v9" />
          <path d="M8 21h8" />
          <path d="M4 8h16" />
        </svg>
      ),
      gradient: "from-purple-500/10 to-pink-500/10",
      delay: "delay-100"
    },
    {
      title: "Provide Basic Information",
      description: "Enter your topic, keywords, and any specific requirements for your content.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
        </svg>
      ),
      gradient: "from-blue-500/10 to-cyan-500/10",
      delay: "delay-200"
    },
    {
      title: "Generate & Customize",
      description: "Our AI generates high-quality content that you can edit and customize as needed.",
      icon: <Zap className="h-6 w-6 text-primary" />,
      gradient: "from-green-500/10 to-emerald-500/10",
      delay: "delay-300"
    },
    {
      title: "Publish & Share",
      description: "Export your content or publish it directly to your preferred platform.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M12 2v8" />
          <path d="m4.93 10.93 1.41 1.41" />
          <path d="M2 18h2" />
          <path d="M20 18h2" />
          <path d="m19.07 10.93-1.41 1.41" />
          <path d="M22 22H2" />
          <path d="m8 22 4-10 4 10" />
          <path d="M12 10v4" />
        </svg>
      ),
      gradient: "from-orange-500/10 to-red-500/10",
      delay: "delay-400"
    },
  ]

  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="container relative">
        <div className="text-center mb-20 animate-fadeInUp">
          <div className="inline-block mb-4">
            <span className="text-primary font-semibold text-sm uppercase tracking-wide border border-primary/20 rounded-full px-4 py-2 bg-primary/5">
              Simple Process
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate high-quality content in just a few simple steps
          </p>
        </div>
        
        <div className="relative">
          {/* Animated connecting line */}
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 md:block hidden" />
          
          <div className="space-y-16 relative">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col md:flex-row gap-8 items-center animate-fadeInUp ${step.delay}`}>
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:text-right md:order-first" : "md:order-last"}`}>
                  <div className={`group bg-gradient-to-br ${step.gradient} backdrop-blur-sm p-8 rounded-2xl border border-primary/10 transition-all duration-500 hover:shadow-xl hover:scale-105`}>
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                      <div className="p-2 rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Step number circle */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background text-xl font-bold shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2 transition-all duration-300 hover:scale-110 hover:shadow-xl gradient-bg text-primary-foreground">
                  <span className="animate-pulse-slow">{index + 1}</span>
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                </div>
                <div className="md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 text-center animate-fadeInUp delay-500">
          <Button size="lg" className="group transition-all duration-300 hover:scale-105 hover:shadow-xl gradient-bg" asChild>
            <Link href="/dashboard">
              Try It Now 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "This AI content generator has completely transformed our content marketing strategy. We're producing twice the content in half the time.",
      author: "Sarah Johnson",
      role: "Marketing Director, TechCorp",
      avatar: "/user-icon.svg?height=100&width=100",
      rating: 5,
      delay: "delay-100"
    },
    {
      quote:
        "The SEO optimization features are incredible. Our organic traffic has increased by 45% since we started using this tool.",
      author: "Michael Chen",
      role: "SEO Specialist, GrowthHackers",
      avatar: "/user-icon.svg?height=100&width=100",
      rating: 5,
      delay: "delay-200"
    },
    {
      quote:
        "As a solo entrepreneur, this tool has been a game-changer. It's like having a content team at my fingertips.",
      author: "Emma Rodriguez",
      role: "Founder, StyleBlog",
      avatar: "/user-icon.svg?height=100&width=100",
      rating: 5,
      delay: "delay-300"
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-muted/30 to-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="container relative">
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-block mb-4">
            <span className="text-primary font-semibold text-sm uppercase tracking-wide border border-primary/20 rounded-full px-4 py-2 bg-primary/5">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied content creators and marketers who trust our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`group flex flex-col rounded-2xl border bg-background/50 backdrop-blur-sm p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-105 hover:-translate-y-2 animate-fadeInUp ${testimonial.delay}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-primary text-primary animate-pulse-slow" style={{animationDelay: `${starIndex * 0.1}s`}} />
                  ))}
                </div>
                <svg
                  className="h-8 w-8 text-primary/40 mb-4 transition-transform duration-300 group-hover:scale-110"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M11.28 2.86c-3.9.29-7.43 2.79-9.7 6.57-1.17 2-1.19 4.8-1.33 7.04-.09 2.28.42 4.8 2.28 6.29 2.57 2.04 6.34 1.47 9.4.68 2.96-.77 5.97-2.39 7.35-5.22 1.38-2.83.97-6.33-.52-9.09-1.72-3.15-4.64-5.55-8.16-6.2-.42-.06-.84-.09-1.26-.08h-.06z" />
                </svg>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-4">
                <div className="relative">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40" />
                </div>
                <div>
                  <p className="font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 flex flex-col items-center justify-center gap-6 text-center animate-fadeInUp delay-400">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="h-6 w-6 fill-primary text-primary animate-bounce-slow" 
                style={{animationDelay: `${star * 0.1}s`}}
              />
            ))}
          </div>
          <p className="text-xl font-semibold">
            Rated <span className="gradient-text">4.9/5</span> from over{" "}
            <span className="text-primary font-bold">1,200+ reviews</span>
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Verified reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Trusted platform</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="container py-16 relative">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 animate-fadeInUp">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Image src="/logoCrescent.svg" alt="Crescent Logo" width={24} height={24} className="text-primary" />
              <span className="text-xl font-bold gradient-text">Crescent</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Revolutionizing content creation with cutting-edge AI technology. 
              <span className="block mt-1 text-primary font-medium">Join the future of content!</span>
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="animate-fadeInUp delay-100">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Integrations
                </a>
              </li>
            </ul>
          </div>
          
          <div className="animate-fadeInUp delay-200">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Support
                </a>
              </li>
            </ul>
          </div>
          
          <div className="animate-fadeInUp delay-300">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t pt-8 animate-fadeInUp delay-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} <span className="text-primary font-medium">Crescent</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                99.9% uptime
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                GDPR compliant
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                24/7 support
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

