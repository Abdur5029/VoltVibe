import { NextResponse } from 'next/server';
import { z } from 'zod';

const API_URL = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-railway-url') ? process.env.NEXT_PUBLIC_API_URL : 'https://voltvibe-production.up.railway.app/api');

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_URL}/users/${id}/`);
    if (!res.ok) {
        if (res.status === 404) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        throw new Error('Failed to fetch');
    }
    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = userUpdateSchema.parse(body);

    const res = await fetch(`${API_URL}/users/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...(validatedData.email && { email: validatedData.email, username: validatedData.email }),
            ...(validatedData.name && { first_name: validatedData.name }),
            ...(validatedData.role && { role: validatedData.role }),
        })
    });
    if (!res.ok) throw new Error('Failed to update');
    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_URL}/users/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
