import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import moment from 'moment';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { NewsLead, NewsTile, NewsRow } from '@/components/app/NewsCards';
import { CATEGORIES, LOGO_URL, pageOpts, flat } from '@/lib/pgds';

const nav = (on) => `shrink-0 border-b-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wide ${on ? 'border-[#C9A227] text-[#8A6D0B] dark:text-[#C9A227]' : 'border-transparent text-muted-foreground'}`;
const subNav = (on) => `shrink-0 rounded-sm px-3 py-1 text-xs ${on ? 'bg-[#C9A227] text-[#2b2108]' : 'bg-muted text-muted-foreground'}`;

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
      return base44.entities.Article.filter(query, { sort: '-created_date', limit: 10, cursor });
    }),
  });
  const items = flat(q.data);
  const [lead, ...rest] = items;
  const tiles = rest.slice(0, 4);
  const list = rest.slice(4);

  return (
    <div>
      <header className="border-b-4 border-double border-foreground/70 px-5 pb-3 pt-4 text-center">
        <div className="flex items-center justify-between text-[11px] capitalize text-muted-foreground">
          <span>{moment().format('dddd, DD/MM/YYYY')}</span>
          <Link to="/tim-kiem" aria-label="Tìm kiếm" className="rounded-full p-1"><Search className="h-4 w-4" /></Link>
        </div>
        <img src={LOGO_URL} alt="" className="mx-auto mt-1 h-10 w-auto" />
        <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight">Phật Giáo Đời Sống</h1>
      </header>
      <nav className="no-scrollbar sticky top-0 z-10 flex overflow-x-auto border-b bg-background px-3">
        <button className={nav(!cat)} onClick={() => setParams({})}>Mới nhất</button>
        {CATEGORIES.map((c) => <button key={c.name} className={nav(cat === c.name)} onClick={() => setParams({ cat: c.name })}>{c.name}</button>)}
      </nav>
      {subs.length > 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-3">
          <button className={subNav(!sub)} onClick={() => setParams({ cat })}>Tất cả</button>
          {subs.map((s) => <button key={s} className={subNav(sub === s)} onClick={() => setParams({ cat, sub: s })}>{s}</button>)}
        </div>
      )}
      <div className="space-y-4 px-5 pt-4">
        {q.isLoading && <p className="py-10 text-center text-sm text-muted-foreground">Đang tải...</p>}
        {!q.isLoading && items.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Chưa có bài viết trong mục này.</p>}
        {lead && <NewsLead a={lead} />}
        {tiles.length > 0 && <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-b pb-4">{tiles.map((a) => <NewsTile key={a.id} a={a} />)}</div>}
        {list.length > 0 && <div><h3 className="mb-1 border-l-4 border-[#C9A227] pl-2 font-heading text-base font-bold uppercase">Tin mới</h3>{list.map((a) => <NewsRow key={a.id} a={a} />)}</div>}
        {q.hasNextPage && <Button variant="outline" className="w-full rounded-sm" disabled={q.isFetchingNextPage} onClick={() => q.fetchNextPage()}>Xem thêm tin</Button>}
      </div>
    </div>
  );
}