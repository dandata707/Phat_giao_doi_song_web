import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { NewsTile } from '@/components/app/NewsCards';
import LunarCalendar from '@/components/app/LunarCalendar';
import EventsSection from '@/components/app/EventsSection';
import HeroGrid from '@/components/web/HeroGrid';
import CategorySection from '@/components/web/CategorySection';
import SideSuggestions from '@/components/social/SideSuggestions';
import { CATEGORIES } from '@/lib/pgds';

const LIVE = { $nin: ['pending', 'rejected', 'removed'] };

export default function Home() {
  const { data: featured = [] } = useQuery({
    queryKey: ['featured'],
    queryFn: async () => (await base44.entities.Article.filter({ featured: true, status: LIVE }, { sort: '-created_date', limit: 5 })).items,
  });
  const { data: latest = [], isLoading } = useQuery({
    queryKey: ['latest'],
    queryFn: async () => (await base44.entities.Article.filter({ status: LIVE }, { sort: '-created_date', limit: 9 })).items,
  });

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8 xl:px-10">
      <HeroGrid items={featured} />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <section>
            <div className="flex items-center justify-between border-b-2 border-[#C9A227] pb-2">
              <h2 className="font-heading text-xl font-bold uppercase">Bài mới đăng</h2>
              <Link to="/tin-tuc" className="text-sm font-medium text-[#8A6D0B] dark:text-[#C9A227]">Tất cả →</Link>
            </div>
            {isLoading && <p className="py-6 text-sm text-muted-foreground">Đang tải tin...</p>}
            <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{latest.map((a) => <NewsTile key={a.id} a={a} />)}</div>
          </section>
          {CATEGORIES.slice(0, 4).map((c) => <CategorySection key={c.name} cat={c.name} />)}
        </div>
        <aside className="space-y-6">
          <LunarCalendar />
          <EventsSection />
          <SideSuggestions />
        </aside>
      </div>
    </div>
  );
}