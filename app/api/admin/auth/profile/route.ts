import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { Admin } from '@/models/schemas';
import { getAdminFromRequest } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = getAdminFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await connectToDatabase();
    const admin = await Admin.findById(session.id);
    if (!admin) {
      return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { name, email, phone, profilePhoto, currentPassword, newPassword } = body;

    // Basic fields update
    if (name) admin.name = name;
    if (email) {
      // Check if email is already taken by another admin
      const existing = await Admin.findOne({ email, _id: { $ne: admin._id } });
      if (existing) {
        return NextResponse.json({ error: 'Email is already taken by another administrator.' }, { status: 400 });
      }
      admin.email = email;
    }
    if (phone !== undefined) admin.phone = phone;
    if (profilePhoto) admin.profilePhoto = profilePhoto;

    // Password change
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
      }
      admin.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        profilePhoto: admin.profilePhoto
      }
    });
  } catch (error: any) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile.' }, { status: 500 });
  }
}
