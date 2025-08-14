// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'Authentication token required' }), { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    // You could attach the payload to the request headers if needed, but for Pages Router API routes,
    // we will re-verify in the API route itself for simplicity.
    return NextResponse.next();
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
  }
}

// This config specifies which routes the middleware should run on
export const config = {
  matcher: '/api/shipments/:path*',
};