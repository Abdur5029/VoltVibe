import { NextResponse } from "next/server";

const API_URL = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-railway-url') ? process.env.NEXT_PUBLIC_API_URL : 'https://voltvibe-production.up.railway.app/api');

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${API_URL}/wishlists/${params.id}/`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Failed to delete from wishlist');

    return NextResponse.json({ message: 'Removed from wishlist' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting from wishlist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
