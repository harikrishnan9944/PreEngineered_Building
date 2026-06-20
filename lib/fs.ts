import { promises as fs } from 'fs';
import path from 'path';
import { connectToDatabase } from './mongodb';
import * as models from '../models/schemas';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function readJson<T>(fileName: string, defaultValue: T): Promise<T> {
  // Helper to serialize MongoDB documents to plain JSON objects
  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  try {
    // Attempt to connect to MongoDB and read data dynamically
    await connectToDatabase();

    if (fileName === 'hero.json') {
      const hero = await models.Hero.findOne().lean();
      if (hero) return serialize(hero) as unknown as T;
    } else if (fileName === 'company.json') {
      const company = await models.Company.findOne().lean();
      if (company) return serialize(company) as unknown as T;
    } else if (fileName === 'services.json') {
      const services = await models.Service.find({ status: 'active' }).sort({ displayOrder: 1 }).lean();
      if (services && services.length > 0) return serialize(services) as unknown as T;
    } else if (fileName === 'projects.json') {
      const projects = await models.Project.find({ status: 'active' }).sort({ completionYear: -1, id: 1 }).lean();
      if (projects && projects.length > 0) return serialize(projects) as unknown as T;
    } else if (fileName === 'gallery.json') {
      const gallery = await models.Gallery.find({ status: 'active' }).sort({ displayOrder: 1 }).lean();
      if (gallery && gallery.length > 0) return serialize(gallery) as unknown as T;
    } else if (fileName === 'careers.json') {
      const careers = await models.Career.find({ status: 'active' }).sort({ createdAt: -1 }).lean();
      if (careers && careers.length > 0) return serialize(careers) as unknown as T;
    } else if (fileName === 'blogs.json') {
      const blogs = await models.Blog.find({ status: 'published' }).sort({ date: -1 }).lean();
      if (blogs && blogs.length > 0) return serialize(blogs) as unknown as T;
    } else if (fileName === 'testimonials.json') {
      const testimonials = await models.Testimonial.find({ status: 'active' }).sort({ id: 1 }).lean();
      if (testimonials && testimonials.length > 0) return serialize(testimonials) as unknown as T;
    } else if (fileName === 'clients.json') {
      const clients = await models.Client.find({ status: 'active' }).sort({ displayOrder: 1 }).lean();
      if (clients && clients.length > 0) return serialize(clients) as unknown as T;
    } else if (fileName === 'seo.json') {
      const seo = await models.SeoSetting.findOne().lean();
      if (seo) return serialize(seo) as unknown as T;
    } else if (fileName === 'settings.json') {
      const settings = await models.WebsiteSetting.findOne().lean();
      if (settings) return serialize(settings) as unknown as T;
    } else if (fileName === 'contacts.json') {
      const contacts = await models.Contact.findOne().lean();
      if (contacts) return serialize(contacts) as unknown as T;
    }
  } catch (error) {
    console.warn(`[MongoDB Read] Failed to fetch ${fileName} from database. Falling back to local JSON.`, error);
  }


  // Local filesystem fallback
  try {
    const filePath = path.join(DATA_DIR, fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading file ${fileName}:`, error);
    return defaultValue;
  }
}

export async function writeJson<T>(fileName: string, data: T): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${fileName}:`, error);
    return false;
  }
}

export async function readMarkdown(filePathFromData: string): Promise<string> {
  try {
    // If it's a blog post, try to read from MongoDB first
    if (filePathFromData.startsWith('blogs/') && filePathFromData.endsWith('.md')) {
      const slug = filePathFromData.replace('blogs/', '').replace('.md', '');
      await connectToDatabase();
      const blog = await models.Blog.findOne({ slug }).lean();
      if (blog && blog.content) {
        return blog.content;
      }
    }
  } catch (error) {
    console.warn(`[MongoDB Read] Failed to fetch markdown ${filePathFromData} from database. Falling back to local disk.`, error);
  }

  // Local filesystem fallback
  try {
    const filePath = path.join(DATA_DIR, filePathFromData);
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading markdown ${filePathFromData}:`, error);
    return '';
  }
}

export async function writeMarkdown(filePathFromData: string, content: string): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, filePathFromData);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing markdown ${filePathFromData}:`, error);
    return false;
  }
}
