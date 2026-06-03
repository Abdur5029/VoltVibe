'use client'

import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroSectionProps {
  saleName?: string
  discount?: number
  description?: string
  endDate?: Date
}

const defaultEndDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 45 * 60 * 1000);

export function HeroSection({
  saleName = 'EID SPECIAL SALE',
  discount = 30,
  description = 'FLAT 30% OFF ON ALL NEXT-GEN HARDWARE.',
  endDate = defaultEndDate,
}: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [endDate.getTime()])

  return (
    <section className="relative overflow-hidden bg-[var(--surface)] py-12 md:py-20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Modern Blur */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-[var(--tertiary)]/15 blur-[100px]" />
        
        {/* Diagonal accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[var(--primary)]/5 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30">
              <Zap className="w-4 h-4 text-[var(--secondary)]" />
              <span className="text-sm font-medium text-[var(--primary)]">LIMITED TIME OFFER</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-balance tracking-tight">
              <span className="text-[var(--on-surface)]">{saleName}</span>
              <br />
              <span className="text-[var(--primary)]">
                Next-Gen Tech.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] font-medium max-w-lg">{description}</p>

            {/* Countdown Timer */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <span className="block text-3xl md:text-4xl font-bold text-[var(--on-surface)]">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] uppercase">Days</span>
                </div>
                <span className="text-2xl text-[var(--muted-foreground)]">:</span>
                <div className="text-center">
                  <span className="block text-3xl md:text-4xl font-bold text-[var(--on-surface)]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] uppercase">Hours</span>
                </div>
                <span className="text-2xl text-[var(--muted-foreground)]">:</span>
                <div className="text-center">
                  <span className="block text-3xl md:text-4xl font-bold text-[var(--on-surface)]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] uppercase">Mins</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="btn-dynamic bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary)]/90 font-semibold px-8 glow-primary"
                asChild
              >
                <Link href="/sale">
                  SHOP THE SALE
                  <Zap className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="btn-dynamic border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 font-semibold px-8"
                asChild
              >
                <Link href="/deals">VIEW ALL DEALS</Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image Placeholder */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Decorative monitor/TV frame */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--surface-container)] to-[var(--surface-container-high)] border border-[var(--outline-variant)] shadow-2xl glow-primary">
                <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-24 h-24 text-[var(--primary)] mx-auto mb-4" />
                    <p className="text-[var(--on-surface)] font-bold text-xl">Next-Gen Tech</p>
                    <p className="text-[var(--muted-foreground)]">Premium Electronics</p>
                  </div>
                </div>
              </div>
              {/* Floating product cards */}
              <div className="absolute -top-4 -right-4 w-32 h-40 rounded-lg bg-[var(--surface-container)] border border-[var(--outline-variant)] shadow-lg p-3">
                <div className="w-full h-20 rounded bg-[var(--surface-container-high)] mb-2" />
                <div className="h-3 w-3/4 rounded bg-[var(--outline-variant)]" />
                <div className="h-3 w-1/2 rounded bg-[var(--primary)] mt-2" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-28 h-36 rounded-lg bg-[var(--surface-container)] border border-[var(--outline-variant)] shadow-lg p-3">
                <div className="w-full h-16 rounded bg-[var(--secondary)]/20 mb-2" />
                <div className="h-3 w-3/4 rounded bg-[var(--outline-variant)]" />
                <div className="h-3 w-1/2 rounded bg-[var(--secondary)] mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
