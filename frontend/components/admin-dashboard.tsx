'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Users,
  BarChart3,
  Settings,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Zap,
  Menu,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { adminStats, formatPrice } from '@/lib/data'

type AdminTab = 'dashboard' | 'products' | 'orders' | 'inventory' | 'users' | 'reports' | 'settings'

const sidebarItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Warehouse },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function AdminDashboard() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if ((session?.user as any)?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)] flex-col gap-4">
        <AlertTriangle className="w-16 h-16 text-[var(--error)]" />
        <h1 className="text-2xl font-bold text-[var(--on-surface)]">Access Denied</h1>
        <p className="text-[var(--muted-foreground)]">You do not have permission to view this page.</p>
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-[var(--outline-variant)]">
        <div className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-[var(--primary)]" />
          <div>
            <span className="text-lg font-bold text-[var(--on-surface)]">VoltVibe</span>
            <Badge className="ml-2 bg-[var(--primary)]/20 text-[var(--primary)] text-xs">Admin</Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-[var(--primary)]" />
          <span className="font-bold text-[var(--on-surface)]">VoltVibe Admin</span>
        </div>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[var(--on-surface)]">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[var(--surface-container-low)] border-[var(--outline-variant)]">
            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--outline-variant)] bg-[var(--surface-container-low)] h-screen sticky top-0">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'products' && <ProductsContent />}
          {activeTab !== 'dashboard' && activeTab !== 'products' && (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <Package className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-2">
                  {sidebarItems.find((i) => i.id === activeTab)?.label}
                </h2>
                <p className="text-[var(--muted-foreground)]">
                  This section is under development
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function DashboardContent() {
  const totalOrders =
    adminStats.pendingOrders +
    adminStats.shippedOrders +
    adminStats.deliveredOrders +
    adminStats.cancelledOrders

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--on-surface)]">Dashboard</h1>
        <p className="text-[var(--muted-foreground)]">Welcome back, Admin!</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[var(--surface-container)] border-[var(--outline-variant)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
              Today&apos;s Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--primary)]">
              {formatPrice(adminStats.todayRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[var(--success)] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface-container)] border-[var(--outline-variant)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--secondary)]">
              {formatPrice(adminStats.weekRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[var(--success)] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+8.2% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface-container)] border-[var(--outline-variant)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--on-surface)]">
              {formatPrice(adminStats.monthRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[var(--success)] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+15.3% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[var(--surface-container)] border-[var(--outline-variant)]">
          <CardHeader>
            <CardTitle className="text-[var(--on-surface)]">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--warning)]" />
                <span className="text-[var(--on-surface)]">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[var(--on-surface)]">{adminStats.pendingOrders}</span>
                <Progress
                  value={(adminStats.pendingOrders / totalOrders) * 100}
                  className="w-24 h-2 bg-[var(--surface-container-high)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[var(--primary)]" />
                <span className="text-[var(--on-surface)]">Shipped</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[var(--on-surface)]">{adminStats.shippedOrders}</span>
                <Progress
                  value={(adminStats.shippedOrders / totalOrders) * 100}
                  className="w-24 h-2 bg-[var(--surface-container-high)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                <span className="text-[var(--on-surface)]">Delivered</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[var(--on-surface)]">{adminStats.deliveredOrders}</span>
                <Progress
                  value={(adminStats.deliveredOrders / totalOrders) * 100}
                  className="w-24 h-2 bg-[var(--surface-container-high)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-[var(--error)]" />
                <span className="text-[var(--on-surface)]">Cancelled</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[var(--on-surface)]">{adminStats.cancelledOrders}</span>
                <Progress
                  value={(adminStats.cancelledOrders / totalOrders) * 100}
                  className="w-24 h-2 bg-[var(--surface-container-high)]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="bg-[var(--surface-container)] border-[var(--outline-variant)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--on-surface)]">
              <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminStats.lowStockItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-container-high)]"
                >
                  <span className="text-[var(--on-surface)] font-medium">{item.name}</span>
                  <Badge
                    variant="outline"
                    className={`${
                      item.stock <= 5
                        ? 'border-[var(--error)] text-[var(--error)]'
                        : 'border-[var(--warning)] text-[var(--warning)]'
                    }`}
                  >
                    {item.stock} units
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="bg-[var(--surface-container)] border-[var(--outline-variant)]">
        <CardHeader>
          <CardTitle className="text-[var(--on-surface)]">Top 5 Best-Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--outline-variant)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
                    Product
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
                    Sales
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminStats.topProducts.map((product, index) => (
                  <tr
                    key={product.name}
                    className="border-b border-[var(--outline-variant)] last:border-0"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-[var(--on-surface)] font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-[var(--on-surface)]">{product.sales}</td>
                    <td className="py-3 px-4 text-right font-semibold text-[var(--primary)]">
                      {formatPrice(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProductsContent() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (Array.isArray(data)) {
        setProducts(data)
      }
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = currentProduct.id ? 'PUT' : 'POST'
    const url = currentProduct.id ? `/api/products/${currentProduct.id}/` : '/api/products/'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct)
      })
      if (res.ok) {
        setIsEditing(false)
        setCurrentProduct(null)
        fetchProducts()
      } else {
        alert('Failed to save product')
      }
    } catch (err) {
      console.error('Error saving product', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}/`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchProducts()
      } else {
        alert('Failed to delete product')
      }
    } catch (err) {
      console.error('Error deleting product', err)
    }
  }

  if (loading) return <div className="text-[var(--on-surface)]">Loading products...</div>

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--on-surface)]">
            {currentProduct.id ? 'Edit Product' : 'Add New Product'}
          </h2>
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
        <Card className="bg-[var(--surface-container)] border-[var(--outline-variant)]">
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--on-surface)]">Name</label>
                  <input required className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--outline-variant)] text-[var(--on-surface)]" value={currentProduct.name || ''} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--on-surface)]">Brand</label>
                  <input required className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--outline-variant)] text-[var(--on-surface)]" value={currentProduct.brand || ''} onChange={(e) => setCurrentProduct({...currentProduct, brand: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--on-surface)]">Category</label>
                  <input required className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--outline-variant)] text-[var(--on-surface)]" value={currentProduct.category || ''} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--on-surface)]">Price</label>
                  <input required type="number" step="0.01" className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--outline-variant)] text-[var(--on-surface)]" value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-[var(--on-surface)]">Image URL</label>
                  <input className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--outline-variant)] text-[var(--on-surface)]" value={currentProduct.image || ''} onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})} />
                </div>
                <div className="space-y-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" id="inStock" checked={currentProduct.inStock ?? true} onChange={(e) => setCurrentProduct({...currentProduct, inStock: e.target.checked})} />
                  <label htmlFor="inStock" className="text-sm font-medium text-[var(--on-surface)]">In Stock</label>
                </div>
              </div>
              <Button type="submit" className="bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary)]/90 mt-4">Save Product</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--on-surface)]">Products Management</h2>
        <Button onClick={() => { setCurrentProduct({ name: '', price: 0, brand: '', category: '', inStock: true }); setIsEditing(true); }} className="bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary)]/90 flex items-center gap-2">
          <Package className="w-4 h-4" /> Add Product
        </Button>
      </div>
      
      <Card className="bg-[var(--surface-container)] border-[var(--outline-variant)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface-container-high)] border-b border-[var(--outline-variant)]">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[var(--outline-variant)] last:border-0 hover:bg-[var(--surface-container-high)]/50 transition-colors">
                    <td className="py-3 px-4 text-[var(--on-surface)] font-medium">
                      <div className="flex items-center gap-3">
                        <img src={product.image || '/placeholder.png'} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                        {product.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">{product.category}</td>
                    <td className="py-3 px-4 text-[var(--on-surface)]">{formatPrice(product.price)}</td>
                    <td className="py-3 px-4">
                      <Badge className={product.inStock ? "bg-[var(--success)]/20 text-[var(--success)]" : "bg-[var(--error)]/20 text-[var(--error)]"}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setCurrentProduct(product); setIsEditing(true); }}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
