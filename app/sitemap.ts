import { MetadataRoute } from 'next';
import { readJson } from '@/lib/fs';
import { BlogPost } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shreenivibuildtech.com';

  // Read blog database to include dynamic slugs
  const posts = await readJson<BlogPost[]>('blogs.json', []);
  
  const blogUrls = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const coreRoutes = ['', '/about', '/services', '/projects', '/gallery', '/careers', '/blog', '/contact'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...coreRoutes, ...blogUrls];
}
