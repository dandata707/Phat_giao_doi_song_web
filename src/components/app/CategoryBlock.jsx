import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ArticlePost from '@/components/app/ArticlePost';

export default function CategoryBlock({ cat }) {
  const { data: items = [] } = useQuery({
    queryKey: ['cat-block', cat],
    queryFn: async () => (await base44.entities.Article.filter({ category: cat, status: { $nin: ['hidden', 'pending', 'rejected', 'removed'] } }, { sort: '-created_date', limit: 3 })).items,
  });
  if (!items.length) return null;
  return (
    <section className="pt-6">
      <div className="mx-5 mb-3 flex items-center justify-between border-l-4 border-[#C9A227] pl-3">
        <h2 className="font-heading text-lg font-bold">{cat}</h2>
        <Link to={`/tin-tuc?cat=${encodeURIComponent(cat)}`} className="flex items-center text-sm font-medium text-[#8A6D0B] dark:text-[#C9A227]">Xem thêm<ChevronRight className="h-4 w-4" /></Link>
      </div>
      <div className="space-y-2 bg-muted/60 py-2">
        {items.map((a) => <ArticlePost key={a.id} a={a} />)}
      </div>
    </section>
  );
}