'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Zap, Bot, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatOverlayProps {
  isOpen: boolean
  onClose: () => void
  products?: any[]
  onAddToCart?: (product: any) => void
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-railway-url') ? process.env.NEXT_PUBLIC_API_URL : 'https://voltvibe-production.up.railway.app/api');

const suggestedQuestions = [
  'Best wireless headphones under $200',
  'Compare Sony WH-1000XM6 vs Bose QC45',
  "What's on sale today?",
  'Track my order #VV-00483',
]

export function AIChatOverlay({ isOpen, onClose, products, onAddToCart }: AIChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm your VoltVibe AI Assistant. I can help you find the right electronics, compare products, check stock, or track your order. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSend = async (text?: string) => {
    const messageText = typeof text === 'string' ? text : input.trim()
    if (!messageText) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })
      
      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        throw new Error('Failed to fetch response')
      }
    } catch (error) {
      console.error(error)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting to my servers right now.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const renderMessageContent = (content: string) => {
    if (!products || products.length === 0) {
      return <p className="text-sm whitespace-pre-wrap">{content}</p>;
    }

    const regex = /\[PRODUCT:\s*([a-zA-Z0-9-]+)\s*\]/g;
    const matches = Array.from(content.matchAll(regex));
    
    if (matches.length > 0) {
      const recommendedProducts = matches
        .map(match => {
          const productId = match[1];
          return products.find(p => p.id === productId || String(p.id) === productId);
        })
        .filter(Boolean);

      const textContent = content.replace(regex, '').trim();

      return (
        <div className="flex flex-col gap-2">
          {textContent && <p className="text-sm whitespace-pre-wrap">{textContent}</p>}
          <div className="flex flex-col gap-2 mt-2">
            {recommendedProducts.map((product: any, idx: number) => (
              <div key={`${product.id}-${idx}`} className="bg-[var(--surface)] border border-[var(--outline)] rounded-lg p-3 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[var(--surface-container-high)] rounded-md flex-shrink-0 overflow-hidden">
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--on-surface)] line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-[var(--primary)] font-bold">${product.price}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-7 text-xs w-full mt-1 bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary)]/90"
                    onClick={() => onAddToCart && onAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return <p className="text-sm whitespace-pre-wrap">{content}</p>;
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md mx-4 sm:mx-0">
      <div className="bg-[var(--surface)] border border-[var(--outline)] rounded-xl shadow-2xl overflow-hidden glow-primary">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--outline)] bg-[var(--surface-bright)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[var(--on-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--on-surface)]">VoltVibe AI Assistant</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">
                Ask me anything about electronics!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessages([{
                id: '1',
                role: 'assistant',
                content: "Hi! I'm your VoltVibe AI Assistant. I can help you find the right electronics, compare products, check stock, or track your order. What would you like to know?",
                timestamp: new Date(),
              }])}
              className="text-xs text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]"
            >
              Clear Chat
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-[var(--on-surface-variant)] bg-[var(--error)]/10 hover:bg-[var(--error)] hover:text-[var(--on-error)] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-80 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'assistant'
                      ? 'bg-[var(--primary)]'
                      : 'bg-[var(--surface-container-high)]'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 text-[var(--on-primary)]" />
                  ) : (
                    <User className="w-4 h-4 text-[var(--on-surface-variant)]" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'assistant'
                      ? 'bg-[var(--surface-container)] text-[var(--on-surface)]'
                      : 'bg-[var(--primary)] text-[var(--on-primary)]'
                  }`}
                >
                  {renderMessageContent(message.content)}
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'assistant'
                        ? 'text-[var(--on-surface-variant)]'
                        : 'text-[var(--on-primary)]/70'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[var(--on-primary)]" />
                </div>
                <div className="bg-[var(--surface-container)] rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-[var(--outline)] bg-[var(--surface)]">
          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <Badge
                  key={q}
                  variant="outline"
                  className="cursor-pointer hover:bg-[var(--surface-container-high)] border-[var(--outline)] text-[var(--on-surface-variant)]"
                  onClick={() => {
                    setInput(q)
                    handleSend(q)
                  }}
                >
                  {q}
                </Badge>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex flex-col gap-2"
          >
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-[var(--surface-bright)] border-[var(--outline)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className="bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary)]/90 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full mt-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
              Close Chat
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
