import React from 'react';
import { Link } from 'react-router-dom';
import CoverImage from '@/components/app/CoverImage';
import { timeAgo } from '@/lib/pgds';

function Tile({ a, big }) {
  return (
    <Link to={`/bai/${a.id}`} className={`group relative block overflow-hidden rounded-3xl ${big ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
      <CoverImage src={a.cover_image} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <span className="rounded-full bg-[#C9A227] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#2b2108]">{a.subcategory || a.category}</span>
        <h3 className={`mt-3 line-clamp-3 font-heading font-semibold leading-snug ${big ? 'text-3xl' : 'text-lg'}`}>{a.title}</h3>
        <p className="mt-2 text-xs text-white/75">{a.author_name} · {timeAgo(a.created_date)}</p>
      </div>
    </Link>
  );
}

export default function HeroGrid({ items }) {
  if (!items.length) return null;
  const [first, ...rest] = items;
  return (
    <div className="grid h-[640px] grid-cols-1 gap-4 lg:h-[560px] lg:grid-cols-4 lg:grid-rows-2">
      <Tile a={first} big />
      {rest.slice(0, 4).map((a) => <Tile key={a.id} a={a} />)}
    </div>
  );
}