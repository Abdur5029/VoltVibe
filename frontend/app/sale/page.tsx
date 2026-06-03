
import { ProductCard } from '@/components/product-card'
import { Percent, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Basic layout for the Sale page
export default async function SalePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
  
  // Fetch products from the backend
  let products = []
  try {
    const res = await fetch(`${API_URL}/products/`, { cache: 'no-store' })
    if (res.ok) products = await res.json()
  } catch (err) {
    console.error("Failed to fetch products for sale:", err)
  }

  // Filter sale (discount > 0)
  const sale = products.filter((p: any) => p.discount > 0)

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <Percent className="w-8 h-8 text-[var(--destructive)]" />
          <h1 className="text-4xl font-bold text-[var(--on-surface)]">Clearance Sale</h1>
        </div>
        
        {sale.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sale.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p className="text-[var(--muted-foreground)]">No sale items right now. Check back later!</p>
        )}
      </main>
    </div>
  )
}
