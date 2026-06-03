'use client'

import Link from 'next/link'
import { Heart, ShoppingCart, Star, Flame, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Product, formatPrice } from '@/lib/data'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const { data: session } = useSession()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistId, setWishlistId] = useState<number | null>(null)
  
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/wishlists/?user=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          const items = Array.isArray(data) ? data : (data.results || [])
          const match = items.find((w: any) => w.product === product.id || w.product?.id === product.id)
          if (match) {
            setIsInWishlist(true)
            setWishlistId(match.id)
          }
        })
        .catch(console.error)
    }
  }, [session, product.id])

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!session?.user) return alert('Please login to use wishlist')
    
    // @ts-ignore
    const userId = session.user.id

    if (isInWishlist && wishlistId) {
      // Remove
      try {
        await fetch(`/api/wishlists/${wishlistId}/`, { method: 'DELETE' })
        setIsInWishlist(false)
        setWishlistId(null)
      } catch (err) { console.error(err) }
    } else {
      // Add
      try {
        const res = await fetch(`/api/wishlists/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: userId, product: product.id })
        })
        if (res.ok) {
          const data = await res.json()
          setIsInWishlist(true)
          setWishlistId(data.id)
        }
      } catch (err) { console.error(err) }
    }
  }

  return (
    <Card className="card-hover group relative bg-[var(--surface-container)] border-[var(--outline-variant)] overflow-hidden">
      {/* Discount Badge */}
      {product.discount > 0 && (
        <Badge className="absolute top-3 left-3 z-10 bg-[var(--error)] text-[var(--on-error)] font-bold">
          -{product.discount}%
        </Badge>
      )}

      {/* Status Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        {product.isBestSeller && (
          <Badge className="bg-[var(--secondary)] text-[var(--on-secondary)] text-xs">
            <Star className="w-3 h-3 mr-1" /> Best Seller
          </Badge>
        )}
        {product.isHot && (
          <Badge className="bg-orange-500 text-white text-xs">
            <Flame className="w-3 h-3 mr-1" /> Hot
          </Badge>
        )}
        {product.isNew && (
          <Badge className="bg-[var(--primary)] text-[var(--on-primary)] text-xs">
            <Sparkles className="w-3 h-3 mr-1" /> New
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity ${
          isInWishlist ? 'opacity-100' : ''
        } ${
          isInWishlist
            ? 'text-[var(--error)] hover:text-[var(--error)]'
            : 'text-[var(--muted-foreground)] hover:text-[var(--error)]'
        } hover:bg-[var(--surface-container-high)]`}
        onClick={toggleWishlist}
      >
        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
        <span className="sr-only">Add to wishlist</span>
      </Button>

      <CardContent className="p-4">
        {/* Product Image */}
        <Link href={`/product/${product.id}`} className="block cursor-pointer">
          <div className="relative aspect-square mb-4 bg-[var(--surface-container-high)] rounded-lg overflow-hidden">
            {product.image ? (
              <>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 ${product.hoverImages && product.hoverImages.length > 0 ? 'group-hover:opacity-0' : ''}`} 
                  loading="lazy" 
                  decoding="async" 
                />
                {product.hoverImages && product.hoverImages.length > 0 && (
                  <img 
                    src={product.hoverImages[0]} 
                    alt={`${product.name} alternate view 1`} 
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" 
                    loading="lazy" 
                    decoding="async" 
                  />
                )}
                {product.hoverImages && product.hoverImages.length > 1 && (
                  <img 
                    src={product.hoverImages[1]} 
                    alt={`${product.name} alternate view 2`} 
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out delay-[1500ms]" 
                    loading="lazy" 
                    decoding="async" 
                  />
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl opacity-50">
                  {product.category === 'headphones' && '🎧'}
                  {product.category === 'smart-tvs' && '📺'}
                  {product.category === 'laptops' && '💻'}
                  {product.category === 'cameras' && '📷'}
                  {product.category === 'speakers' && '🔊'}
                  {product.category === 'gaming' && '🎮'}
                  {product.category === 'smart-home' && '🏠'}
                  {product.category === 'networking' && '🌐'}
                  {product.category === 'wireless-earbuds' && '🎧'}
                  {product.category === 'speaker-systems' && '🔊'}
                  {product.category === 'mobile-accessories' && '⌚'}
                  {product.category === 'keyboards' && '⌨️'}
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Brand Badge */}
        <Badge
          variant="outline"
          className="mb-2 text-xs border-[var(--outline)] text-[var(--muted-foreground)]"
        >
          {product.brand}
        </Badge>

        {/* Product Name & Description */}
        <Link href={`/product/${product.id}`} className="cursor-pointer block">
          <h3 className="font-medium text-[var(--on-surface)] line-clamp-2 min-h-[2.5rem] mb-1 group-hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-3 mb-2 whitespace-pre-line">
            {product.description}
          </p>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-[var(--secondary)] fill-current'
                    : 'text-[var(--outline)]'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-[var(--muted-foreground)]">
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-[var(--on-surface)]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-[var(--muted-foreground)] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.inStock ? (
          <p className="text-sm text-[var(--success)] mb-4">In Stock</p>
        ) : (
          <p className="text-sm text-[var(--error)] mb-4">Out of Stock</p>
        )}

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary)]/90 font-semibold"
          onClick={() => onAddToCart?.(product)}
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}

// Product Grid Component
interface ProductGridProps {
  products: Product[]
  title?: string
  subtitle?: string
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  wishlistIds?: string[]
}

export function ProductGrid({
  products,
  title,
  subtitle,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
}: ProductGridProps) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--on-surface)] text-balance">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[var(--muted-foreground)] mt-1">{subtitle}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
