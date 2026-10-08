import React from 'react';
import { Link } from 'react-router-dom';
import CoverImage from '@/components/app/CoverImage';
import { timeAgo } from '@/lib/pgds';

export default function ArticleCard({ a, variant = 'row' }) {
  if (variant === 'hero') {
    return (
      <Link to={`/bai/${a.id}`} className="relative block aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl">
        <CoverImage src={a.cover_image} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <span className="rounded-full bg-[#C9A227] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#2b2108]">{a.subcategory || a.category}</span>
          <h3 className="mt-3 line-clamp-3 font-heading text-xl font-semibold leading-snug">{a.title}</h3>
          <p className="mt-2 text-xs text-white/75">{a.author_name} · {timeAgo(a.created_date)}</p>
        </div>
      </Link>
    );
  }
  return (
    <Link to={`/bai/${a.id}`} className="flex gap-3 border-b border-border/60 py-4 last:border-0 active:opacity-70">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A6D0B] dark:text-[#C9A227]">{a.subcategory || a.category}</p>
        <h3 className="mt-1 line-clamp-3 font-heading text-[15px] font-semibold leading-snug">{a.title}</h3>
        <p className="mt-2 text-xs text-muted-foreground">{a.author_name} · {timeAgo(a.created_date)}</p>
      </div>
      <CoverImage src={a.cover_image} className="h-24 w-24 shrink-0 rounded-2xl" />
    </Link>
  );
}