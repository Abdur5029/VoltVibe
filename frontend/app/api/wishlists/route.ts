import { NextResponse } from "next/server";

const API_URL = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-railway-url') ? process.env.NEXT_PUBLIC_API_URL : 'https://voltvibe-production.up.railway.app/api');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/wishlists/?user=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch wishlist');
    const data = await res.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user, product } = body;

    if (!user || !product) {
      return NextResponse.json(
        { error: "User and product ID are required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/wishlists/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, product })
    });

    if (!res.ok) throw new Error('Failed to add to wishlist');
    const data = await res.json();

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
