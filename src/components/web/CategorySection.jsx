import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { NewsTile } from '@/components/app/NewsCards';

export default function CategorySection({ cat }) {
  const { data = [] } = useQuery({
    queryKey: ['cat-block', cat],
    queryFn: async () => (await base44.entities.Article.filter({ category: cat, status: { $nin: ['pending', 'rejected', 'removed'] } }, { sort: '-created_date', limit: 4 })).items,
  });
  if (!data.length) return null;
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between border-b-2 border-[#C9A227] pb-2">
        <h2 className="font-heading text-xl font-bold uppercase">{cat}</h2>
        <Link to={`/tin-tuc?cat=${encodeURIComponent(cat)}`} className="text-sm font-medium text-[#8A6D0B] dark:text-[#C9A227]">Xem thêm →</Link>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{data.map((a) => <NewsTile key={a.id} a={a} />)}</div>
    </section>
  );
}