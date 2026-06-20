import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Admin } from '@/models/schemas';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = getAdminFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Session not found or expired.' }, { status: 401 });
    }

    await connectToDatabase();
    const admin = await Admin.findById(session.id);
    if (!admin) {
      return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        profilePhoto: admin.profilePhoto
      }
    });
  } catch (error: any) {
    console.error('Auth-me API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
