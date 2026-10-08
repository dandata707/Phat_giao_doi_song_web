import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Star, Pencil, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ArticleForm from '@/components/admin/ArticleForm';
import LoadMore from '@/components/admin/LoadMore';
import useAdminList from '@/components/admin/useAdminList';
import { fullDate } from '@/lib/pgds';

const A = base44.entities.Article;

export default function ArticlesAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('');
  const [edit, setEdit] = useState(undefined);
  const { q, items } = useAdminList(['admin', 'articles', term], (cursor) =>
    A.filter(term ? { title: { $regex: term, $options: 'i' } } : {}, { sort: '-created_date', limit: 20, cursor }));
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin'] });

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <form className="flex flex-1 gap-2" onSubmit={(e) => { e.preventDefault(); setTerm(search.trim()); }}>
          <Input placeholder="Tìm theo tiêu đề..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button type="submit" variant="outline">Tìm</Button>
        </form>
        <Button onClick={() => setEdit(null)}><Plus className="mr-1 h-4 w-4" />Thêm bài</Button>
      </div>
      <div className="divide-y rounded-2xl border bg-card">
        {items.map((a) => (
          <div key={a.id} className="flex items-center gap-3 p-3">
            {a.cover_image ? <img src={a.cover_image} alt="" className="h-14 w-20 rounded-lg object-cover" /> : <div className="h-14 w-20 rounded-lg bg-muted" />}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.category} · {fullDate(a.created_date)}{a.event_date ? ` · Sự kiện ${fullDate(a.event_date)}` : ''}</p>
            </div>
            <Button size="icon" variant="ghost" title="Nổi bật" onClick={async () => { await A.update(a.id, { featured: !a.featured }); refresh(); }}>
              <Star className={`h-4 w-4 ${a.featured ? 'fill-[#C9A227] text-[#C9A227]' : ''}`} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setEdit(a)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={async () => { if (confirm('Xóa bài viết này?')) { await A.delete(a.id); refresh(); } }}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <LoadMore q={q} count={items.length} />
      {edit !== undefined && <ArticleForm article={edit} open onOpenChange={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); refresh(); }} />}
    </div>
  );
}