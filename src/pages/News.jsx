import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import moment from 'moment';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { NewsLead, NewsTile, NewsRow } from '@/components/app/NewsCards';
import LunarCalendar from '@/components/app/LunarCalendar';
import SideSuggestions from '@/components/social/SideSuggestions';
import { CATEGORIES, pageOpts, flat } from '@/lib/pgds';

const nav = (on) => `shrink-0 border-b-2 px-4 py-3 text-[13px] font-bold uppercase tracking-wide ${on ? 'border-[#C9A227] text-[#8A6D0B] dark:text-[#C9A227]' : 'border-transparent text-muted-foreground hover:text-foreground'}`;
const subNav = (on) => `shrink-0 rounded-full px-4 py-1.5 text-xs ${on ? 'bg-[#C9A227] text-[#2b2108]' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`;

export default function News() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') || '';
  const sub = params.get('sub') || '';
  const subs = CATEGORIES.find((c) => c.name === cat)?.subs || [];

  const q = useInfiniteQuery({
    queryKey: ['news', cat, sub],
    ...pageOpts((cursor) => {
      const query = { status: { $nin: ['pending', 'rejected', 'removed'] } };
      if (cat) query.category = cat;
      if (sub) query.subcategory = sub;
      return base44.entities.Article.filter(query, { sort: '-created_date', limit: 12, cursor });
    }),
  });
  const items = flat(q.data);
  const [lead, ...rest] = items;
  const side = rest.slice(0, 4);
  const grid = rest.slice(4);

  return (
    <div className="mx-auto max-w-[1600px] px-6 xl:px-10">
      <div className="flex items-end justify-between pb-4 pt-8">
        <h1 className="font-heading text-4xl font-bold tracking-tight">{sub || cat || 'Tin tức mới nhất'}</h1>
        <span className="text-sm capitalize text-muted-foreground">{moment().format('dddd, DD/MM/YYYY')}</span>
      </div>
      <nav className="no-scrollbar sticky top-16 z-20 flex overflow-x-auto border-b bg-background">
        <button className={nav(!cat)} onClick={() => setParams({})}>Mới nhất</button>
        {CATEGORIES.map((c) => <button key={c.name} className={nav(cat === c.name)} onClick={() => setParams({ cat: c.name })}>{c.name}</button>)}
      </nav>
      {subs.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4">
          <button className={subNav(!sub)} onClick={() => setParams({ cat })}>Tất cả</button>
          {subs.map((s) => <button key={s} className={subNav(sub === s)} onClick={() => setParams({ cat, sub: s })}>{s}</button>)}
        </div>
      )}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {q.isLoading && <p className="py-10 text-center text-sm text-muted-foreground">Đang tải...</p>}
          {!q.isLoading && items.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Chưa có bài viết trong mục này.</p>}
          {lead && (
            <div className="grid gap-8 border-b pb-8 xl:grid-cols-[3fr_2fr]">
              <NewsLead a={lead} />
              <div>{side.map((a) => <NewsRow key={a.id} a={a} />)}</div>
            </div>
          )}
          {grid.length > 0 && <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{grid.map((a) => <NewsTile key={a.id} a={a} />)}</div>}
          {q.hasNextPage && <Button variant="outline" className="mt-8 w-full rounded-full" disabled={q.isFetchingNextPage} onClick={() => q.fetchNextPage()}>Xem thêm tin</Button>}
        </div>
        <aside className="space-y-6"><LunarCalendar /><SideSuggestions /></aside>
      </div>
    </div>
  );
}