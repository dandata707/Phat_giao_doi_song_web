import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ImagePlus, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRIVACY, useMe, goLogin, isEditor } from '@/lib/pgds';
import { toast } from '@/components/ui/use-toast';
import { useProfile } from '@/lib/social';
import SuspendedNotice from '@/components/app/SuspendedNotice';

export default function Composer({ groupId }) {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: profile } = useProfile(me?.email);
  const [text, setText] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [image, setImage] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  if (!me) {
    return (
      <div className="rounded-3xl border border-dashed border-[#C9A227]/60 bg-[#C9A227]/10 p-4 text-center">
        <p className="mb-3 text-sm">Đăng nhập để chia sẻ cập nhật với cộng đồng</p>
        <Button onClick={goLogin} className="rounded-full">Đăng nhập</Button>
      </div>
    );
  }

  if (profile?.account_status === 'suspended') return <SuspendedNotice reason={profile.status_reason} />;

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
    setImage(file_url);
    setBusy(false);
  };

  const post = async () => {
    setBusy(true);
    await base44.entities.Activity.create({
      content: text.trim(), image_url: image || undefined, privacy, kind: 'update', group_id: groupId || undefined, status: isEditor(me) ? 'approved' : 'pending',
      author_name: me.full_name || me.email, author_email: me.email, liked_by: [],
    });
    setText(''); setImage(''); setBusy(false);
    qc.invalidateQueries({ queryKey: ['feed'] });
    if (!isEditor(me)) toast({ title: 'Bài đã được gửi biên tập viên duyệt', description: 'Bài sẽ hiển thị sau khi được duyệt.' });
  };

  return (
    <div className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm">
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Bạn đang nghĩ gì? Chia sẻ cùng đạo hữu..." className="min-h-[72px] resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" />
      {image && (
        <div className="relative">
          <img src={image} alt="" className="max-h-56 w-full rounded-2xl object-cover" />
          <button aria-label="Bỏ ảnh" onClick={() => setImage('')} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"><X className="h-4 w-4" /></button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={upload} />
        <Button type="button" variant="ghost" size="icon" onClick={() => fileRef.current.click()} aria-label="Thêm ảnh"><ImagePlus className="h-5 w-5" /></Button>
        <Select value={privacy} onValueChange={setPrivacy}>
          <SelectTrigger className="h-9 flex-1 rounded-full text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{PRIVACY.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
        </Select>
        <Button onClick={post} disabled={busy || (!text.trim() && !image)} className="rounded-full px-5">{busy ? '...' : 'Đăng'}</Button>
      </div>
    </div>
  );
}