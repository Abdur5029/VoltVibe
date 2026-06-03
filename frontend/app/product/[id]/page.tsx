'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/header'
import { Product } from '@/lib/data'
import { Star, ShoppingCart, Heart, Flame, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

interface Review {
  id: string
  user: {
    id: string
    username: string
    first_name: string
    last_name: string
  }
  rating: number
  comment: string
  created_at: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  // Review Form State
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (params.id) {
      // Fetch Product
      fetch(`/api/products/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))

      // Fetch Reviews
      fetch(`/api/reviews/?product=${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setReviews(data)
          } else if (data.results) {
            setReviews(data.results)
          }
        })
        .catch(console.error)
    }
  }, [params.id])

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) return

    setSubmittingReview(true)
    try {
      // @ts-ignore - NextAuth user ID custom property
      const userId = session.user.id

      const res = await fetch(`/api/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: params.id,
          user: userId,
          rating,
          comment
        })
      })

      if (res.ok) {
        const newReview = await res.json()
        setReviews([newReview, ...reviews])
        setComment('')
        setRating(5)
      }
    } catch (err) {
      console.error("Failed to submit review", err)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4 text-[var(--on-background)]">Product not found</h1>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  // Calculate Average Rating dynamically
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : product.rating

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--on-background)] pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-[var(--surface-container)] rounded-2xl overflow-hidden border border-[var(--outline-variant)]">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl opacity-10">📦</div>
              )}
            </div>
            {product.hoverImages && product.hoverImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.hoverImages.map((img, i) => (
                  <div key={i} className="aspect-square bg-[var(--surface-container)] rounded-lg overflow-hidden border border-[var(--outline-variant)]">
                    <img src={img} alt={`${product.name} view ${i+2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex gap-2 mb-4">
              <Badge className="bg-[var(--primary)] text-[var(--on-primary)]">{product.brand}</Badge>
              {product.isBestSeller && <Badge className="bg-yellow-500">Best Seller</Badge>}
              {product.isHot && <Badge className="bg-orange-500">Hot</Badge>}
            </div>
            
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-500">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-[var(--muted-foreground)]">
                {avgRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            <div className="text-3xl font-bold text-[var(--primary)] mb-6">
              ${(product.price * (1 - product.discount / 100)).toFixed(2)}
              {product.discount > 0 && (
                <span className="text-lg text-[var(--muted-foreground)] line-through ml-3">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="text-[var(--on-surface-variant)] mb-8 whitespace-pre-line text-lg leading-relaxed">
              {product.description}
            </p>

            <div className="flex gap-4 mb-8">
              <Button size="lg" className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-lg h-14">
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="w-14 h-14 p-0">
                <Heart className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-[var(--outline-variant)] pt-12">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Add Review Form */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--surface-container)] p-6 rounded-2xl border border-[var(--outline-variant)]">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                {session ? (
                  <form onSubmit={submitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(star => (
                          <button 
                            key={star} 
                            type="button" 
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star className={`w-8 h-8 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Review</label>
                      <Textarea 
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or dislike?"
                        className="bg-[var(--surface)]"
                        rows={4}
                      />
                    </div>
                    <Button type="submit" disabled={submittingReview} className="w-full">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-[var(--muted-foreground)] mb-4">You must be logged in to write a review.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Review List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <p className="text-[var(--muted-foreground)]">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="bg-[var(--surface-container)] p-6 rounded-2xl border border-[var(--outline-variant)]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {review.user?.first_name 
                            ? `${review.user.first_name} ${review.user.last_name || ''}` 
                            : review.user?.username || 'Anonymous User'}
                        </h4>
                        <div className="flex items-center text-yellow-500 mt-1">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-[var(--muted-foreground)]">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[var(--on-surface-variant)]">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
