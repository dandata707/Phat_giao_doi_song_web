import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CoverImage from '@/components/app/CoverImage';
import { solarToLunar, WEEKDAYS, pad } from '@/lib/lunar';

const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function MonthCard({ month, items }) {
  const [all, setAll] = useState(false);
  const shown = all ? items : items.slice(0, 3);
  return (
    <div className="w-full shrink-0 snap-start rounded-3xl border bg-card p-5 shadow-sm">
      <div className="flex items-baseline justify-between border-b pb-3">
        <h3 className="font-heading text-xl font-bold text-[#6b530a] dark:text-[#C9A227]">Tháng {month}</h3>
        <span className="text-sm text-muted-foreground">{items.length} sự kiện</span>
      </div>
      <div className="space-y-4 pt-4">
        {shown.map(({ a, date, lunar }) => (
          <Link key={a.id} to={`/bai/${a.id}`} className="flex items-center gap-3">
            <CoverImage src={a.cover_image} className="h-14 w-14 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-snug">{a.title}</p>
              <p className="text-xs text-muted-foreground">{WEEKDAYS[date.getDay()]}, {pad(date.getDate())}-{pad(month)} · Âm lịch {pad(lunar.day)}-{pad(lunar.month)}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
      {items.length > 3 && (
        <button onClick={() => setAll(!all)} className="mt-4 text-sm font-medium text-[#8A6D0B] dark:text-[#C9A227]">
          {all ? 'Thu gọn' : `+${items.length - 3} sự kiện khác`}
        </button>
      )}
    </div>
  );
}

export default function EventsSection() {
  const year = new Date().getFullYear();
  const { data } = useQuery({
    queryKey: ['events', year],
    queryFn: () => base44.entities.Article.filter(
      { event_date: { $gte: iso(new Date()), $lte: `${year}-12-31` }, status: { $nin: ['pending', 'rejected', 'removed'] } },
      { sort: 'event_date', limit: 100 }
    ),
  });
  const by = {};
  (data?.items ?? []).forEach((a) => {
    const date = parse(a.event_date);
    const lunar = solarToLunar(date.getDate(), date.getMonth() + 1, date.getFullYear());
    (by[date.getMonth() + 1] ||= []).push({ a, date, lunar });
  });
  const months = Object.entries(by);
  if (!months.length) return null;
  return (
    <section className="pt-6">
      <h2 className="px-5 font-heading text-xl font-bold">Sự kiện Phật giáo {year}</h2>
      <div className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2">
        {months.map(([m, items]) => <MonthCard key={m} month={Number(m)} items={items} />)}
      </div>
    </section>
  );
}