import { NextResponse } from "next/server";

const API_URL = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-railway-url') ? process.env.NEXT_PUBLIC_API_URL : 'https://voltvibe-production.up.railway.app/api');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/orders/?user=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const orders = await res.json();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId;
    const totalAmount = body.totalAmount;
    const orderItems = body.items || body.orderItems;

    if (!userId || totalAmount === undefined || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields or invalid order items" },
        { status: 400 }
      );
    }

    const orderRes = await fetch(`${API_URL}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: userId, totalAmount })
    });
    if (!orderRes.ok) throw new Error('Failed to create order');
    const newOrder = await orderRes.json();

    for (const item of orderItems) {
      await fetch(`${API_URL}/order-items/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: newOrder.id,
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })
      });
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
