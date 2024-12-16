import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function authMiddleware(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    request.headers.set('userId', decoded.userId);
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}