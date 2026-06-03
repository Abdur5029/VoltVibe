import { NextResponse } from 'next/server';
import { z } from 'zod';

const API_URL = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-railway-url') ? process.env.NEXT_PUBLIC_API_URL : 'https://voltvibe-production.up.railway.app/api');

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.string().optional(),
});

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/users/`);
    if (!res.ok) throw new Error('Failed to fetch users');
    const users = await res.json();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = userSchema.parse(body);

    const res = await fetch(`${API_URL}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          username: validatedData.email,
          email: validatedData.email,
          first_name: validatedData.name || '',
          role: validatedData.role || 'USER',
          password: 'defaultPassword123!', 
      }),
    });
    
    if (!res.ok) throw new Error('Failed to create user');
    const user = await res.json();

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
