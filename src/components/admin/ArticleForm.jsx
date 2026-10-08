import React, { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CATEGORIES } from '@/lib/pgds';

export default function ArticleForm({ article, open, onOpenChange, onSaved, extra, defaultAuthor }) {
  const [f, setF] = useState({ title: '', excerpt: '', content: '', cover_image: '', category: CATEGORIES[0].name, subcategory: '', author_name: defaultAuthor || '', featured: false, event_date: '', ...article });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const subs = CATEGORIES.find((c) => c.name === f.category)?.subs || [];

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
    setF((p) => ({ ...p, cover_image: file_url }));
    setBusy(false);
  };
  const save = async () => {
    setBusy(true);
    const { id, created_date, updated_date, created_by_id, ...data } = f;
    if (!data.event_date) delete data.event_date;
    Object.assign(data, extra);
    if (id) await base44.entities.Article.update(id, data);
    else await base44.entities.Article.create(data);
    setBusy(false);
    onSaved();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>{article ? 'Sửa bài viết' : 'Thêm bài viết'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Tiêu đề</Label><Input value={f.title} onChange={set('title')} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Chuyên mục</Label>
              <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value, subcategory: '' })} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
                {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
              </select></div>
            <div><Label>Chuyên mục con</Label>
              <select value={f.subcategory || ''} onChange={set('subcategory')} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
                <option value="">—</option>{subs.map((s) => <option key={s}>{s}</option>)}
              </select></div>
          </div>
          <div><Label>Tóm tắt</Label><Textarea rows={2} value={f.excerpt || ''} onChange={set('excerpt')} /></div>
          <div><Label>Nội dung (dòng bắt đầu bằng "## " là tiêu đề mục, cách đoạn bằng dòng trống)</Label><Textarea rows={10} value={f.content || ''} onChange={set('content')} /></div>
          <div className="flex items-center gap-3">
            {f.cover_image && <img src={f.cover_image} alt="" className="h-16 w-24 rounded-lg object-cover" />}
            <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm"><ImagePlus className="h-4 w-4" />Ảnh bìa<input type="file" accept="image/*" hidden onChange={upload} /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Tác giả</Label><Input value={f.author_name || ''} onChange={set('author_name')} /></div>
            <div><Label>Ngày sự kiện (nếu là sự kiện Phật giáo)</Label><Input type="date" value={f.event_date || ''} onChange={set('event_date')} /></div>
          </div>
          {!extra && <div className="flex items-center gap-2"><Switch checked={!!f.featured} onCheckedChange={(v) => setF({ ...f, featured: v })} /><Label>Bài nổi bật (hiện ở đầu Trang chủ)</Label></div>}
          <Button className="w-full" disabled={busy || !f.title.trim()} onClick={save}>{busy ? 'Đang xử lý...' : 'Lưu'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}