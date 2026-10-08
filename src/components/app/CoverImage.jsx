import React, { useState } from 'react';
import { Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CoverImage({ src, className, alt = '' }) {
  const [bad, setBad] = useState(!src);
  if (bad) {
    return (
      <div className={cn('flex items-center justify-center bg-gradient-to-br from-[#C9A227]/50 to-[#C9A227]/10', className)}>
        <Flower2 className="h-8 w-8 text-[#8A6D0B]/60" />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={cn('object-cover', className)} />;
}