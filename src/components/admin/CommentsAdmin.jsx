import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import LoadMore from '@/components/admin/LoadMore';
import useAdminList from '@/components/admin/useAdminList';
import { timeAgo } from '@/lib/pgds';

const C = base44.entities.Comment;

export default function CommentsAdmin() {
  const qc = useQueryClient();
  const { q, items } = useAdminList(['admin', 'comments'], (cursor) => C.filter({}, { sort: '-created_date', limit: 20, cursor }));
  return (
    <div>
      <div className="divide-y rounded-2xl border bg-card">
        {items.map((c) => (
          <div key={c.id} className="flex items-start gap-3 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{c.author_name} <span className="font-normal text-muted-foreground">· {c.author_email} · {c.target_type} · {timeAgo(c.created_date)}</span></p>
              <p className="whitespace-pre-wrap break-words text-sm">{c.content}</p>
            </div>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={async () => { if (confirm('Xóa bình luận này?')) { await C.delete(c.id); qc.invalidateQueries({ queryKey: ['admin'] }); } }}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <LoadMore q={q} count={items.length} />
    </div>
  );
}