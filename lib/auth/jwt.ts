import jwt from 'jsonwebtoken';
import { type JWTPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET!;

export const signToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};