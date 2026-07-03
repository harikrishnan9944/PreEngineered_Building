import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/mongodb';
import * as models from '@/models/schemas';
import { getAdminFromRequest } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

function getModelConfig(moduleName: string) {
  switch (moduleName) {
    case 'hero': return { model: models.Hero, isSingle: true };
    case 'about':
    case 'company': return { model: models.Company, isSingle: true };
    case 'seo': return { model: models.SeoSetting, isSingle: true };
    case 'settings': return { model: models.WebsiteSetting, isSingle: true };
    case 'contact-settings': return { model: models.Contact, isSingle: true };
    
    case 'services': return { model: models.Service, isSingle: false, sort: { displayOrder: 1 } };
    case 'projects': return { model: models.Project, isSingle: false, sort: { completionYear: -1, id: 1 } };
    case 'gallery': return { model: models.Gallery, isSingle: false, sort: { displayOrder: 1 } };
    case 'careers': return { model: models.Career, isSingle: false, sort: { createdAt: -1 } };
    case 'blogs': return { model: models.Blog, isSingle: false, sort: { date: -1 } };
    case 'testimonials': return { model: models.Testimonial, isSingle: false, sort: { id: 1 } };
    case 'clients': return { model: models.Client, isSingle: false, sort: { displayOrder: 1 } };
    case 'quotes': return { model: models.QuoteRequest, isSingle: false, sort: { timestamp: -1 } };
    case 'applications': return { model: models.JobApplication, isSingle: false, sort: { timestamp: -1 } };
    case 'media': return { model: models.Media, isSingle: false, sort: { uploadDate: -1 } };
    default: return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module: moduleName } = await params;
    const session = getAdminFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const config = getModelConfig(moduleName);
    if (!config) {
      return NextResponse.json({ error: 'Invalid module name.' }, { status: 400 });
    }

    await connectToDatabase();

    if (config.isSingle) {
      const doc = await config.model.findOne().lean();
      return NextResponse.json(doc || {});
    } else {
      const docs = await config.model.find().sort(config.sort as any).lean();
      return NextResponse.json(docs);
    }
  } catch (error: any) {
    console.error(`CMS Dynamic GET error on module:`, error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module: moduleName } = await params;
    const session = getAdminFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await connectToDatabase();

    // 1. Media upload custom handling
    if (moduleName === 'media') {
      try {
        const formData = await request.formData();
        const files = formData.getAll('file') as File[];
        
        if (!files || files.length === 0) {
          return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
        }

        const uploadPromises = files.map(async (file) => {
          if (!file.name) return null;
          
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          // Upload to Cloudinary
          const uploadResult = await uploadToCloudinary(buffer, 'preengineered_building', file.name);
          
          const mediaDoc = await models.Media.create({
            filename: file.name,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            size: file.size,
            type: file.type,
            uploadDate: new Date()
          });
          return mediaDoc;
        });

        const results = await Promise.all(uploadPromises);
        const uploadedMedia = results.filter((doc) => doc !== null);

        return NextResponse.json({ success: true, media: uploadedMedia });
      } catch (err: any) {
        console.error('Media upload API error:', err);
        return NextResponse.json({ error: err.message || 'File upload failed.' }, { status: 500 });
      }
    }

    const config = getModelConfig(moduleName);
    if (!config) {
      return NextResponse.json({ error: 'Invalid module name.' }, { status: 400 });
    }

    const body = await request.json();

    if (config.isSingle) {
      // Single documents upsert logic
      let doc = await config.model.findOne();
      if (doc) {
        Object.assign(doc, body);
        await doc.save();
      } else {
        doc = await config.model.create(body);
      }
      return NextResponse.json({ success: true, data: doc });
    } else {
      // List items insertion logic
      // Auto-generate ID if needed
      if (!body.id) {
        body.id = (body.title || body.name || 'item')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
      }
      
      // Auto-generate slug for blogs if not present
      if (moduleName === 'blogs' && !body.slug) {
        body.slug = body.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }

      const doc = await config.model.create(body);
      return NextResponse.json({ success: true, data: doc });
    }
  } catch (error: any) {
    console.error(`CMS Dynamic POST error on module:`, error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  return POST(request, { params });
}
