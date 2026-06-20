import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import * as models from '@/models/schemas';
import { getAdminFromRequest } from '@/lib/auth';

function getModel(moduleName: string) {
  switch (moduleName) {
    case 'services': return models.Service;
    case 'projects': return models.Project;
    case 'gallery': return models.Gallery;
    case 'careers': return models.Career;
    case 'blogs': return models.Blog;
    case 'testimonials': return models.Testimonial;
    case 'clients': return models.Client;
    case 'quotes': return models.QuoteRequest;
    case 'applications': return models.JobApplication;
    case 'media': return models.Media;
    default: return null;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ module: string; id: string }> }
) {
  try {
    const { module: moduleName, id } = await params;
    const session = getAdminFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const Model = getModel(moduleName);
    if (!Model) {
      return NextResponse.json({ error: 'Invalid or unsupported module for this action.' }, { status: 400 });
    }

    await connectToDatabase();
    
    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { id: id }] }
      : { id: id };

    const doc = await Model.findOne(query);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    const body = await request.json();
    
    // Auto-update slug for blogs if title changes and slug not provided
    if (moduleName === 'blogs' && body.title && !body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    Object.assign(doc, body);
    await doc.save();

    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    console.error(`CMS Dynamic PUT error on module:`, error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ module: string; id: string }> }
) {
  try {
    const { module: moduleName, id } = await params;
    const session = getAdminFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const Model = getModel(moduleName);
    if (!Model) {
      return NextResponse.json({ error: 'Invalid or unsupported module for this action.' }, { status: 400 });
    }

    await connectToDatabase();

    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { id: id }] }
      : { id: id };

    const doc = await Model.findOne(query);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    // Custom handling for deleting media files from disk
    if (moduleName === 'media') {
      try {
        const fileUrl = doc.url;
        if (fileUrl && fileUrl.startsWith('/uploads/')) {
          const filePath = path.join(process.cwd(), 'public', fileUrl);
          await fs.unlink(filePath).catch(() => {
            console.warn(`[Media Clean] Could not delete physical file: ${filePath}`);
          });
        }
      } catch (err) {
        console.error('Error deleting media file from disk:', err);
      }
    }

    // Custom handling for deleting resume file from disk when application is deleted
    if (moduleName === 'applications') {
      try {
        const resumeUrl = doc.resumeUrl;
        if (resumeUrl && resumeUrl.startsWith('/uploads/')) {
          const filePath = path.join(process.cwd(), 'public', resumeUrl);
          await fs.unlink(filePath).catch(() => {
            console.warn(`[Resume Clean] Could not delete physical file: ${filePath}`);
          });
        }
      } catch (err) {
        console.error('Error deleting resume file from disk:', err);
      }
    }

    await doc.deleteOne();

    return NextResponse.json({ success: true, message: 'Document deleted successfully.' });
  } catch (error: any) {
    console.error(`CMS Dynamic DELETE error on module:`, error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
