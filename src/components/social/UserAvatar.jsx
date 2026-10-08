import React from 'react';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';

export default function UserAvatar({ src, name = '?', className }) {
  if (src) return <Image src={src} alt={name} className={cn('rounded-full object-cover', className)} />;
  return (
    <div className={cn('flex items-center justify-center rounded-full bg-[#C9A227] font-heading font-bold text-[#2b2108]', className)}>
      {name[0]?.toUpperCase()}
    </div>
  );
}