'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Smartphone, Laptop, Tablet, Headphones, Watch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { categories } from '@/lib/data'

interface CategoriesStripProps {
  onCategorySelect?: (slug: string) => void
  selectedCategory?: string
}

export function CategoriesStrip({ onCategorySelect, selectedCategory }: CategoriesStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="py-8 bg-[var(--surface-container-low)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[var(--surface)]/80 hover:bg-[var(--surface)] text-[var(--on-surface)] shadow-lg"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="sr-only">Scroll left</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[var(--surface)]/80 hover:bg-[var(--surface)] text-[var(--on-surface)] shadow-lg"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5" />
            <span className="sr-only">Scroll right</span>
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-8 py-2 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category.slug;
              return (
              <button
                key={category.id}
                onClick={() => onCategorySelect?.(category.slug)}
                className={`flex flex-col items-center gap-2 min-w-[80px] group transition-all duration-300 snap-center ${isSelected ? 'scale-110' : 'hover:-translate-y-1 opacity-80 hover:opacity-100'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${isSelected ? 'bg-[var(--primary)]/20 border-2 border-[var(--primary)] shadow-[0_0_20px_rgba(0,212,255,0.4)]' : 'bg-[var(--surface-container)] border border-[var(--outline-variant)] group-hover:bg-[var(--primary)]/10 group-hover:border-[var(--primary)] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]'}`}>
                  <span role="img" aria-label={category.name} className="flex items-center justify-center">
                    {category.slug === 'smartphones' ? <Smartphone className="w-8 h-8 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" /> :
                     category.slug === 'laptops' ? <Laptop className="w-8 h-8 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" /> :
                     category.slug === 'tablets' ? <Tablet className="w-8 h-8 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" /> :
                     category.slug === 'accessories' ? <Headphones className="w-8 h-8 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" /> :
                     category.slug === 'watches' ? <Watch className="w-8 h-8 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" /> :
                     category.icon}
                  </span>
                </div>
                <span className="text-xs text-center text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors whitespace-nowrap">
                  {category.name}
                </span>
              </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
