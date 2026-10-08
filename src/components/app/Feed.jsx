import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import ActivityCard from '@/components/app/ActivityCard';
import { useMe, pageOpts, flat, getBlocked } from '@/lib/pgds';

const FILTERS = [{ v: 'all', l: 'Tất cả cập nhật' }, { v: 'article', l: 'Bài mới' }];

export default function Feed({ groupId, canPost = true }) {
  const { data: me } = useMe();
  const [kind, setKind] = useState('all');
  const q = useInfiniteQuery({
    queryKey: ['feed', groupId, kind, me?.email],
    enabled: me !== undefined,
    ...pageOpts((cursor) => {
      const query = { $or: me ? [{ privacy: { $in: ['public', 'members'] } }, { author_email: me.email }] : [{ privacy: 'public' }] };
      query.status = { $nin: ['hidden', 'pending', 'rejected', 'removed'] };
      if (groupId) query.group_id = groupId;
      if (kind === 'article') query.kind = 'article';
      return base44.entities.Activity.filter(query, { sort: '-created_date', limit: 10, cursor });
    }),
  });
  const blocked = getBlocked();
  const items = flat(q.data).filter((a) => !blocked.includes(a.author_email));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button key={f.v} onClick={() => setKind(f.v)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${kind === f.v ? 'bg-[#C9A227] text-[#2b2108]' : 'bg-muted text-muted-foreground'}`}>{f.l}</button>
        ))}
      </div>
      {q.isLoading && <p className="py-8 text-center text-sm text-muted-foreground">Đang tải bảng tin...</p>}
      {!q.isLoading && items.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Chưa có cập nhật nào.</p>}
      {items.map((a) => <ActivityCard key={a.id} a={a} />)}
      {q.hasNextPage && <Button variant="outline" className="w-full rounded-full" onClick={() => q.fetchNextPage()}>Tải thêm</Button>}
    </div>
  );
}