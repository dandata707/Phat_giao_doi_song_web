import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import LoadMore from '@/components/admin/LoadMore';
import useAdminList from '@/components/admin/useAdminList';
import StatusBadge from '@/components/collab/StatusBadge';
import { NOT_LIVE, timeAgo } from '@/lib/pgds';
import { base44 } from '@/api/base44Client';

const QUERY = {
  pending: { status: 'pending' },
  live: { status: NOT_LIVE },
  removed: { status: { $in: ['removed', 'hidden', 'rejected'] } },
};

export default function ContentList({ kind, mode }) {
  const qc = useQueryClient();
  const E = kind === 'article' ? base44.entities.Article : base44.entities.Activity;
  const { q, items } = useAdminList(['admin', 'content', kind, mode], (cursor) =>
    E.filter(QUERY[mode], { sort: '-created_date', limit: 20, cursor }));

  const change = async (it, status, ask) => {
    let reason = '';
    if (ask) {
      reason = (prompt(ask) || '').trim();
      if (!reason) return;
    }
    await E.update(it.id, { status, reject_reason: reason });
    qc.invalidateQueries({ queryKey: ['admin'] });
  };

  return (
    <div>
      <div className="divide-y rounded-2xl border bg-card">
        {items.map((it) => (
          <div key={it.id} className="space-y-2 p-3">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{kind === 'article' ? it.title : it.author_name} <span className="font-normal text-muted-foreground">· {it.author_name || 'Ban biên tập'}{it.author_email ? ` (${it.author_email})` : ''} · {timeAgo(it.created_date)}</span></p>
                <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-sm">{kind === 'article' ? (it.excerpt || it.content) : it.content}</p>
                {kind === 'article' && <Link to={`/bai/${it.id}`} className="text-xs text-[#8A6D0B] underline">Xem bài đầy đủ</Link>}
              </div>
              {it.image_url && <img src={it.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />}
              {it.cover_image && <img src={it.cover_image} alt="" className="h-16 w-24 rounded-lg object-cover" />}
              <StatusBadge status={it.status} />
            </div>
            {it.reject_reason && mode !== 'live' && <p className="text-xs text-muted-foreground">Lý do: {it.reject_reason}</p>}
            <div className="flex gap-2">
              {mode === 'pending' && <>
                <Button size="sm" onClick={() => change(it, 'approved')}>Duyệt</Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => change(it, 'rejected', 'Lý do không duyệt (gửi cho tác giả để làm lại):')}>Không duyệt</Button>
              </>}
              {mode === 'live' && <Button size="sm" variant="outline" className="text-destructive" onClick={() => change(it, 'removed', 'Lý do gỡ bài:')}>Gỡ bài</Button>}
              {mode === 'removed' && <Button size="sm" variant="outline" onClick={() => change(it, 'approved')}>Khôi phục & đăng lại</Button>}
            </div>
          </div>
        ))}
      </div>
      <LoadMore q={q} count={items.length} />
    </div>
  );
}