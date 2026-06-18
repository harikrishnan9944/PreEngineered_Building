'use client';

import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = '', size }: IconProps) {
  // Resolve icon component dynamically from Lucide library
  const LucideIcon = (Icons as any)[name];

  if (!LucideIcon) {
    // Return a generic fallback icon if not found
    const FallbackIcon = Icons.HelpCircle;
    return <FallbackIcon className={className} size={size} />;
  }

  return <LucideIcon className={className} size={size} />;
}
