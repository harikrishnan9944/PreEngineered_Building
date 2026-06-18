'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest my-4">
      <Link href="/" className="flex items-center gap-1 hover:text-industrial-orange transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-350 dark:text-slate-600 shrink-0" />
            {isLast || !item.href ? (
              <span className="text-slate-700 dark:text-slate-300 font-bold max-w-[200px] truncate">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-industrial-orange transition-colors max-w-[200px] truncate">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
