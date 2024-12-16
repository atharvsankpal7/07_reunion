import { NextRequest } from 'next/server';
import { AppError } from './error-handler';

export function getUserIdFromRequest(req: NextRequest): string {
  const userId = req.headers.get('userId');
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }
  return userId;
}