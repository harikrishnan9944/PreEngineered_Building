import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-1234567890-peb-website';

export interface AdminJwtPayload {
  id: string;
  name: string;
  email: string;
}

export function generateToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
  } catch (error) {
    return null;
  }
}

export function getAdminFromRequest(request: NextRequest): AdminJwtPayload | null {
  try {
    // 1. Check cookies
    const tokenCookie = request.cookies.get('admin_token');
    if (tokenCookie && tokenCookie.value) {
      return verifyToken(tokenCookie.value);
    }

    // 2. Check Authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return verifyToken(token);
    }
  } catch (error) {
    console.error('Error getting admin from request:', error);
  }
  return null;
}
