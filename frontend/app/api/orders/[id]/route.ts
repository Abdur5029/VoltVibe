import { NextResponse } from "next/server";

const API_URL = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-railway-url') ? process.env.NEXT_PUBLIC_API_URL : 'https://voltvibe-production.up.railway.app/api');

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${API_URL}/orders/${params.id}/`);
    if (!res.ok) throw new Error('Failed to fetch order');
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_URL}/orders/${params.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Failed to update order');
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${API_URL}/orders/${params.id}/`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete order" }, { status: 500 });
  }
}
