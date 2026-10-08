import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import LoadMore from '@/components/admin/LoadMore';
import useAdminList from '@/components/admin/useAdminList';
import { timeAgo } from '@/lib/pgds';

const A = base44.entities.Activity;
const FILTERS = [['all', 'Tất cả'], ['hidden', 'Đang bị ẩn']];

export default function PostsAdmin() {
  const qc = useQueryClient();
  const [f, setF] = useState('all');
  const { q, items } = useAdminList(['admin', 'posts', f], (cursor) =>
    A.filter(f === 'hidden' ? { status: 'hidden' } : {}, { sort: '-created_date', limit: 20, cursor }));
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin'] });

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {FILTERS.map(([v, l]) => (
          <button key={v} onClick={() => setF(v)} className={`rounded-full px-4 py-1.5 text-sm ${f === v ? 'bg-[#C9A227] text-[#2b2108]' : 'bg-muted'}`}>{l}</button>
        ))}
      </div>
      <div className="divide-y rounded-2xl border bg-card">
        {items.map((a) => (
          <div key={a.id} className="flex items-start gap-3 p-3">
            {a.image_url && <img src={a.image_url} alt="" className="h-14 w-14 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{a.author_name} <span className="font-normal text-muted-foreground">· {a.author_email} · {timeAgo(a.created_date)}</span></p>
              <p className="line-clamp-3 whitespace-pre-wrap text-sm">{a.content}</p>
              {a.status === 'hidden' && <span className="mt-1 inline-block rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">Đã ẩn</span>}
            </div>
            <Button size="sm" variant="outline" onClick={async () => { await A.update(a.id, { status: a.status === 'hidden' ? 'approved' : 'hidden' }); refresh(); }}>
              {a.status === 'hidden' ? <><Eye className="mr-1 h-4 w-4" />Duyệt lại</> : <><EyeOff className="mr-1 h-4 w-4" />Ẩn</>}
            </Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={async () => { if (confirm('Xóa bài đăng này?')) { await A.delete(a.id); refresh(); } }}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <LoadMore q={q} count={items.length} />
    </div>
  );
}