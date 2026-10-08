import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import LoadMore from '@/components/admin/LoadMore';
import useAdminList from '@/components/admin/useAdminList';
import TargetPreview from '@/components/editor/TargetPreview';
import AuthorActions from '@/components/admin/AuthorActions';
import { timeAgo } from '@/lib/pgds';

const E = base44.entities;
const FILTERS = [['pending', 'Chờ xử lý'], ['resolved', 'Đã xử lý'], ['all', 'Tất cả']];
const TYPES = { activity: 'Bài đăng', comment: 'Bình luận', topic: 'Chủ đề', article: 'Bài tin tức', user: 'Tài khoản' };
const RES = { removed: 'Đã gỡ nội dung', dismissed: 'Đã bãi bỏ báo cáo', suspended: 'Đã đình chỉ tài khoản tác giả', locked: 'Đã khóa tài khoản tác giả' };

export default function ReportsAdmin({ onOpenUser }) {
  const qc = useQueryClient();
  const [f, setF] = useState('pending');
  const { q, items } = useAdminList(['admin', 'reports', f], (cursor) =>
    E.Report.filter(f === 'all' ? {} : { status: f }, { sort: '-created_date', limit: 20, cursor }));
  const close = async (r, resolution) => { await E.Report.update(r.id, { status: 'resolved', resolution }); qc.invalidateQueries({ queryKey: ['admin'] }); };
  const takeDown = async (r) => {
    if (r.target_type === 'comment') await E.Comment.update(r.target_id, { status: 'rejected' });
    else if (r.target_type === 'topic') await E.Topic.delete(r.target_id);
    else await E[r.target_type === 'article' ? 'Article' : 'Activity'].update(r.target_id, { status: 'removed', reject_reason: `Vi phạm: ${r.reason}` });
    await close(r, 'removed');
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {FILTERS.map(([v, l]) => (
          <button key={v} onClick={() => setF(v)} className={`rounded-full px-4 py-1.5 text-sm ${f === v ? 'bg-[#C9A227] text-[#2b2108]' : 'bg-muted'}`}>{l}</button>
        ))}
      </div>
      <div className="divide-y rounded-2xl border bg-card">
        {items.map((r) => (
          <div key={r.id} className="space-y-2 p-3">
            <p className="text-sm"><b>{TYPES[r.target_type] || r.target_type}</b> · {r.reason} <span className="text-muted-foreground">· bởi {r.reporter_email} · {timeAgo(r.created_date)}</span></p>
            {r.note && <p className="text-sm text-muted-foreground">{r.note}</p>}
            <TargetPreview type={r.target_type} id={r.target_id} />
            {r.status === 'resolved' && <p className="text-xs text-muted-foreground">Hướng xử lý: {RES[r.resolution] || 'Đã xử lý'}</p>}
            {r.status !== 'resolved' && (
              <div className="flex flex-wrap gap-2">
                {['activity', 'article', 'comment', 'topic'].includes(r.target_type) && <Button size="sm" variant="outline" className="text-destructive" onClick={() => takeDown(r)}>{r.target_type === 'comment' ? 'Gỡ bình luận & đóng' : 'Gỡ bài & đóng'}</Button>}
                {r.target_type === 'user' && onOpenUser && <Button size="sm" variant="outline" onClick={() => onOpenUser(r.target_id)}>Xem tài khoản</Button>}
                <AuthorActions report={r} onDone={(s) => close(r, s)} />
                <Button size="sm" variant="outline" onClick={() => close(r, 'dismissed')}>Bãi bỏ báo cáo</Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <LoadMore q={q} count={items.length} />
    </div>
  );
}