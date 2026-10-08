import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, MessageSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ArticleForm from '@/components/admin/ArticleForm';
import LoadMore from '@/components/admin/LoadMore';
import useAdminList from '@/components/admin/useAdminList';
import StatusBadge from '@/components/collab/StatusBadge';
import ArticleComments from '@/components/collab/ArticleComments';
import { fullDate } from '@/lib/pgds';

const MODES = {
  all: {},
  pending: { status: 'pending' },
  rejected: { status: 'rejected' },
  approved: { status: { $nin: ['pending', 'rejected', 'removed'] } },
};

export default function MyArticles({ me, mode = 'all' }) {
  const qc = useQueryClient();
  const [edit, setEdit] = useState(undefined);
  const [viewing, setViewing] = useState(null);
  const { q, items } = useAdminList(['my', 'articles', me.email, mode], (cursor) =>
    base44.entities.Article.filter({ author_email: me.email, ...MODES[mode] }, { sort: '-created_date', limit: 20, cursor }));
  const extra = { status: 'pending', reject_reason: '', author_email: me.email, featured: false };

  return (
    <div>
      <Button className="mb-4" onClick={() => setEdit(null)}><Plus className="mr-1 h-4 w-4" />Viết bài mới</Button>
      <div className="divide-y rounded-2xl border bg-card">
        {items.map((a) => (
          <div key={a.id} className="space-y-2 p-3">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.category} · {fullDate(a.created_date)}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
            {a.status === 'rejected' && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">Lý do không duyệt: {a.reject_reason}</p>}
            {a.status === 'removed' && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">Bài đã bị gỡ{a.reject_reason ? `: ${a.reject_reason}` : ''}</p>}
            <div className="flex gap-2">
              {a.status !== 'removed' && <Button size="sm" variant="outline" onClick={() => setEdit(a)}><Pencil className="mr-1 h-4 w-4" />{a.status === 'rejected' ? 'Sửa & gửi lại' : 'Sửa'}</Button>}
              <Button size="sm" variant="outline" onClick={() => setViewing(a)}><MessageSquare className="mr-1 h-4 w-4" />Bình luận</Button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && !q.isLoading && <p className="py-8 text-center text-sm text-muted-foreground">Chưa có bài viết nào.</p>}
      <LoadMore q={q} count={items.length} />
      {edit !== undefined && (
        <ArticleForm article={edit} extra={extra} defaultAuthor={me.full_name} open onOpenChange={() => setEdit(undefined)}
          onSaved={() => { setEdit(undefined); qc.invalidateQueries({ queryKey: ['my'] }); toast({ title: 'Đã gửi biên tập viên duyệt' }); }} />
      )}
      {viewing && <ArticleComments article={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}