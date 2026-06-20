import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import {
  Admin,
  Hero,
  Company,
  Service,
  Project,
  Gallery,
  Career,
  Blog,
  Contact,
  Testimonial,
  Client,
  SeoSetting,
  WebsiteSetting
} from '../models/schemas';

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJsonFile<T>(fileName: string, defaultValue: T): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.warn(`[Seeder] Warning: could not read ${fileName}, using fallback data.`);
    return defaultValue;
  }
}

export async function seedDatabase() {
  try {
    console.log('[Seeder] Checking database for seeding...');

    // 1. Admin seeding
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('[Seeder] Seeding default admin user...');
      const passwordHash = await bcrypt.hash('admin123', 10);
      await Admin.create({
        name: 'Administrator',
        email: 'admin@shreenivibuildtech.com',
        phone: '+919917732000',
        passwordHash,
        profilePhoto: '/images/default-avatar.png'
      });
      console.log('[Seeder] Admin user seeded: admin@shreenivibuildtech.com / admin123');
    }

    // 2. Hero seeding
    const heroCount = await Hero.countDocuments();
    if (heroCount === 0) {
      console.log('[Seeder] Seeding Hero data...');
      const defaultHero = {
        title: "Engineering Tomorrow's Steel Structures",
        subtitle: "Delivering world-class Pre-Engineered Buildings, Warehouses, Industrial Sheds, Steel Fabrication and Structural Engineering Solutions with over 25+ years of excellence.",
        ctaText1: "Explore Projects",
        ctaLink1: "/projects",
        ctaText2: "Contact Us",
        ctaLink2: "/contact",
        videoUrl: "",
        imageUrl: "/images/peb-hero.png",
        stats: [
          { value: "25+", label: "Years Experience" },
          { value: "250+", label: "Ton Monthly Fabrication Capacity" },
          { value: "60+", label: "Projects Completed Every Year" },
          { value: "100%", label: "Customer Satisfaction" }
        ]
      };
      const heroData = await readJsonFile('hero.json', defaultHero);
      await Hero.create(heroData);
      console.log('[Seeder] Hero data seeded.');
    }

    // 3. Company seeding
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      console.log('[Seeder] Seeding Company data...');
      const defaultCompany = {
        name: "Shree Nivi Buildtech",
        logoText: "SHREE NIVI BUILDTECH",
        aboutTitle: "Engineered for Strength. Designed for Scale.",
        aboutStory: "Established in 2001, Shree Nivi Buildtech has grown to become a premier leader in the infrastructure sector. We specialize in Pre-Engineered Buildings (PEB), complex steel structural works, and heavy industrial fabrication...",
        mdName: "K. N. Viswanathan",
        mdTitle: "Founder & Managing Director",
        mdMessage: "At Shree Nivi Buildtech, we believe steel is more than just a structural element; it is the skeleton of our country's economic future.",
        mdImage: "/images/md.jpg",
        mission: "To design, manufacture, and erect the safest, most durable steel structures using sustainable engineering and automation...",
        vision: "To lead the global transition toward smart, rapid-build steel infrastructure, delivering eco-friendly, zero-defect structures...",
        coreValues: [],
        journeyTimeline: []
      };
      const companyData = await readJsonFile('company.json', defaultCompany);
      await Company.create(companyData);
      console.log('[Seeder] Company data seeded.');
    }

    // 4. Services seeding
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('[Seeder] Seeding Services data...');
      const servicesData = await readJsonFile<any[]>('services.json', []);
      if (servicesData.length > 0) {
        const formattedServices = servicesData.map((s, idx) => ({
          id: s.id || `service-${idx}`,
          title: s.title || '',
          description: s.description || '',
          icon: s.icon || 'Building',
          image: s.image || '',
          features: s.features || [],
          details: s.details || '',
          displayOrder: idx,
          status: 'active',
          seo: {
            title: s.title || '',
            description: s.description || '',
            keywords: `${s.title}, PEB construction`
          }
        }));
        await Service.insertMany(formattedServices);
        console.log(`[Seeder] Seeded ${formattedServices.length} services.`);
      }
    }

    // 5. Projects seeding
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log('[Seeder] Seeding Projects data...');
      const projectsData = await readJsonFile<any[]>('projects.json', []);
      if (projectsData.length > 0) {
        const formattedProjects = projectsData.map((p, idx) => ({
          id: p.id || `project-${idx}`,
          title: p.title || '',
          client: p.client || '',
          category: p.category || '',
          location: p.location || '',
          completionYear: p.completionYear || '',
          description: p.description || '',
          image: p.image || '',
          gallery: p.gallery || [],
          features: p.features || [],
          featured: p.featured || false,
          status: 'active'
        }));
        await Project.insertMany(formattedProjects);
        console.log(`[Seeder] Seeded ${formattedProjects.length} projects.`);
      }
    }

    // 6. Gallery seeding
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      console.log('[Seeder] Seeding Gallery data...');
      const galleryData = await readJsonFile<any[]>('gallery.json', []);
      if (galleryData.length > 0) {
        const formattedGallery = galleryData.map((g, idx) => ({
          id: g.id || `gallery-${idx}`,
          title: g.title || '',
          category: g.category || '',
          image: g.image || '',
          size: g.size || 'medium',
          displayOrder: idx,
          status: 'active'
        }));
        await Gallery.insertMany(formattedGallery);
        console.log(`[Seeder] Seeded ${formattedGallery.length} gallery items.`);
      }
    }

    // 7. Careers seeding
    const careerCount = await Career.countDocuments();
    if (careerCount === 0) {
      console.log('[Seeder] Seeding Careers data...');
      const careersData = await readJsonFile<any[]>('careers.json', []);
      if (careersData.length > 0) {
        const formattedCareers = careersData.map((c, idx) => ({
          id: c.id || `career-${idx}`,
          title: c.title || '',
          category: c.category || '',
          department: c.department || '',
          location: c.location || '',
          type: c.type || 'Full-Time',
          experience: c.experience || '',
          salary: 'Negotiable',
          description: c.description || '',
          requirements: c.requirements || [],
          responsibilities: c.responsibilities || [],
          status: 'active'
        }));
        await Career.insertMany(formattedCareers);
        console.log(`[Seeder] Seeded ${formattedCareers.length} job postings.`);
      }
    }

    // 8. Blogs seeding
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('[Seeder] Seeding Blogs data...');
      const blogsData = await readJsonFile<any[]>('blogs.json', []);
      if (blogsData.length > 0) {
        const formattedBlogs = blogsData.map((b, idx) => ({
          id: b.id || `blog-${idx}`,
          slug: b.slug || `blog-post-${idx}`,
          title: b.title || '',
          summary: b.summary || '',
          category: b.category || '',
          image: b.image || '',
          banner: b.image || '',
          content: b.summary || '',
          date: b.date || '',
          author: b.author || 'Admin',
          readTime: b.readTime || '5 mins',
          tags: b.tags || [],
          featured: b.featured || false,
          status: 'published',
          seo: {
            title: b.title || '',
            description: b.summary || '',
            keywords: (b.tags || []).join(', ')
          }
        }));
        await Blog.insertMany(formattedBlogs);
        console.log(`[Seeder] Seeded ${formattedBlogs.length} blog posts.`);
      }
    }

    // 9. Testimonials seeding
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      console.log('[Seeder] Seeding Testimonials...');
      const testimonialsData = await readJsonFile<any[]>('testimonials.json', []);
      if (testimonialsData.length > 0) {
        const formattedTestimonials = testimonialsData.map((t, idx) => ({
          id: t.id || `testimonial-${idx}`,
          name: t.name || '',
          role: t.role || '',
          company: t.company || '',
          rating: t.rating || 5,
          quote: t.quote || '',
          image: t.image || '',
          status: 'active'
        }));
        await Testimonial.insertMany(formattedTestimonials);
        console.log(`[Seeder] Seeded ${formattedTestimonials.length} testimonials.`);
      }
    }

    // 10. Clients seeding
    const clientCount = await Client.countDocuments();
    if (clientCount === 0) {
      console.log('[Seeder] Seeding Clients...');
      const clientsData = await readJsonFile<any[]>('clients.json', []);
      if (clientsData.length > 0) {
        const formattedClients = clientsData.map((c, idx) => ({
          id: c.id || `client-${idx}`,
          name: c.name || '',
          industry: c.industry || '',
          logo: c.logo || '',
          website: '#',
          displayOrder: idx,
          status: 'active'
        }));
        await Client.insertMany(formattedClients);
        console.log(`[Seeder] Seeded ${formattedClients.length} client partners.`);
      }
    }

    // 11. Contact Settings seeding
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      console.log('[Seeder] Seeding Contact settings...');
      await Contact.create({
        phoneNumbers: ['+91 44 2220 1900', '+91 98765 43210'],
        email: 'inquiry@shreenivibuildtech.com',
        address: '104, Industrial Estate Phase II, Guindy, Chennai, Tamil Nadu - 600032',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.234674391629!2d80.20790831525946!3d12.988888790844784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526760df768f51%3A0xc34dbd5351a029cf!2sGuindy%20Industrial%20Estate%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1655555555555!5m2!1sen!2sin',
        businessHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
        whatsappNumber: '+914422201900',
        socialLinks: {
          facebook: 'https://facebook.com/shreenivi',
          twitter: 'https://twitter.com/shreenivi',
          linkedin: 'https://linkedin.com/company/shreenivi',
          instagram: 'https://instagram.com/shreenivi'
        }
      });
      console.log('[Seeder] Contact settings seeded.');
    }

    // 12. SEO Settings seeding
    const seoCount = await SeoSetting.countDocuments();
    if (seoCount === 0) {
      console.log('[Seeder] Seeding SEO settings...');
      await SeoSetting.create({
        title: 'Shree Nivi Buildtech | PEB & Steel Structure Engineering',
        description: 'World-class Pre-Engineered Buildings, Warehouses, Industrial Sheds, and Steel Fabrication Solutions with over 25+ years of excellence.',
        keywords: 'Pre-Engineered Buildings, PEB, Steel Structures, Chennai, Industrial Construction',
        ogImage: '/images/peb-hero.png',
        favicon: '/favicon.ico',
        analyticsCode: '',
        searchConsoleCode: ''
      });
      console.log('[Seeder] SEO settings seeded.');
    }

    // 13. Website Settings seeding
    const settingsCount = await WebsiteSetting.countDocuments();
    if (settingsCount === 0) {
      console.log('[Seeder] Seeding Website settings...');
      await WebsiteSetting.create({
        logoText: 'SHREE NIVI BUILDTECH',
        logoUrl: '',
        faviconUrl: '/favicon.ico',
        loaderUrl: '',
        footerDescription: 'Engineered for Strength. Designed for Scale. Since 2001.',
        copyrightText: '© 2026 Shree Nivi Buildtech. All rights reserved.'
      });
      console.log('[Seeder] Website settings seeded.');
    }

    console.log('[Seeder] Seeding check completed successfully.');
  } catch (error) {
    console.error('[Seeder] Error checking/seeding database:', error);
  }
}
