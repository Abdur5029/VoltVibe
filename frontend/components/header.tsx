'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  MessageCircle,
  X,
  ChevronRight,
  Home,
  Laptop,
  Tv,
  Camera,
  Gamepad2,
  Headphones,
  Speaker,
  Smartphone,
  Tablet,
  Wifi,
  Watch,
  Zap,
  Settings,
  Package,
  Bell,
  HelpCircle,
  Globe,
  LogIn,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { announcements, categories } from '@/lib/data'

interface HeaderProps {
  cartItemCount: number
  currentView?: string
  selectedCategory?: string
  onCartClick: () => void
  onChatClick: () => void
  onNavigate: (view: 'home' | 'category' | 'checkout' | 'admin' | 'search' | 'about' | 'contact' | 'account', category?: string, extra?: string) => void
  onCategorySelect: (slug: string) => void
  onSearch: (query: string) => void
  onOpenAuthModal: (tab: 'signin' | 'register') => void
}

export function Header({ 
  cartItemCount, 
  currentView,
  selectedCategory,
  onCartClick, 
  onChatClick, 
  onNavigate, 
  onCategorySelect,
  onSearch,
  onOpenAuthModal
}: HeaderProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Announcement ticker
  const [tickerText, setTickerText] = useState('')

  useEffect(() => {
    setTickerText(announcements.join('  /  '))
  }, [])

  const navItems = [
    { label: 'Smartphones', href: '/category/smartphones' },
    { label: 'Laptops', href: '/category/laptops' },
    { label: 'Tablets', href: '/category/tablets' },
    { label: 'Accessories', href: '/category/accessories' },
    { label: 'Watches', href: '/category/watches' },
  ]

  const sidebarDepartments = [
    { name: 'Smartphones', icon: Smartphone, href: '/category/smartphones' },
    { name: 'Laptops', icon: Laptop, href: '/category/laptops' },
    { name: 'Tablets', icon: Tablet, href: '/category/tablets' },
    { name: 'Accessories', icon: Headphones, href: '/category/accessories' },
    { name: 'Watches', icon: Watch, href: '/category/watches' },
    { name: 'Speakers', icon: Speaker, href: '/category/speakers' },
  ]

  const filterOptions = [
    'Price: Low to High',
    'Price: High to Low',
    'Most Popular',
    'Best Rated',
    'New Arrivals',
    'On Sale / Discounted',
    'In Stock Only',
  ]

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement Ticker */}
      <div className="bg-[var(--secondary)] text-[var(--on-secondary)] py-1 overflow-hidden">
        <div className="flex whitespace-nowrap animate-ticker">
          <span className="px-4 text-sm font-medium">{tickerText}</span>
          <span className="px-4 text-sm font-medium">{tickerText}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[var(--surface)]/80 backdrop-blur-lg border-b border-[var(--outline-variant)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-4">
              {/* Hamburger Menu */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[var(--on-surface)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)]"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-80 p-0 bg-[var(--surface)] border-[var(--outline-variant)]"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <ScrollArea className="h-full">
                    <div className="p-4 border-b border-[var(--outline-variant)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--surface-container-high)] flex items-center justify-center">
                          <User className="w-5 h-5 text-[var(--muted-foreground)]" />
                        </div>
                        <div>
                          <p className="text-[var(--on-surface)] font-medium">
                            {session?.user ? `Hello, ${session.user.name}` : 'Hello, Sign In'}
                          </p>
                          <div className="flex gap-2 mt-1">
                            {!session?.user ? (
                              <>
                                <Button
                                  onClick={() => { onOpenAuthModal('signin'); }}
                                  size="sm"
                                  className="h-7 px-3 bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary)]/90"
                                >
                                  Sign In
                                </Button>
                                <Button
                                  onClick={() => { onOpenAuthModal('register'); }}
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-3 border-[var(--outline)] text-[var(--on-surface)] hover:bg-[var(--surface-container)]"
                                >
                                  Register
                                </Button>
                              </>
                            ) : (
                              <div className="flex flex-col gap-2 w-full mt-2">
                                  <button
                                    onClick={() => {
                                      setSidebarOpen(false)
                                      router.push('/profile')
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors"
                                  >
                                    <User className="w-4 h-4 text-[var(--muted-foreground)]" />
                                    <span className="text-sm">Your Account</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSidebarOpen(false)
                                      router.push('/profile')
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors"
                                  >
                                    <Settings className="w-4 h-4 text-[var(--muted-foreground)]" />
                                    <span className="text-sm">Account Settings</span>
                                  </button>
                                <Button
                                  onClick={() => signOut()}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 mt-2 border-destructive text-destructive hover:bg-destructive/10"
                                >
                                  Sign Out
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shop by Department */}
                    <div className="p-4 border-b border-[var(--outline-variant)]">
                      <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                        Shop by Department
                      </h3>
                      <div className="space-y-1">
                        {sidebarDepartments.map((dept) => (
                          <SheetClose asChild key={dept.name}>
                            <button
                              onClick={() => {
                                if (onCategorySelect && dept.href.startsWith('/category/')) {
                                  onCategorySelect(dept.href.replace('/category/', ''))
                                }
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <dept.icon className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
                                <span className="text-sm">{dept.name}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
                            </button>
                          </SheetClose>
                        ))}
                      </div>
                    </div>

                    {/* Filter By - Context Aware */}
                    {(currentView === 'category' || currentView === 'products') && (
                      <div className="p-4 border-b border-[var(--outline-variant)]">
                        <button
                          onClick={() => setExpandedSection(expandedSection === 'filter' ? null : 'filter')}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                            Filter By
                          </h3>
                          <ChevronRight
                            className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform ${
                              expandedSection === 'filter' ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                        {expandedSection === 'filter' && (
                          <div className="mt-3 space-y-1">
                            {filterOptions.map((option) => (
                              <button
                                key={option}
                                className="block w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Programs & Features */}
                    <div className="p-4 border-b border-[var(--outline-variant)]">
                      <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                        Programs & Features
                      </h3>
                      <div className="space-y-1">
                        <button
                          onClick={() => onNavigate && onNavigate('home')}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors"
                        >
                          <Zap className="w-5 h-5 text-[var(--secondary)]" />
                          <span className="text-sm">Flash Deals</span>
                        </button>
                        <button
                          onClick={() => onNavigate && onNavigate('home')}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors"
                        >
                          <Package className="w-5 h-5 text-[var(--muted-foreground)]" />
                          <span className="text-sm">Bundle Offers</span>
                        </button>
                      </div>
                    </div>

                    {/* Help & Settings */}
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                        Help & Settings
                      </h3>
                      <div className="space-y-1">
                        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors w-full">
                          <Globe className="w-5 h-5 text-[var(--muted-foreground)]" />
                          <span className="text-sm">Language: English</span>
                        </button>
                        <button
                          onClick={() => onNavigate && onNavigate('account', undefined, 'orders')}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors"
                        >
                          <Package className="w-5 h-5 text-[var(--muted-foreground)]" />
                          <span className="text-sm">Track My Order</span>
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors w-full">
                          <Bell className="w-5 h-5 text-[var(--muted-foreground)]" />
                          <span className="text-sm">Notifications</span>
                        </button>
                        <button
                          onClick={() => onNavigate && onNavigate('home')}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors"
                        >
                          <HelpCircle className="w-5 h-5 text-[var(--muted-foreground)]" />
                          <span className="text-sm">Customer Service</span>
                        </button>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <button onClick={() => onNavigate && onNavigate('home')} className="flex items-center gap-2">
                <Zap className="w-8 h-8 text-[var(--primary)]" />
                <span className="text-xl font-bold text-[var(--on-surface)]">VoltVibe</span>
              </button>

              {/* Nav Items - Desktop */}
              <div className="hidden md:flex items-center gap-2 ml-8">
                {[
                  { label: 'Home', view: 'home' },
                  { label: 'About Us', view: 'about' },
                  { label: 'Contact', view: 'contact' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(item.view as any)
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentView === item.view 
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)] shadow-inner' 
                        : 'text-[var(--muted-foreground)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center gap-2">
              {/* Search - Desktop */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                  <Input
                    type="search"
                    placeholder="Search tech..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim() && onSearch) {
                        onSearch(searchQuery.trim());
                      }
                    }}
                    className="w-64 pl-10 bg-[var(--surface-container)] border-[var(--outline-variant)] text-[var(--on-surface)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              {/* Search - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[var(--on-surface)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)]"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Ask Me Button */}
              <Button
                onClick={onChatClick}
                className="hidden sm:flex bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary-dim)] font-semibold px-4"
              >
                Ask Me
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onChatClick}
                className="sm:hidden text-[var(--secondary)] hover:bg-[var(--surface-container)]"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Ask Me</span>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onCartClick}
                className="relative text-[var(--on-surface)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)]"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center bg-[var(--primary)] text-[var(--on-primary)] text-xs font-bold px-1">
                    {cartItemCount}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>

              {/* Account */}
              {(session?.user as any)?.role === 'ADMIN' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate && onNavigate('admin')}
                  className="flex text-[var(--primary)] font-semibold border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                >
                  Admin Panel
                </Button>
              )}
              {session?.user ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate && onNavigate('account')}
                  title="My Account"
                  className="text-[var(--primary)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)]"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">My Account</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { onOpenAuthModal('signin'); }}
                  title="Sign In / Register"
                  className="text-[var(--on-surface)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)]"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <Input
                type="search"
                placeholder="Search tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim() && onSearch) {
                    onSearch(searchQuery.trim());
                    setIsSearchOpen(false);
                  }
                }}
                autoFocus
                className="w-full pl-10 bg-[var(--surface-container)] border-[var(--outline-variant)] text-[var(--on-surface)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-[var(--muted-foreground)]"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
