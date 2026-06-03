// VoltVibe Types and Mock Data

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  image: string
  hoverImages?: string[]
  inStock: boolean
  isBestSeller?: boolean
  isNew?: boolean
  isHot?: boolean
  description?: string
  specifications?: Record<string, string>
}

export interface Category {
  id: string
  name: string
  icon: string
  slug: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  date: string
  items: string[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

export interface Brand {
  id: string
  name: string
  logo?: string
}

// Categories
export const categories: Category[] = [
  { id: '1', name: 'Smartphones', icon: '📱', slug: 'smartphones' },
  { id: '2', name: 'Laptops', icon: '💻', slug: 'laptops' },
  { id: '3', name: 'Tablets', icon: '📱', slug: 'tablets' },
  { id: '4', name: 'Accessories', icon: '🎧', slug: 'accessories' },
  { id: '5', name: 'Watches', icon: '⌚', slug: 'watches' },
  { id: '6', name: 'Speakers', icon: '🔊', slug: 'speakers' },
]

// Brands
export const brands: Brand[] = [
  { id: '1', name: 'Samsung' },
  { id: '2', name: 'Haier' },
  { id: '3', name: 'Sony' },
  { id: '4', name: 'LG' },
  { id: '5', name: 'Audionic' },
  { id: '6', name: 'JBL' },
  { id: '7', name: 'Apple' },
  { id: '8', name: 'Lenovo' },
  { id: '9', name: 'HP' },
  { id: '10', name: 'Logitech' },
  { id: '11', name: 'Canon' },
  { id: '12', name: 'TP-Link' },
  { id: '13', name: 'Xiaomi' },
  { id: '14', name: 'Dawlance' },
  { id: '15', name: 'Orient' },
]

// Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Samsung 55" QLED 4K Smart TV Q80D',
    brand: 'Samsung',
    category: 'smart-tvs',
    price: 189999,
    originalPrice: 249000,
    discount: 24,
    rating: 4.4,
    reviews: 1203,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isBestSeller: true,
  },
  {
    id: '2',
    name: 'Sony WH-1000XM6 Wireless Headphones',
    brand: 'Sony',
    category: 'headphones',
    price: 89999,
    originalPrice: 115000,
    discount: 22,
    rating: 4.8,
    reviews: 2456,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isHot: true,
  },
  {
    id: '3',
    name: 'Audionic Wolfpack TWS Earbuds',
    brand: 'Audionic',
    category: 'wireless-earbuds',
    price: 4499,
    originalPrice: 5999,
    discount: 25,
    rating: 4.2,
    reviews: 822,
    image: 'https://images.unsplash.com/photo-1572569433114-6f3458cded74?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: '4',
    name: 'Haier 1.5 Ton Inverter AC',
    brand: 'Haier',
    category: 'smart-home',
    price: 115000,
    originalPrice: 145000,
    discount: 21,
    rating: 4.3,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1622201389860-245f7bd47413?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: '5',
    name: 'Logitech MX Master 3S Mouse',
    brand: 'Logitech',
    category: 'keyboards',
    price: 21500,
    originalPrice: 27999,
    discount: 23,
    rating: 4.7,
    reviews: 1834,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isBestSeller: true,
  },
  {
    id: '6',
    name: 'Canon EOS R50 Camera',
    brand: 'Canon',
    category: 'cameras',
    price: 145000,
    originalPrice: 185000,
    discount: 22,
    rating: 4.6,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isNew: true,
  },
  {
    id: '7',
    name: 'JBL Charge 5 Portable Speaker',
    brand: 'JBL',
    category: 'speakers',
    price: 28000,
    originalPrice: 35999,
    discount: 22,
    rating: 4.5,
    reviews: 1256,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: '8',
    name: 'HP Pavilion 15 Laptop',
    brand: 'HP',
    category: 'laptops',
    price: 135000,
    originalPrice: 165000,
    discount: 18,
    rating: 4.3,
    reviews: 789,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: '9',
    name: 'Xiaomi Smart Robot Vacuum',
    brand: 'Xiaomi',
    category: 'smart-home',
    price: 56000,
    originalPrice: 72000,
    discount: 22,
    rating: 4.4,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isNew: true,
  },
  {
    id: '10',
    name: 'TP-Link Archer AX73 WiFi Router',
    brand: 'TP-Link',
    category: 'networking',
    price: 18500,
    originalPrice: 24999,
    discount: 26,
    rating: 4.5,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: '11',
    name: 'Audionic 2.1 Speaker System',
    brand: 'Audionic',
    category: 'speaker-systems',
    price: 7999,
    originalPrice: 10999,
    discount: 27,
    rating: 4.1,
    reviews: 445,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: '12',
    name: 'Samsung Galaxy Watch 7',
    brand: 'Samsung',
    category: 'mobile-accessories',
    price: 52000,
    originalPrice: 68000,
    discount: 24,
    rating: 4.6,
    reviews: 1122,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isHot: true,
  },
  {
    id: 's1',
    name: 'Sonos One (Gen 2) Smart Speaker',
    brand: 'Sonos',
    category: 'speakers',
    price: 65000,
    originalPrice: 75000,
    discount: 13,
    rating: 4.8,
    reviews: 843,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isBestSeller: true,
    description: 'The powerful smart speaker with voice control built in. Get rich, room-filling sound with Sonos One, and control it with your voice, the Sonos app, Apple AirPlay 2, and more.',
    specifications: {
      'Connectivity': 'Wi-Fi, AirPlay 2',
      'Voice Assistant': 'Amazon Alexa, Google Assistant',
      'Weight': '1.85 kg',
      'Dimensions': '161.45 x 119.7 x 119.7 mm'
    }
  },
  {
    id: 's2',
    name: 'JBL Charge 5 Portable Bluetooth Speaker',
    brand: 'JBL',
    category: 'speakers',
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    rating: 4.7,
    reviews: 1250,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    description: 'Take the party with you no matter what the weather. The JBL Charge 5 speaker delivers bold JBL Original Pro Sound, with its optimized long excursion driver, separate tweeter and dual pumping JBL bass radiators.',
    specifications: {
      'Connectivity': 'Bluetooth 5.1',
      'Battery Life': '20 Hours',
      'Waterproof': 'IP67 Rated',
      'Output Power': '40W'
    }
  },
  {
    id: 's3',
    name: 'Bose SoundLink Revolve+ II',
    brand: 'Bose',
    category: 'speakers',
    price: 85000,
    originalPrice: 95000,
    discount: 10,
    rating: 4.9,
    reviews: 632,
    image: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isHot: true,
    description: 'Deep. Loud. And immersive, too. The SoundLink Revolve+ II is engineered to deliver true 360° sound for consistent, uniform coverage.',
    specifications: {
      'Connectivity': 'Bluetooth',
      'Battery Life': '17 Hours',
      'Waterproof': 'IP55 Rated',
      'Features': 'Built-in microphone, Siri/Google Assistant support'
    }
  },
  {
    id: 's4',
    name: 'Marshall Stanmore II Bluetooth Speaker',
    brand: 'Marshall',
    category: 'speakers',
    price: 110000,
    originalPrice: 130000,
    discount: 15,
    rating: 4.8,
    reviews: 412,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    description: 'Stanmore II is the most versatile speaker in the Marshall line-up and is perfect for any room, big or small. It delivers on the promise of high-performance sound that is synonymous with the Marshall name.',
    specifications: {
      'Connectivity': 'Bluetooth 5.0 aptX, 3.5mm, RCA',
      'Power Type': 'Mains Powered',
      'Frequency Range': '50–20,000 Hz',
      'Design': 'Classic Marshall Vintage'
    }
  },
  {
    id: 's5',
    name: 'Ultimate Ears BOOM 3',
    brand: 'Logitech',
    category: 'speakers',
    price: 42000,
    originalPrice: 48000,
    discount: 12,
    rating: 4.6,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1605335150937-2ee0f5e13d5d?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    description: 'Ultimate Ears BOOM 3 is a super-portable wireless speaker built for adventure. It rocks loud, immersive 360-degree sound with deep bass, all carefully balanced so you can hear every note.',
    specifications: {
      'Connectivity': 'Bluetooth',
      'Battery Life': '15 Hours',
      'Waterproof': 'IP67 (Floats)',
      'Custom EQ': 'Yes (Via App)'
    }
  },
  {
    id: 's6',
    name: 'Sony SRS-XB43 Wireless Speaker',
    brand: 'Sony',
    category: 'speakers',
    price: 60000,
    originalPrice: 70000,
    discount: 14,
    rating: 4.5,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1589003071536-41f237307044?auto=format&fit=crop&q=80&w=800',
    inStock: false,
    description: 'Enjoy deep, punchy sound wherever you like with your EXTRA BASS™ speaker. Dual passive radiators work together with the 2-way speaker system to enhance low-end tones, giving bass a boost.',
    specifications: {
      'Connectivity': 'Bluetooth, NFC',
      'Battery Life': '24 Hours',
      'Lighting': 'Customizable Party Lights',
      'Waterproof': 'IP67'
    }
  },
  {
    id: 's7',
    name: 'Anker Soundcore Motion+',
    brand: 'Anker',
    category: 'speakers',
    price: 32000,
    originalPrice: 40000,
    discount: 20,
    rating: 4.7,
    reviews: 1432,
    image: 'https://images.unsplash.com/photo-1545657438-eeb24f2b1d3d?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isBestSeller: true,
    description: 'Motion+ is equipped with stunning Hi-Res audio which is further enhanced by Qualcomm aptX for lossless music reproduction when streaming via Bluetooth.',
    specifications: {
      'Connectivity': 'Bluetooth 5.0, AUX',
      'Output Power': '30W',
      'Battery Life': '12 Hours',
      'Waterproof': 'IPX7'
    }
  },
  {
    id: 's8',
    name: 'Bang & Olufsen Beolit 20',
    brand: 'Bang & Olufsen',
    category: 'speakers',
    price: 150000,
    originalPrice: 170000,
    discount: 11,
    rating: 4.9,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1550529895-65ed660b45d0?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    description: 'A powerful and portable Bluetooth speaker with built-in Qi wireless charging, delivering rich Bang & Olufsen Signature Sound inside a premium aluminum basket.',
    specifications: {
      'Connectivity': 'Bluetooth 4.2',
      'Battery Life': '8 Hours (typical)',
      'Feature': 'Built-in Qi Wireless Charging Pad',
      'Materials': 'Polymer, Aluminum, Leather'
    }
  },
  {
    id: 's9',
    name: 'Harman Kardon Onyx Studio 7',
    brand: 'Harman Kardon',
    category: 'speakers',
    price: 75000,
    originalPrice: 90000,
    discount: 16,
    rating: 4.6,
    reviews: 321,
    image: 'https://images.unsplash.com/photo-1611077543888-eb287e040fb6?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isHot: true,
    description: 'Elevate your senses with superior stereo and artful industrial design. Immerse yourself in the rhythm of life with unrivaled acoustic precision.',
    specifications: {
      'Connectivity': 'Bluetooth 4.2',
      'Battery Life': '8 Hours',
      'Design': 'Die-cast Anodized Aluminum Handle',
      'Transducers': 'Woofer 1 x 120mm, Tweeter 2 x 25mm'
    }
  },
  {
    id: 's10',
    name: 'Tribit StormBox Blast',
    brand: 'Tribit',
    category: 'speakers',
    price: 55000,
    originalPrice: 65000,
    discount: 15,
    rating: 4.7,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1525032549226-f76ea0de04e1?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    description: 'A massive 90W output brings the thunderous, body-shaking bass to your party. Equipped with XBass technology to enhance low frequencies in real-time.',
    specifications: {
      'Connectivity': 'Bluetooth 5.3',
      'Output Power': '90W',
      'Battery Life': '30 Hours',
      'Lighting': '32 LED Lights syncing to the beat'
    }
  },
  {
    id: 's11',
    name: 'Marshall Emberton II',
    brand: 'Marshall',
    category: 'speakers',
    price: 49000,
    originalPrice: 55000,
    discount: 10,
    rating: 4.8,
    reviews: 932,
    image: 'https://images.unsplash.com/photo-1605050825077-289f85b6cf43?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isHot: true,
    description: 'Emberton II is a compact portable speaker with the loud and vibrant sound only Marshall can deliver. Two 2-inch full range drivers and two passive radiators bring you the heavy Marshall sound you know and love.',
    specifications: {
      'Connectivity': 'Bluetooth 5.1',
      'Battery Life': '30+ Hours',
      'Waterproof': 'IP67 Dust and Water Resistant',
      'Feature': 'Stack Mode for multi-speaker play'
    }
  },
  {
    id: 's12',
    name: 'Apple HomePod mini',
    brand: 'Apple',
    category: 'speakers',
    price: 35000,
    originalPrice: 40000,
    discount: 12,
    rating: 4.7,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1588691522304-dae02de8561c?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isBestSeller: true,
    description: 'Jam-packed with innovation, HomePod mini delivers unexpectedly big sound for a speaker of its size. At just 3.3 inches tall, it takes up almost no space but fills the entire room with rich 360-degree audio.',
    specifications: {
      'Connectivity': 'Wi-Fi, Bluetooth 5.0, Thread',
      'Voice Assistant': 'Siri Integration',
      'Audio': 'Computational audio with S5 chip',
      'Smart Home': 'Apple HomeKit Hub'
    }
  },
]

