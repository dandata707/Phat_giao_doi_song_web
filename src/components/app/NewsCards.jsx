import React from 'react';
import { Link } from 'react-router-dom';
import CoverImage from '@/components/app/CoverImage';
import ContentMenu from '@/components/app/ContentMenu';
import { timeAgo } from '@/lib/pgds';

const Cat = ({ a }) => <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A6D0B] dark:text-[#C9A227]">{a.subcategory || a.category}</p>;
const Meta = ({ a }) => (
  <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
    <span className="truncate">{a.author_name} · {timeAgo(a.created_date)}</span>
    <ContentMenu targetType="article" targetId={a.id} authorEmail={a.author_email} />
  </div>
);

export function NewsLead({ a }) {
  return (
    <div className="border-b pb-4">
      <Link to={`/bai/${a.id}`} className="block">
        <CoverImage src={a.cover_image} className="aspect-[16/10] w-full" />
        <div className="pt-3"><Cat a={a} />
          <h2 className="mt-1 font-heading text-2xl font-bold leading-tight">{a.title}</h2>
          {a.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>}
        </div>
      </Link>
      <Meta a={a} />
    </div>
  );
}

export function NewsTile({ a }) {
  return (
    <div className="min-w-0">
      <Link to={`/bai/${a.id}`} className="block">
        <CoverImage src={a.cover_image} className="aspect-[4/3] w-full" />
        <div className="pt-2"><Cat a={a} /><h3 className="mt-1 line-clamp-4 font-heading text-[15px] font-semibold leading-snug">{a.title}</h3></div>
      </Link>
      <Meta a={a} />
    </div>
  );
}

export function NewsRow({ a }) {
  return (
    <div className="border-b py-3 last:border-0">
      <div className="flex gap-3">
        <Link to={`/bai/${a.id}`} className="min-w-0 flex-1"><Cat a={a} />
          <h3 className="mt-1 line-clamp-3 font-heading text-[15px] font-semibold leading-snug">{a.title}</h3>
          {a.excerpt && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.excerpt}</p>}
        </Link>
        <Link to={`/bai/${a.id}`}><CoverImage src={a.cover_image} className="h-20 w-28 shrink-0" /></Link>
      </div>
      <Meta a={a} />
    </div>
  );
}