import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flame, Clock, TrendingUp, MessagesSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import NewTopicDialog from '@/components/app/NewTopicDialog';
import TopicCard from '@/components/app/TopicCard';
import { useMe, LOGO_URL } from '@/lib/pgds';

const SORTS = [['-score', 'Nổi bật', Flame], ['-created_date', 'Mới', Clock], ['-reply_count', 'Bàn luận nhiều', TrendingUp]];
const chip = (on) => `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${on ? 'bg-muted text-foreground ring-1 ring-border' : 'text-muted-foreground'}`;

export default function ForumTab() {
  const { data: me } = useMe();
  const [forum, setForum] = useState('public');
  const [sort, setSort] = useState('-score');
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics', forum, sort],
    queryFn: async () => (await base44.entities.Topic.filter({ forum }, { sort, limit: 30 })).items,
  });

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="h-16 bg-gradient-to-r from-[#C9A227] to-[#8A6D0B]" />
        <div className="flex items-end gap-3 px-4 pb-3">
          <img src={LOGO_URL} alt="" className="-mt-7 h-14 w-14 rounded-full border-4 border-card bg-card object-contain" />
          <div className="min-w-0 flex-1 pt-2"><p className="font-heading text-lg font-bold leading-tight">d/PhatGiaoDoiSong</p><p className="text-xs text-muted-foreground">Nơi hỏi đáp, chia sẻ và thảo luận về Phật pháp</p></div>
        </div>
        <div className="flex items-center gap-2 border-t px-4 py-2.5">
          <button className={chip(forum === 'public')} onClick={() => setForum('public')}><MessagesSquare className="h-3.5 w-3.5" />Công khai</button>
          {me && <button className={chip(forum === 'members')} onClick={() => setForum('members')}>Riêng tư</button>}
          <span className="ml-auto"><NewTopicDialog forum={forum} /></span>
        </div>
      </div>
      <div className="flex gap-1 rounded-xl border bg-card p-1.5">
        {SORTS.map(([v, l, Icon]) => <button key={v} className={chip(sort === v)} onClick={() => setSort(v)}><Icon className="h-3.5 w-3.5" />{l}</button>)}
      </div>
      {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">Đang tải...</p>}
      {!isLoading && topics.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Chưa có bài viết nào.</p>}
      {topics.map((t) => <TopicCard key={t.id} t={t} />)}
      {me === null && <p className="rounded-2xl bg-muted p-4 text-center text-xs text-muted-foreground">Đăng nhập để bình chọn, bình luận và xem diễn đàn riêng tư.</p>}
    </div>
  );
}