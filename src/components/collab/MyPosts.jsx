import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import LoadMore from '@/components/admin/LoadMore';
import useAdminList from '@/components/admin/useAdminList';
import StatusBadge from '@/components/collab/StatusBadge';
import { timeAgo } from '@/lib/pgds';

const A = base44.entities.Activity;

export default function MyPosts({ me }) {
  const qc = useQueryClient();
  const [editId, setEditId] = useState(null);
  const [text, setText] = useState('');
  const { q, items } = useAdminList(['my', 'posts', me.email], (cursor) =>
    A.filter({ author_email: me.email }, { sort: '-created_date', limit: 20, cursor }));
  const resend = async (a) => {
    await A.update(a.id, { content: text.trim(), status: 'pending', reject_reason: '' });
    setEditId(null);
    qc.invalidateQueries({ queryKey: ['my'] });
    toast({ title: 'Đã gửi biên tập viên duyệt' });
  };

  return (
    <div>
      <div className="divide-y rounded-2xl border bg-card">
        {items.map((a) => (
          <div key={a.id} className="space-y-2 p-3">
            <div className="flex items-start gap-3">
              <p className="line-clamp-3 min-w-0 flex-1 whitespace-pre-wrap text-sm">{a.content}</p>
              <StatusBadge status={a.status} />
            </div>
            <p className="text-xs text-muted-foreground">{timeAgo(a.created_date)}</p>
            {a.status === 'rejected' && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">Lý do không duyệt: {a.reject_reason}</p>}
            {a.status === 'rejected' && editId !== a.id && <Button size="sm" variant="outline" onClick={() => { setEditId(a.id); setText(a.content); }}>Sửa & gửi lại</Button>}
            {editId === a.id && (
              <div className="space-y-2">
                <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
                <div className="flex gap-2">
                  <Button size="sm" disabled={!text.trim()} onClick={() => resend(a)}>Gửi lại</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Hủy</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <LoadMore q={q} count={items.length} />
    </div>
  );
}