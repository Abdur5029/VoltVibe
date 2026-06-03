'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Package, MapPin, User, ShieldCheck } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      // Fetch user's orders
const API_URL = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-railway-url') ? process.env.NEXT_PUBLIC_API_URL : 'https://voltvibe-production.up.railway.app/api');
      fetch(`${API_URL}/orders/?user=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data || [])
          setLoading(false)
        })
        .catch(err => {
          console.error("Failed to load orders", err)
          setLoading(false)
        })
    }
  }, [status, session, router])

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[var(--on-background)]">Account Dashboard</h1>
        
        {/* Profile Card */}
        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--outline-variant)] flex items-start gap-6">
          <div className="w-16 h-16 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-full flex items-center justify-center text-2xl font-bold">
            {session?.user?.name?.charAt(0) || <User />}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-[var(--on-surface)]">{session?.user?.name}</h2>
            <p className="text-[var(--muted-foreground)]">{session?.user?.email}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-green-500 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Verified Account
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--on-background)] flex items-center gap-2">
            <Package className="w-6 h-6" /> Order History
          </h2>
          
          {orders.length === 0 ? (
            <div className="bg-[var(--surface-container)] p-8 rounded-xl text-center border border-[var(--outline-variant)]">
              <p className="text-[var(--muted-foreground)] mb-4">You haven't placed any orders yet.</p>
              <button 
                onClick={() => router.push('/category/all')}
                className="px-6 py-2 bg-[var(--primary)] text-[var(--on-primary)] rounded-full font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order.id} className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--outline-variant)]">
                  <div className="flex justify-between items-center border-b border-[var(--outline-variant)] pb-4 mb-4">
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm font-medium text-[var(--on-surface)]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[var(--primary)]">${order.totalAmount}</p>
                      <span className="inline-block px-3 py-1 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] text-xs font-bold rounded-full mt-1 uppercase">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {order.orderItems?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-[var(--on-surface)]">x{item.quantity} Product ID: {item.product.slice(0, 8)}</span>
                        <span className="text-[var(--muted-foreground)]">${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
