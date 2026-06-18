import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readJson, readMarkdown } from '@/lib/fs';
import { BlogPost } from '@/types';
import { parseMarkdownToHtml } from '@/lib/markdown';
import ScrollReveal from '@/components/animations/ScrollReveal';
import GlowCard from '@/components/ui/GlowCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Tag } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const posts = await readJson<BlogPost[]>('blogs.json', []);
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  // Load blog database
  const posts = await readJson<BlogPost[]>('blogs.json', []);
  const postIndex = posts.findIndex(p => p.slug === slug);
  const post = posts[postIndex];

  if (!post) {
    notFound();
  }

  // Load article body from local Markdown file
  const markdownBody = await readMarkdown(`blogs/${slug}.md`);
  const articleHtml = parseMarkdownToHtml(markdownBody);

  // Compute related articles
  const relatedPosts = posts.filter(p => p.id !== post.id).slice(0, 2);

  return (
    <div className="w-full relative overflow-hidden py-12">
      {/* Background CAD Grids */}
      <div className="animated-grid opacity-30" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-industrial-orange transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </Link>


        {/* Article Header */}
        <ScrollReveal variant="blur-reveal" className="flex flex-col gap-4 mb-8">
          <span className="text-xs font-bold text-industrial-orange uppercase tracking-widest px-2.5 py-1 rounded-full border border-industrial-orange/30 bg-industrial-orange/10 self-start">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>
          
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 border-y border-slate-200 dark:border-white/5 py-4 mt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-industrial-orange" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-industrial-orange" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-industrial-orange" />
              {post.readTime}
            </span>
          </div>
        </ScrollReveal>

        {/* Article Content Layout */}
        <ScrollReveal variant="slide-up">
          <article className="prose max-w-none dark:prose-invert">
            {/* Displaying Rendered Markdown */}
            <div
              className="flex flex-col gap-6"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />
          </article>
        </ScrollReveal>

        {/* Tags bar */}
        <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-200 dark:border-white/5 pt-8 mt-12">
          <Tag className="w-4 h-4 text-slate-400 mr-1" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 uppercase"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Posts block */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-slate-200 dark:border-white/5 pt-12 mt-16">
            <h3 className="text-xl font-bold uppercase text-slate-900 dark:text-white tracking-wide mb-8 border-l-3 border-industrial-orange pl-3">
              Suggested Reading
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {relatedPosts.map((rel) => (
                <GlowCard key={rel.id} className="overflow-hidden border border-slate-200 dark:border-white/5 p-6 flex flex-col justify-between group h-full">
                  <div className="flex flex-col gap-4">
                    <span className="text-[9px] font-bold text-industrial-orange uppercase tracking-wider px-2 py-0.5 rounded bg-industrial-orange/15 border border-industrial-orange/20 self-start">
                      {rel.category}
                    </span>
                    <Link href={`/blog/${rel.slug}`}>
                      <h4 className="font-bold uppercase tracking-wide text-slate-900 dark:text-white group-hover:text-industrial-orange transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {rel.summary}
                    </p>
                  </div>
                  
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-industrial-orange flex items-center gap-1 group/relbtn mt-6"
                  >
                    Read Post
                    <ArrowRight className="w-3.5 h-3.5 group-hover/relbtn:translate-x-1 transition-transform" />
                  </Link>
                </GlowCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
