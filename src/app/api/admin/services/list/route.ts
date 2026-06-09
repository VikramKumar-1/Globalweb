import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    // Only verify auth in middleware, but just in case
    const services = await db.servicePage.findMany({
      select: {
        slug: true,
        title: true,
      },
      orderBy: {
        title: 'asc'
      }
    });

    return NextResponse.json({ services });
  } catch (error: any) {
    console.error('API List Services Error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
