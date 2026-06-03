"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, Grid3X3, List, Star } from "lucide-react";
import { Product, categories } from "@/lib/data";
import { ProductCard } from "./product-card";

interface CategoryPageProps {
  categorySlug?: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200 - $500", min: 200, max: 500 },
  { label: "Over $500", min: 500, max: Infinity },
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Newest", value: "newest" },
];

export function CategoryPage({ categorySlug, products, onAddToCart }: CategoryPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const category = categories.find((c) => c.slug === categorySlug);
  
  // Base products filtered by category if applicable
  const baseCategoryProducts = categorySlug
    ? products.filter((p) => p.category.toLowerCase() === categorySlug.toLowerCase())
    : products;

  // Dynamically calculate available brands from products IN THIS CATEGORY
  const availableBrands = Array.from(new Set(baseCategoryProducts.map(p => p.brand))).filter(Boolean).sort();

  // Filter products by other criteria
  let filteredProducts = baseCategoryProducts;

  // Apply price filter
  if (selectedPriceRanges.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedPriceRanges.some((idx) => {
        const range = priceRanges[idx];
        return p.price >= range.min && p.price < range.max;
      })
    );
  }

  // Apply brand filter
  if (selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedBrands.includes(p.brand || "")
    );
  }

  // Apply rating filter
  if (minRating > 0) {
    filteredProducts = filteredProducts.filter((p) => p.rating >= minRating);
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const togglePriceRange = (idx: number) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Page Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {category?.name || "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {sortedProducts.length} products available
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-card/50 rounded-xl border border-border/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>

            <div className="flex items-center gap-1 bg-secondary/30 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-secondary/50 border border-border/50 rounded-lg px-4 py-2 pr-10 text-sm font-medium cursor-pointer hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0 space-y-6">
              {/* Price Range */}
              <div className="bg-card/50 rounded-xl border border-border/50 p-4">
                <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedPriceRanges.includes(idx)
                            ? "bg-primary border-primary"
                            : "border-border group-hover:border-primary/50"
                        }`}
                        onClick={() => togglePriceRange(idx)}
                      >
                        {selectedPriceRanges.includes(idx) && (
                          <svg
                            className="w-3 h-3 text-primary-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="bg-card/50 rounded-xl border border-border/50 p-4">
                <h3 className="font-semibold text-foreground mb-4">Brands</h3>
                <div className="space-y-2">
                  {availableBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedBrands.includes(brand)
                            ? "bg-primary border-primary"
                            : "border-border group-hover:border-primary/50"
                        }`}
                        onClick={() => toggleBrand(brand)}
                      >
                        {selectedBrands.includes(brand) && (
                          <svg
                            className="w-3 h-3 text-primary-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="bg-card/50 rounded-xl border border-border/50 p-4">
                <h3 className="font-semibold text-foreground mb-4">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          minRating === rating
                            ? "bg-primary border-primary"
                            : "border-border group-hover:border-primary/50"
                        }`}
                      >
                        {minRating === rating && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-accent text-accent"
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedPriceRanges.length > 0 ||
                selectedBrands.length > 0 ||
                minRating > 0) && (
                <button
                  onClick={() => {
                    setSelectedPriceRanges([]);
                    setSelectedBrands([]);
                    setMinRating(0);
                  }}
                  className="w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Products Area */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Top Products Section (Only on All Products view) */}
            {!categorySlug && sortedProducts.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--outline-variant)]">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--on-surface)] tracking-tight">Top Products</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts
                    .filter((p) => p.rating >= 4.5)
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3)
                    .map((product) => (
                      <ProductCard
                        key={`top-${product.id}`}
                        product={product}
                        onAddToCart={onAddToCart}
                      />
                    ))}
                </div>
                {sortedProducts.length > 3 && (
                  <div className="mt-12 flex items-center gap-3 mb-6 pb-4 border-b border-[var(--outline-variant)]">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface-container-high)] flex items-center justify-center text-[var(--on-surface)]">
                      <Grid3X3 className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--on-surface)] tracking-tight">Explore All</h2>
                  </div>
                )}
              </div>
            )}

            {sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No products found matching your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedPriceRanges([]);
                    setSelectedBrands([]);
                    setMinRating(0);
                  }}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    variant={viewMode === "list" ? "horizontal" : "default"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
