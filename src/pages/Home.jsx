import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, RefreshCw, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ArticleCard from '@/components/app/ArticleCard';
import ArticlePost from '@/components/app/ArticlePost';
import LunarCalendar from '@/components/app/LunarCalendar';
import EventsSection from '@/components/app/EventsSection';
import CategoryBlock from '@/components/app/CategoryBlock';
import { CATEGORIES, LOGO_URL } from '@/lib/pgds';

export default function Home() {
  const qc = useQueryClient();
  const { data: featured = [] } = useQuery({
    queryKey: ['featured'],
    queryFn: async () => (await base44.entities.Article.filter({ featured: true, status: { $nin: ['pending', 'rejected', 'removed'] } }, { sort: '-created_date', limit: 5 })).items,
  });
  const { data: latest = [], isLoading } = useQuery({
    queryKey: ['latest'],
    queryFn: async () => (await base44.entities.Article.filter({ status: { $nin: ['pending', 'rejected', 'removed'] } }, { sort: '-created_date', limit: 6 })).items,
  });

  return (
    <div>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-background/90 px-5 backdrop-blur">
        <div className="flex-1"><img src={LOGO_URL} alt="Phật Giáo Đời Sống" className="h-11 w-auto" /></div>
        <button aria-label="Làm mới" onClick={() => qc.invalidateQueries()} className="rounded-full p-2 active:bg-muted"><RefreshCw className="h-5 w-5" /></button>
        <Link to="/tim-kiem" aria-label="Tìm kiếm" className="rounded-full p-2 active:bg-muted"><Search className="h-5 w-5" /></Link>
      </header>

      <LunarCalendar />

      <section className="mt-4">
        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-5 pb-2">
          {featured.map((a) => <ArticleCard key={a.id} a={a} variant="hero" />)}
        </div>
      </section>

      <EventsSection />

      <section className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">Bài mới đăng</h2>
          <Link to="/tin-tuc" className="flex items-center text-sm font-medium text-[#8A6D0B] dark:text-[#C9A227]">Tất cả<ChevronRight className="h-4 w-4" /></Link>
        </div>
        {isLoading && <p className="py-6 text-sm text-muted-foreground">Đang tải tin...</p>}
      </section>
      <div className="mt-3 space-y-2 bg-muted/60 py-2">
        {latest.map((a) => <ArticlePost key={a.id} a={a} />)}
      </div>

      {CATEGORIES.slice(0, 4).map((c) => <CategoryBlock key={c.name} cat={c.name} />)}
    </div>
  );
}