import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CoverImage from '@/components/app/CoverImage';
import { pad } from '@/lib/lunar';

const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

export default function HomeEvents() {
  const { data = [] } = useQuery({
    queryKey: ['home-events'],
    queryFn: async () => (await base44.entities.Article.filter(
      { event_date: { $gte: today() }, status: { $nin: ['pending', 'rejected', 'removed'] } },
      { sort: 'event_date', limit: 5 })).items,
  });
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h3 className="font-heading text-base font-bold">Sự kiện nổi bật</h3>
      {data.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">Chưa có sự kiện sắp tới.</p>}
      <div className="mt-3 space-y-3">
        {data.map((a) => {
          const [, m, d] = a.event_date.split('-');
          return (
            <Link key={a.id} to={`/bai/${a.id}`} className="flex items-center gap-3">
              <CoverImage src={a.cover_image} className="h-14 w-14 shrink-0 rounded-xl" />
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold leading-snug">{a.title}</p>
                <p className="text-xs text-[#8A6D0B] dark:text-[#C9A227]">{d}/{m}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}