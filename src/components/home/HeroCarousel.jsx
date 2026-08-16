
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import Button from '../ui/Button'


/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Auto-rotating hero banner — the first thing visitors see. Three
 * promotional slides cycle automatically every 5 seconds, with manual
 * arrow/dot navigation available too.
 *
 * Slide content is hardcoded here rather than fetched from the backend —
 * promotional banners are typically managed by marketing/design teams
 * directly in code or a CMS, not treated as regular "product" data.
 * If the wholesaler wants admin-editable banners later, that would be
 * a small new backend module — out of scope for this build.
 */


const slides = [
  {
    title: 'Power Up Your Setup',
    subtitle: 'Premium laptops starting at ₹39,999',
    cta: 'Shop Laptops',
    link: '/products?categoryId=6a5bf5b454d15f717f482754',
    gradient: 'from-slate-900 via-slate-800 to-blue-900',
  },
  {
    title: 'Fresh Tech Arrivals',
    subtitle: 'The latest tech from the world\'s top brands',
    cta: 'Explore New Arrivals',
    link: '/products?sortBy=createdAt&sortDir=desc',
    gradient: 'from-zinc-900 via-slate-900 to-cyan-800',
  },
  {
    title: 'Level Up Your Game',
    subtitle: 'High-performance gaming gear built for speed',
    cta: 'Shop Gaming',
    link: '/products?type=Gaming',
    gradient: 'from-black via-gray-900 to-emerald-800',
  },
]


export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const prev = () => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length)
  }

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])


  const slide = slides[current]

  
  return (
    <section className={clsx(
      'relative overflow-hidden bg-gradient-to-br transition-colors duration-700',
      slide.gradient
    )}>

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />

      <div className="container-page relative z-10 py-20 md:py-28">
        <div className="max-w-xl">
          <p className="text-white/70 text-sm font-medium mb-3 tracking-wide">
            ECOM STORE PRESENTS
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
            {slide.title}
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-8">
            {slide.subtitle}
          </p>
          <Link to={slide.link}>
            <Button variant="secondary" size="lg" className="bg-white">
              {slide.cta}
            </Button>
          </Link>
        </div>
      </div>


      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors"
      >
        <ChevronRight size={20} />
      </button>
      

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={clsx(
              'h-1.5 rounded-full transition-all duration-300',
              i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40'
            )}
          />
        ))}
      </div>
    </section>
  )
}
