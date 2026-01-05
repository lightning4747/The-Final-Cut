"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Film, ArrowRight, Database, Shield, Server, Sparkles, Zap, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

const techStack = [
  {
    name: "TMDB",
    description:
      "The Movie Database API provides comprehensive movie data, images, and metadata for millions of films worldwide.",
    logo: "/tmdb-movie-database-blue-logo.jpg",
    category: "Data Source",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    name: "Appwrite",
    description:
      "Open-source backend server handling our trending movies, search analytics, and real-time data synchronization.",
    logo: "/appwrite-pink-logo.jpg",
    category: "Backend",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    name: "Supabase",
    description:
      "Secure authentication and user account management with row-level security and real-time subscriptions.",
    logo: "/supabase-green-logo.jpg",
    category: "Auth & Database",
    color: "from-emerald-500/20 to-green-500/20",
  },
  {
    name: "Next.js",
    description: "React framework powering our fast, SEO-friendly frontend with server-side rendering and API routes.",
    logo: "/next-js-black-white-logo.jpg",
    category: "Framework",
    color: "from-gray-500/20 to-slate-500/20",
  },
]

const features = [
  {
    icon: Database,
    title: "Rich Movie Data",
    description: "Access millions of movies with detailed information, ratings, and media.",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "Industry-standard auth with Supabase for safe user account management.",
  },
  {
    icon: Server,
    title: "Real-time Backend",
    description: "Appwrite powers trending analytics and search history tracking.",
  },
  {
    icon: Sparkles,
    title: "Modern Experience",
    description: "Built with Next.js for blazing fast performance and smooth interactions.",
  },
]

const stats = [
  { label: "Movies Available", value: "1M+", icon: Film },
  { label: "API Uptime", value: "99.9%", icon: Zap },
  { label: "Global CDN", value: "200+", icon: Globe },
  { label: "Secure Auth", value: "100%", icon: Lock },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const techRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    tech: false,
    features: false,
    stats: false,
    cta: false,
  })

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    const createObserver = (ref: React.RefObject<HTMLElement | null>, key: keyof typeof visibleSections) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [key]: true }))
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
      )
      if (ref.current) observer.observe(ref.current)
      observers.push(observer)
    }

    createObserver(heroRef, "hero")
    createObserver(techRef, "tech")
    createObserver(featuresRef, "features")
    createObserver(statsRef, "stats")

    // Trigger hero immediately
    setVisibleSections((prev) => ({ ...prev, hero: true }))

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Background with parallax */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs with scroll parallax */}
        <div
          className="absolute w-[600px] h-[600px] bg-violet-500/15 rounded-full blur-[100px] transition-transform duration-300 ease-out"
          style={{
            top: -200 + scrollY * 0.15,
            right: -200 + scrollY * 0.1,
            transform: `translate(${(mousePosition.x - (mounted ? window.innerWidth : 0) / 2) * 0.02}px, ${(mousePosition.y - (mounted ? window.innerHeight : 0) / 2) * 0.02}px)`,
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] bg-fuchsia-500/15 rounded-full blur-[100px] transition-transform duration-300 ease-out"
          style={{
            top: "40%",
            left: -300 + scrollY * -0.1,
            transform: `translate(${(mousePosition.x - (mounted ? window.innerWidth : 0) / 2) * -0.015}px, ${(mousePosition.y - (mounted ? window.innerHeight : 0) / 2) * -0.015}px)`,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[80px] transition-transform duration-300 ease-out"
          style={{
            bottom: -100 + scrollY * -0.08,
            right: "20%",
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <Film className="relative w-7 h-7 text-primary" />
              </div>
              <span className="font-bold text-lg text-foreground">The Final Cut</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16">
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-1000 delay-200 ${visibleSections.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
        >
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm mb-8 transition-all duration-700 delay-300 ${visibleSections.hero ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">Your Personal Movie Discovery Platform</span>
          </div>

          {/* Main Heading */}
          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight text-balance transition-all duration-1000 delay-400 ${visibleSections.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            Discover Movies with{" "}
            <span className="relative">
              <span className="text-gradient">The Final Cut</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-violet-500/30"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q50,0 100,5 T200,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="animate-pulse"
                />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed transition-all duration-1000 delay-500 ${visibleSections.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            Search through millions of movies, track trending films, and build your personal watchlist with our powerful
            movie discovery platform.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-600 ${visibleSections.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <Link href="/sign-up">
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white px-8 py-6 text-lg group overflow-hidden shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Start Exploring
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-border/50 hover:bg-secondary/80 bg-secondary/30 backdrop-blur-sm hover:border-violet-500/50 transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${visibleSections.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-1">
              <div className="w-1.5 h-3 bg-violet-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="relative py-16 px-4 border-y border-border/30 bg-secondary/20 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center transition-all duration-700 ${visibleSections.stats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section ref={techRef} className="relative py-24 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${visibleSections.tech ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Technology Stack</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Powered by <span className="text-gradient">Modern Tech</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with industry-leading technologies for performance, reliability, and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {techStack.map((tech, index) => (
              <div
                key={tech.name}
                className={`group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(139,92,246,0.15)] overflow-hidden ${visibleSections.tech ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Hover gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Animated border glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-[-1px] bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-violet-500/50 rounded-2xl blur-sm" />
                </div>

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-20 h-20 bg-secondary/80 rounded-2xl flex items-center justify-center p-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Image
                        src={tech.logo || "/placeholder.svg"}
                        alt={tech.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="px-3 py-1.5 bg-secondary/80 text-muted-foreground text-xs font-medium rounded-full border border-border/50">
                      {tech.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {tech.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-24 sm:py-32 px-4 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${visibleSections.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Everything You <span className="text-gradient">Need</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to enhance your movie discovery experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:-translate-y-2 ${visibleSections.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl mb-6 group-hover:scale-110 group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 border border-border/50 rounded-3xl p-12 sm:p-16 overflow-hidden backdrop-blur-sm">
            {/* Animated background elements */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="relative">
              <Film className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Ready to Discover?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of movie enthusiasts and start building your perfect watchlist today.
              </p>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white px-10 py-6 text-lg group shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4 bg-secondary/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">The Final Cut</span>
          </div>
          <p className="text-sm text-muted-foreground">Built with Next.js, Supabase, Appwrite & TMDB</p>
        </div>
      </footer>
    </main>
  )
}
