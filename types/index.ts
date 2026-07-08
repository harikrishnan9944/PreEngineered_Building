export interface StatItem {
  value: string;
  label: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  ctaText1: string;
  ctaLink1: string;
  ctaText2: string;
  ctaLink2: string;
  videoUrl: string;
  imageUrl: string;
  stats: StatItem[];
  logoText?: string;
  logoUrl?: string;
}

export interface CoreValue {
  title: string;
  description: string;
}

export interface JourneyYear {
  year: string;
  title: string;
  description: string;
}

export interface CompanyData {
  name: string;
  logoText: string;
  aboutTitle: string;
  aboutStory: string;
  mdName: string;
  mdTitle: string;
  mdMessage: string;
  mdImage: string;
  mission: string;
  vision: string;
  coreValues: CoreValue[];
  journeyTimeline: JourneyYear[];
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  details: string;
}

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  location: string;
  client: string;
  completionYear: string;
  features: string[];
  gallery: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  size: 'small' | 'medium' | 'large';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
}

export interface ClientPartner {
  id: string;
  name: string;
  industry: string;
  logo: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  quote: string;
  image: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  serviceInterest?: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
}

export interface JobListing {
  id: string;
  title: string;
  category: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  image?: string;
  badge?: string;
}

export interface CareerApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeUrl: string;
  timestamp: string;
}
