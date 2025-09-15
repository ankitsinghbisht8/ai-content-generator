"use client"

import Link from "next/link"
import Image from "next/image"
import { SignedOut } from "@clerk/nextjs"
import { ArrowRight, BarChart3, Bell, Calendar, CheckCircle, FileText, Globe, MessageSquare, Sparkles, Star, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  return (
    <div ref={containerRef} className="flex min-h-screen flex-col bg-gray-50">
      <motion.header 
        className="bg-white border-b fixed top-0 w-full z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-12 h-15 rounded-lg flex items-center justify-center">
              <Image src="/logoCrescent.svg" alt="Crescent Logo" width={26} height={26} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Crescent</span>
          </motion.div>
          <motion.nav 
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Contact
            </Link>
          </motion.nav>
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <SignedOut>
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Log in
              </Link>
            </SignedOut>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </motion.header>
      
      <main className="flex-1 mt-10">
        <HeroSection scrollYProgress={scrollYProgress} />
        <FeaturesSection />
        <IntegrationsSection />
        <TestimonialsSection />
        <StatsSection />
      </main>
      
      <Footer />
    </div>
  )
}

function HeroSection({ scrollYProgress }: { scrollYProgress: any }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <motion.section 
      className="relative bg-white py-20 overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Floating avatars with scroll-based movement */}
      <motion.div 
        className="absolute top-20 left-20 w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [0, -100]),
          rotate: useTransform(scrollYProgress, [0, 1], [0, 360])
        }}
      >
        👤
      </motion.div>
      <motion.div 
        className="absolute top-32 right-24 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [0, -80]),
          x: useTransform(scrollYProgress, [0, 1], [0, 50])
        }}
      >
        👨
      </motion.div>
      <motion.div 
        className="absolute bottom-40 left-32 w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [0, 120]),
          rotate: useTransform(scrollYProgress, [0, 1], [0, -180])
        }}
      >
        👩
      </motion.div>
      <motion.div 
        className="absolute bottom-20 right-40 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [0, 60]),
          x: useTransform(scrollYProgress, [0, 1], [0, -80])
        }}
      >
        👤
      </motion.div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          One tool to manage<br />
          <motion.span 
            className="text-emerald-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            content and your team
          </motion.span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Create high-quality AI content, manage your team's workflow, and streamline your content creation process with our powerful tools designed for modern teams.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold mb-12 transition-all hover:scale-105" asChild>
            <Link href="/dashboard">
              Get Started
            </Link>
          </Button>
        </motion.div>
        
        {/* Trust indicators */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { text: "Join 50k+ OGs" },
            { icon: <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />, text: "Trusted by 52 freelancers" },
            { icon: <CheckCircle className="h-4 w-4 text-green-500" />, text: "No setup" },
            { icon: <CheckCircle className="h-4 w-4 text-green-500" />, text: "Free forever" },
            { icon: <CheckCircle className="h-4 w-4 text-green-500" />, text: "community" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
            >
              {item.icon}
              <span className={!item.icon ? "font-semibold" : ""}>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Animated SVG Path similar to Skiper UI */}
      <AnimatedPath scrollYProgress={scrollYProgress} />
    </motion.section>
  )
}

