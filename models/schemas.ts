import mongoose, { Schema } from 'mongoose';

// 1. Admin
const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  profilePhoto: { type: String, default: '/images/default-avatar.png' }
}, { timestamps: true });

// 2. Hero
const HeroSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  ctaText1: { type: String },
  ctaLink1: { type: String },
  ctaText2: { type: String },
  ctaLink2: { type: String },
  videoUrl: { type: String },
  imageUrl: { type: String },
  stats: [{ value: String, label: String }]
}, { timestamps: true });

// 3. Company (About)
const CompanySchema = new Schema({
  name: { type: String, required: true },
  logoText: { type: String },
  aboutTitle: { type: String },
  aboutStory: { type: String },
  mdName: { type: String },
  mdTitle: { type: String },
  mdMessage: { type: String },
  mdImage: { type: String },
  mission: { type: String },
  vision: { type: String },
  coreValues: [{ title: String, description: String }],
  journeyTimeline: [{ year: String, title: String, description: String }]
}, { timestamps: true });

// 4. Service
const ServiceSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  image: { type: String },
  features: [{ type: String }],
  details: { type: String },
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: { type: String }
  }
}, { timestamps: true });

// 5. Project
const ProjectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  client: { type: String },
  category: { type: String },
  location: { type: String },
  completionYear: { type: String },
  description: { type: String },
  image: { type: String },
  gallery: [{ type: String }],
  features: [{ type: String }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

// 6. Gallery
const GallerySchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String },
  category: { type: String },
  image: { type: String, required: true },
  size: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

// 7. Career (Job listing)
const CareerSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String },
  department: { type: String },
  location: { type: String },
  type: { type: String }, // e.g. Full-Time, Contract
  experience: { type: String },
  salary: { type: String },
  description: { type: String },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

// 8. JobApplication
const JobApplicationSchema = new Schema({
  jobId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  coverLetter: { type: String },
  resumeUrl: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// 9. Blog
const BlogSchema = new Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String },
  category: { type: String },
  image: { type: String },
  banner: { type: String },
  content: { type: String }, // HTML / Markdown rich text
  date: { type: String },
  author: { type: String },
  readTime: { type: String },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: { type: String }
  }
}, { timestamps: true });

// 10. Contact
const ContactSchema = new Schema({
  phoneNumbers: [{ type: String }],
  email: { type: String },
  address: { type: String },
  mapEmbedUrl: { type: String },
  businessHours: { type: String },
  whatsappNumber: { type: String },
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String }
  }
}, { timestamps: true });

// 11. QuoteRequest (Contact Enquiries / Quote Requests)
const QuoteRequestSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  serviceInterest: { type: String },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' }
}, { timestamps: true });

// 12. Testimonial
const TestimonialSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String },
  company: { type: String },
  rating: { type: Number, default: 5 },
  quote: { type: String, required: true },
  image: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

// 13. Client
const ClientSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  industry: { type: String },
  logo: { type: String, required: true },
  website: { type: String },
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

// 14. SeoSetting
const SeoSettingSchema = new Schema({
  title: { type: String },
  description: { type: String },
  keywords: { type: String },
  ogImage: { type: String },
  favicon: { type: String },
  analyticsCode: { type: String },
  searchConsoleCode: { type: String }
}, { timestamps: true });

// 15. Media
const MediaSchema = new Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number },
  type: { type: String },
  uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

// 16. WebsiteSetting
const WebsiteSettingSchema = new Schema({
  logoText: { type: String },
  logoUrl: { type: String },
  faviconUrl: { type: String },
  loaderUrl: { type: String },
  footerDescription: { type: String },
  copyrightText: { type: String }
}, { timestamps: true });

// Register models
export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export const Hero = mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
export const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);
export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
export const Career = mongoose.models.Career || mongoose.model('Career', CareerSchema);
export const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
export const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
export const QuoteRequest = mongoose.models.QuoteRequest || mongoose.model('QuoteRequest', QuoteRequestSchema);
export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
export const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);
export const SeoSetting = mongoose.models.SeoSetting || mongoose.model('SeoSetting', SeoSettingSchema);
export const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema);
export const WebsiteSetting = mongoose.models.WebsiteSetting || mongoose.model('WebsiteSetting', WebsiteSettingSchema);
