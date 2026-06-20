import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { Admin } from '@/models/schemas';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = generateToken({
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        profilePhoto: admin.profilePhoto
      }
    });

    // Set HTTP-Only Cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
