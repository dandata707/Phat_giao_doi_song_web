import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function HomeForum() {
  const { data = [] } = useQuery({
    queryKey: ['home-forum'],
    queryFn: async () => (await base44.entities.Topic.filter({ forum: 'public' }, { sort: '-score', limit: 5 })).items,
  });
  return (
    <section className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-bold">Diễn đàn</h3>
        <Link to="/cong-dong?tab=forum" className="text-xs font-medium text-[#8A6D0B] dark:text-[#C9A227]">Xem tất cả</Link>
      </div>
      {data.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">Chưa có chủ đề nào.</p>}
      <div className="mt-2 divide-y">
        {data.map((t) => (
          <Link key={t.id} to={`/chu-de/${t.id}`} className="block py-3">
            <p className="line-clamp-2 text-sm font-semibold leading-snug">{t.title}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MessageSquare className="h-3 w-3" />{t.reply_count || 0} trả lời · {t.author_name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}