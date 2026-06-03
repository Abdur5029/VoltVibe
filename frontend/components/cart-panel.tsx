'use client'

import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { CartItem, formatPrice } from '@/lib/data'
import Link from 'next/link'

interface CartPanelProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout?: () => void
}

export function CartPanel({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartPanelProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const originalTotal = items.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  )
  const discount = originalTotal - subtotal
  const deliveryFee = subtotal > 5000 ? 0 : 299

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 bg-[var(--surface)] border-[var(--outline-variant)]"
      >
        <SheetHeader className="p-4 border-b border-[var(--outline-variant)]">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-[var(--on-surface)]">
              <ShoppingBag className="w-5 h-5 text-[var(--primary)]" />
              Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
            </SheetTitle>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] px-4">
            <ShoppingBag className="w-16 h-16 text-[var(--muted-foreground)] mb-4" />
            <p className="text-lg font-medium text-[var(--on-surface)] mb-2">
              Your cart is empty
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mb-4 text-center">
              Add items to your cart to see them here
            </p>
            <SheetClose asChild>
                <Button
                  onClick={onClose}
                  className="bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary)]/90"
                >
                  Continue Shopping
                </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 h-[calc(100vh-320px)]">
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 rounded-lg bg-[var(--surface-container)] border border-[var(--outline-variant)]"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg bg-[var(--surface-container-high)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl opacity-50">
                          {item.product.category === 'headphones' && '🎧'}
                          {item.product.category === 'smart-tvs' && '📺'}
                          {item.product.category === 'laptops' && '💻'}
                          {item.product.category === 'cameras' && '📷'}
                          {item.product.category === 'speakers' && '🔊'}
                          {item.product.category === 'keyboards' && '⌨️'}
                          {item.product.category === 'smart-home' && '🏠'}
                          {item.product.category === 'networking' && '🌐'}
                          {item.product.category === 'wireless-earbuds' && '🎧'}
                          {item.product.category === 'speaker-systems' && '🔊'}
                          {item.product.category === 'mobile-accessories' && '⌚'}
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-[var(--on-surface)] line-clamp-2 mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-sm font-bold text-[var(--primary)]">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-[var(--outline)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]"
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium text-[var(--on-surface)]">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-[var(--outline)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]"
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error)]/10"
                          onClick={() => onRemoveItem(item.product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Summary */}
            <div className="p-4 border-t border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[var(--success)]">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
                </div>
                <Separator className="bg-[var(--outline-variant)]" />
                <div className="flex justify-between text-lg font-bold text-[var(--on-surface)]">
                  <span>Total</span>
                  <span>{formatPrice(subtotal + deliveryFee)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <SheetClose asChild>
                  <Button
                    onClick={onCheckout}
                    className="w-full bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary)]/90 font-semibold"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full border-[var(--outline)] text-[var(--on-surface)] hover:bg-[var(--surface-container)]"
                  >
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
