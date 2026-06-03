import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const url = category ? `${API_URL}/products/?category=${category}` : `${API_URL}/products/`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    const products = await res.json();

    const mappedProducts = products.map((p: any, index: number) => ({
      ...p,
      rating: 4.5,
      reviews: 120 + (index * 10),
      discount: index % 3 === 0 ? 30 : 0, 
      originalPrice: index % 3 === 0 ? Math.round(p.price * 1.3) : p.price,
      inStock: p.stock > 0,
      isBestSeller: index % 4 === 0,
      isHot: index % 5 === 0,
      isNew: index % 2 === 0
    }));

    return NextResponse.json(mappedProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_URL}/products/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) throw new Error('Failed to create product');
    const newProduct = await res.json();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