// Flash deals
export const flashDeals = products.filter(p => p.discount >= 25)

// Best sellers
export const bestSellers = products.filter(p => p.isBestSeller || p.isHot)

// Orders
export const orders: Order[] = [
  {
    id: 'VV-00483',
    date: 'May 16, 2025',
    items: ['Sony Headphones'],
    total: 78049,
    status: 'shipped',
  },
  {
    id: 'VV-00421',
    date: 'May 10, 2025',
    items: ['Audionic Earbuds'],
    total: 4499,
    status: 'delivered',
  },
  {
    id: 'VV-00389',
    date: 'Apr 28, 2025',
    items: ['JBL Speaker'],
    total: 28000,
    status: 'cancelled',
  },
]

// Announcement ticker messages
export const announcements = [
  '🎉 Eid Sale - Up to 40% Off',
  'Free Delivery on orders over $50',
  'New Arrivals: Apple Vision Pro',
  'Sony Wireless Earbuds Now In Stock',
  'Black Friday Deals Coming Soon',
]

// Format price in USD
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Format rating stars
export function formatRating(rating: number): string {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = '★'.repeat(fullStars)
  if (hasHalfStar) stars += '☆'
  stars += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
  return stars
}

// Admin dashboard stats
export const adminStats = {
  todayRevenue: 2450000,
  weekRevenue: 15800000,
  monthRevenue: 62500000,
  pendingOrders: 45,
  shippedOrders: 128,
  deliveredOrders: 892,
  cancelledOrders: 12,
  lowStockItems: [
    { name: 'Sony WH-1000XM6', stock: 5 },
    { name: 'Samsung 55" QLED TV', stock: 3 },
    { name: 'JBL Charge 5', stock: 8 },
    { name: 'Logitech MX Master 3S', stock: 7 },
  ],
  topProducts: [
    { name: 'Sony WH-1000XM6', sales: 156, revenue: 14039844 },
    { name: 'Samsung 55" QLED TV', sales: 89, revenue: 16909111 },
    { name: 'Audionic Wolfpack TWS', sales: 234, revenue: 1052766 },
    { name: 'Logitech MX Master 3S', sales: 178, revenue: 3827000 },
    { name: 'JBL Charge 5', sales: 145, revenue: 4060000 },
  ],
}
