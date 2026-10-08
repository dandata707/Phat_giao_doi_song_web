import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import LoadMore from '@/components/admin/LoadMore';
import useAdminList from '@/components/admin/useAdminList';
import { timeAgo } from '@/lib/pgds';

export default function EntityAdmin({ entity, title, sub, confirmText, onDeleted }) {
  const qc = useQueryClient();
  const E = base44.entities[entity];
  const { q, items } = useAdminList(['admin', entity], (cursor) => E.filter({}, { sort: '-created_date', limit: 20, cursor }));
  const remove = async (r) => {
    if (!confirm(confirmText || 'Xóa mục này?')) return;
    await E.delete(r.id);
    if (onDeleted) await onDeleted(r);
    qc.invalidateQueries({ queryKey: ['admin', entity] });
  };
  return (
    <div>
      <div className="divide-y rounded-2xl border bg-card">
        {items.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Chưa có dữ liệu.</p>}
        {items.map((r) => (
          <div key={r.id} className="flex items-start gap-3 p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{title(r)}</p>
              <p className="line-clamp-2 break-words text-xs text-muted-foreground">{sub(r)} · {timeAgo(r.created_date)}</p>
            </div>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(r)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <LoadMore q={q} count={items.length} />
    </div>
  );
}