function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Latest advanced technologies to<br />
            ensure everything you need
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful AI content generation combined with team collaboration tools, analytics dashboard, and smart notifications to streamline your workflow.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Features */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dynamic dashboard</h3>
              <p className="text-gray-600 mb-4">
                Monitor your content performance, team activity, and usage analytics with our comprehensive dashboard that updates in real-time.
              </p>
              <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 transition-all hover:scale-105">
                <Link href="/dashboard">Explore</Link>
              </Button>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Bell, title: "Smart notifications", desc: "Get notified about content status, team activities and important updates.", delay: 0.3 },
                { icon: Users, title: "Team management", desc: "Collaborate with your team, assign tasks and track progress seamlessly.", delay: 0.4 }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  whileHover={{ scale: 1.05 }}
                >
                  <feature.icon className="h-8 w-8 text-emerald-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right side - Dashboard Preview */}
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-xl border"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Analytics</h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Mock dashboard content */}
            <div className="space-y-4">
              <motion.div 
                className="flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <span className="text-sm text-gray-600">Content Generated</span>
                <motion.span 
                  className="font-bold text-2xl text-gray-900"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  1,247
                </motion.span>
              </motion.div>
              
              {/* Chart representation with staggered animation */}
              <div className="h-40 bg-gradient-to-t from-emerald-100 to-emerald-50 rounded-lg p-4 flex items-end justify-between">
                {[16, 24, 32, 20, 28, 36, 24].map((height, index) => (
                  <motion.div 
                    key={index}
                    className={`w-8 rounded-t ${index % 2 === 0 ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                    style={{ height: `${height * 4}px` }}
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${height * 4}px` } : { height: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  />
                ))}
              </div>
              
              <motion.div 
                className="flex justify-between text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <span key={index}>{day}</span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function IntegrationsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  const integrations = [
    { name: "Slack", icon: "💬", bg: "bg-purple-100" },
    { name: "LinkedIn", icon: "💼", bg: "bg-blue-100" },
    { name: "Notion", icon: "📝", bg: "bg-gray-100" },
    { name: "Zapier", icon: "⚡", bg: "bg-orange-100" },
    { name: "Google", icon: "🔍", bg: "bg-red-100" },
    { name: "Figma", icon: "🎨", bg: "bg-pink-100" },
    { name: "GitHub", icon: "🐙", bg: "bg-gray-800 text-white" },
    { name: "Dropbox", icon: "📦", bg: "bg-blue-100" },
    { name: "Trello", icon: "📋", bg: "bg-blue-100" },
    { name: "Discord", icon: "🎮", bg: "bg-indigo-100" },
    { name: "Zoom", icon: "📹", bg: "bg-blue-100" },
    { name: "Stripe", icon: "💳", bg: "bg-purple-100" },
    { name: "Mailchimp", icon: "📧", bg: "bg-yellow-100" },
    { name: "Twitter", icon: "🐦", bg: "bg-blue-100" },
    { name: "Airtable", icon: "📊", bg: "bg-orange-100" },
    { name: "Spotify", icon: "🎵", bg: "bg-green-100" }
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6 text-center">
        <motion.h2 
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          Don't replace. Integrate.
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We connect with thousands of applications through our integrations platform, making it easy to sync your AI content with your existing workflow.
        </motion.p>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 max-w-4xl mx-auto mb-12">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              className={`w-16 h-16 rounded-xl ${integration.bg} flex items-center justify-center text-2xl cursor-pointer shadow-lg`}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {integration.icon}
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all hover:scale-105">
            <Link href="/dashboard">View all integrations</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}


function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-6xl mb-8 text-gray-300"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            "
          </motion.div>
          <motion.blockquote 
            className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            "Crescent is helping our company to decrease operational expenses and turnaround time, while increasing the compliance resources allocation and effectiveness of our content management."
          </motion.blockquote>
          
          <motion.div 
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              👤
            </motion.div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Alex Johnson</div>
              <div className="text-gray-600">Head of Operations, TechCorp</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    { number: "2024", label: "Year founded" },
    { number: "50K+", label: "Active users" },
    { number: "1K+", label: "Companies trust us" }
  ]

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-4xl font-bold text-gray-900 mb-2"
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// AnimatedPath component similar to Skiper UI
function AnimatedPath({ scrollYProgress }: { scrollYProgress: any }) {
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        width="800"
        height="1200"
        viewBox="0 0 800 1200"
        fill="none"
        className="absolute -right-20 top-0 opacity-20"
      >
        <motion.path
          d="M400 0C400 100 500 200 300 300C100 400 600 500 400 600C200 700 700 800 400 900C100 1000 600 1100 400 1200"
          stroke="#10b981"
          strokeWidth="3"
          fill="none"
          style={{
            pathLength,
            strokeDasharray: "10 5",
          }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
    </div>
  )
}

function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <footer ref={ref} className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Discover the full scale of<br />
            <span className="text-emerald-400">Crescent</span> capabilities
          </h2>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button className="bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-105">
              <Link href="/dashboard">Start free trial</Link>
            </Button>
            <Button variant="outline" className="border-gray-600 text-black hover:bg-gray-800 hover:text-white transition-all hover:scale-105">
              Contact us
            </Button>
          </motion.div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-gray-800">
          {[
            {
              content: (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <Image src="/logoCrescent.svg" alt="Crescent Logo" width={16} height={16} className="text-white" />
                    </div>
                    <span className="text-xl font-bold">Crescent</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Revolutionizing content creation with AI-powered tools for modern teams.
                  </p>
                </div>
              )
            },
            {
              title: "Product",
              links: [
                { text: "Features", href: "#features" },
                { text: "Pricing", href: "#" },
                { text: "API", href: "#" },
                { text: "Integrations", href: "#" }
              ]
            },
            {
              title: "Resources",
              links: [
                { text: "Documentation", href: "#" },
                { text: "Help Center", href: "#" },
                { text: "Community", href: "#" },
                { text: "Blog", href: "#" }
              ]
            },
            {
              title: "Company",
              links: [
                { text: "About", href: "#" },
                { text: "Careers", href: "#" },
                { text: "Privacy", href: "#" },
                { text: "Terms", href: "#" }
              ]
            }
          ].map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              {section.content ? (
                section.content
              ) : (
                <>
                  <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {section.links?.map((link, linkIndex) => (
                      <motion.li 
                        key={linkIndex}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <a href={link.href} className="hover:text-white transition-colors">
                          {link.text}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          © {new Date().getFullYear()} Crescent. All rights reserved.
        </motion.div>
      </div>
    </footer>
  )
}

