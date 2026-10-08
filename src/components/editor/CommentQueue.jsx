import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import LoadMore from '@/components/admin/LoadMore';
import useAdminList from '@/components/admin/useAdminList';
import { COMMENT_LIVE, timeAgo } from '@/lib/pgds';
import { base44 } from '@/api/base44Client';

const C = base44.entities.Comment;
const TYPES = { article: 'Tin tức', activity: 'Bài đăng', topic: 'Diễn đàn' };
const LINK = { article: (id) => `/bai/${id}`, topic: (id) => `/chu-de/${id}` };

export default function CommentQueue() {
  const qc = useQueryClient();
  const [f, setF] = useState('pending');
  const { q, items } = useAdminList(['admin', 'cq', f], (cursor) =>
    C.filter({ status: f === 'pending' ? 'pending' : COMMENT_LIVE }, { sort: '-created_date', limit: 20, cursor }));
  const set = async (c, status) => { await C.update(c.id, { status }); qc.invalidateQueries({ queryKey: ['admin'] }); };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {[['pending', 'Chờ duyệt'], ['approved', 'Đã hiển thị']].map(([v, l]) => (
          <button key={v} onClick={() => setF(v)} className={`rounded-full px-4 py-1.5 text-sm ${f === v ? 'bg-[#C9A227] text-[#2b2108]' : 'bg-muted'}`}>{l}</button>
        ))}
      </div>
      <div className="divide-y rounded-2xl border bg-card">
        {items.map((c) => (
          <div key={c.id} className="space-y-2 p-3">
            <p className="text-sm font-medium">{c.author_name} <span className="font-normal text-muted-foreground">· {c.author_email} · {TYPES[c.target_type]} · {timeAgo(c.created_date)}</span></p>
            <p className="whitespace-pre-wrap break-words text-sm">{c.content}</p>
            <div className="flex items-center gap-2">
              {f === 'pending' && <Button size="sm" onClick={() => set(c, 'approved')}>Duyệt</Button>}
              <Button size="sm" variant="outline" className="text-destructive" onClick={() => set(c, 'rejected')}>{f === 'pending' ? 'Từ chối' : 'Gỡ bình luận'}</Button>
              {LINK[c.target_type] && <Link to={LINK[c.target_type](c.target_id)} className="text-xs text-[#8A6D0B] underline">Xem bài</Link>}
            </div>
          </div>
        ))}
      </div>
      <LoadMore q={q} count={items.length} />
    </div>
  );
}