"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { CategoriesStrip } from "@/components/categories-strip";
import { ProductCard } from "@/components/product-card";
import { CartPanel } from "@/components/cart-panel";
import { AIChatOverlay } from "@/components/ai-chat-overlay";
import { CategoryPage } from "@/components/category-page";
import { CheckoutPage } from "@/components/checkout-page";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AuthModal } from "@/components/auth-modal";
import { AboutPage } from "@/components/about-page";
import { ContactPage } from "@/components/contact-page";
import { Product, CartItem } from "@/lib/data";
import { ArrowRight, Zap, TrendingUp, Clock, Package } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { AccountPage } from "@/components/account-page";

type View = "home" | "category" | "checkout" | "admin" | "search" | "about" | "contact" | "products" | "account";

export default function VoltVibePage() {
  const { data: session, status } = useSession();
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"deals" | "new" | "bestsellers">("deals");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'register'>('signin');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API did not return an array of products:", data);
        }
      })
      .catch(err => console.error("Failed to load products", err));
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentView("category");
  };

  const handleCheckout = () => {
    if (status !== "authenticated" || !session?.user) {
      setIsCartOpen(false);
      setAuthModalTab('signin');
      setAuthModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    setCurrentView("checkout");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView("search");
  };

  const handlePlaceOrder = async (formData: any, total: number) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: (session?.user as any)?.id,
          totalAmount: total,
          items: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to place order');
      }

      setCartItems([]);
      setCurrentView("home");
      alert("Order placed successfully! Thank you for shopping with VoltVibe.");
    } catch (error: any) {
      console.error(error);
      if (error.message && (error.message.includes("object does not exist") || error.message.includes("Invalid pk"))) {
        alert("Your session has expired or is invalid (e.g. database was reset). You will be signed out. Please sign in again.");
        window.location.href = '/api/auth/signout';
      } else {
        alert(error.message || "There was an error placing your order. Please try again.");
      }
    }
  };

  const handleNavigate = (view: View, category?: string) => {
    setCurrentView(view);
    if (category) setSelectedCategory(category);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Products for tabs
  const tabProducts = {
    deals: products.filter(p => p.discount >= 25),
    new: products.filter((p) => p.isNew).slice(0, 8),
    bestsellers: products.filter((p) => p.rating >= 4.5).slice(0, 8),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        currentView={currentView}
        selectedCategory={selectedCategory}
        onCartClick={() => setIsCartOpen(true)}
        onChatClick={() => setIsChatOpen(true)}
        onNavigate={handleNavigate}
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
        onOpenAuthModal={(tab) => {
          setAuthModalTab(tab);
          setAuthModalOpen(true);
        }}
      />

      {/* Dynamic Breadcrumbs */}
      <div className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <button onClick={() => handleNavigate('home')} className="hover:text-[var(--primary)] transition-colors font-medium">Home</button>
          
          {currentView !== 'home' && (
            <>
              <span className="text-[var(--outline)]">/</span>
              <span className="text-[var(--on-surface)] font-medium capitalize cursor-default">
                {currentView === 'category' && selectedCategory 
                  ? selectedCategory.replace('-', ' ') 
                  : currentView}
              </span>
            </>
          )}
        </div>
      </div>

      {currentView === "home" && (
        <main>
          <HeroSection />
          <CategoriesStrip onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />

          {/* Product Tabs Section */}
          <section className="container mx-auto px-4 py-12">
            {/* Tab Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                {[
                  { id: "deals", label: "Flash Deals", icon: Zap },
                  { id: "new", label: "New Arrivals", icon: Clock },
                  { id: "bestsellers", label: "Bestsellers", icon: TrendingUp },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-[var(--primary)]/20 text-[var(--primary)] shadow-[0_0_20px_rgba(0,212,255,0.3)] ring-2 ring-[var(--primary)] scale-105"
                          : "bg-[var(--surface-container-highest)] text-[var(--on-surface-variant)] opacity-70 hover:opacity-100 hover:-translate-y-1 hover:bg-[var(--outline)] hover:text-[var(--on-surface)]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <button className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tabProducts[activeTab].map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>

          {/* Featured Collection Banner */}
          <section className="container mx-auto px-4 py-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 p-8 md:p-12">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
                  Limited Collection
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Premium Audio Experience
                </h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  Discover our curated selection of high-fidelity audio equipment.
                  Engineered for audiophiles who demand nothing but the best.
                </p>
                <button
                  onClick={() => handleCategorySelect("accessories")}
                  className="btn-dynamic inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--on-primary)] rounded-xl font-semibold shadow-lg shadow-primary/25"
                >
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
            </div>
          </section>

          {/* Features Strip */}
          <section className="border-y border-border/50 bg-card/30">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Package, title: "Free Shipping", desc: "On orders over $50" },
                  { icon: Clock, title: "Fast Delivery", desc: "2-3 business days" },
                  { icon: Zap, title: "Easy Returns", desc: "30-day return policy" },
                  { icon: TrendingUp, title: "24/7 Support", desc: "Always here to help" },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* All Products Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">All Products</h2>
              <button
                onClick={() => handleNavigate("category")}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Browse All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/50 bg-card/50">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-foreground mb-4">VoltVibe</h3>
                  <p className="text-sm text-muted-foreground">
                    Your premium destination for cutting-edge electronics and smart technology.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Shop</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleCategorySelect("smartphones")}>Smartphones</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleCategorySelect("laptops")}>Laptops</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleCategorySelect("tablets")}>Tablets</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleCategorySelect("accessories")}>Accessories</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleCategorySelect("watches")}>Watches</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleCategorySelect("speakers")}>Speakers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Support</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleNavigate("contact")}>Help Center</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleNavigate("contact")}>Track Order</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleNavigate("contact")}>Returns</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleNavigate("contact")}>Contact Us</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Company</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleNavigate("about")}>About Us</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors">Careers</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</li>
                    <li className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                <p>&copy; 2024 VoltVibe. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      )}

      {currentView === "category" && (
        <CategoryPage
          categorySlug={selectedCategory}
          products={products}
          onAddToCart={handleAddToCart}
        />
      )}

      {currentView === "checkout" && (
        <CheckoutPage
          cartItems={cartItems}
          onPlaceOrder={handlePlaceOrder}
          session={session}
        />
      )}

      {currentView === "account" && (
        <AccountPage session={session} />
      )}

      {currentView === "search" && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6 text-[var(--on-surface)]">
            Search Results for "{searchQuery}"
          </h2>
          {products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
          ).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[var(--surface-container)] rounded-2xl border border-[var(--outline-variant)]">
              <h3 className="text-xl font-semibold text-[var(--on-surface)] mb-2">No products found</h3>
              <p className="text-[var(--muted-foreground)]">Try adjusting your search terms or browse our categories.</p>
              <button 
                onClick={() => setCurrentView("home")}
                className="mt-6 px-6 py-2 bg-[var(--primary)] text-[var(--on-primary)] rounded-lg hover:bg-[var(--primary)]/90 font-medium"
              >
                Back to Home
              </button>
            </div>
          )}
        </section>
      )}

      {currentView === "admin" && <AdminDashboard />}

      {/* Cart Panel */}
      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* AI Chat Overlay */}
      <AIChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        products={products}
        onAddToCart={handleAddToCart}
      />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialTab={authModalTab}
      />
    </div>
  );
}
