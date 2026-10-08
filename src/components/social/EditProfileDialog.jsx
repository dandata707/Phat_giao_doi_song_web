import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Camera } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CoverImage from '@/components/app/CoverImage';
import UserAvatar from '@/components/social/UserAvatar';
import { saveProfile, nameOf } from '@/lib/social';

export default function EditProfileDialog({ me, profile, open, onOpenChange }) {
  const qc = useQueryClient();
  const [f, setF] = useState({
    display_name: profile?.display_name || nameOf(me), bio: profile?.bio || me.bio || '',
    location: profile?.location || '', interests: profile?.interests || '',
    avatar: profile?.avatar || '', cover: profile?.cover || '',
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const upload = (k) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
    setF((p) => ({ ...p, [k]: file_url }));
    setBusy(false);
  };
  const save = async () => {
    setBusy(true);
    await saveProfile(me, profile, { ...f, display_name: f.display_name.trim() || nameOf(me) });
    await base44.auth.updateMe({ display_name: f.display_name.trim(), bio: f.bio });
    qc.invalidateQueries();
    setBusy(false);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[92vw] overflow-y-auto rounded-3xl sm:max-w-md">
        <DialogHeader><DialogTitle className="font-heading">Chỉnh sửa hồ sơ</DialogTitle></DialogHeader>
        <label className="relative block cursor-pointer overflow-hidden rounded-2xl">
          <CoverImage src={f.cover} className="h-28 w-full" />
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs text-white"><Camera className="h-3.5 w-3.5" />Ảnh bìa</span>
          <input type="file" accept="image/*" className="hidden" onChange={upload('cover')} />
        </label>
        <label className="relative -mt-12 ml-4 block w-20 cursor-pointer">
          <UserAvatar src={f.avatar} name={f.display_name || '?'} className="h-20 w-20 border-4 border-background text-2xl" />
          <span className="absolute bottom-0 right-0 rounded-full bg-black/70 p-1.5 text-white"><Camera className="h-3.5 w-3.5" /></span>
          <input type="file" accept="image/*" className="hidden" onChange={upload('avatar')} />
        </label>
        <Input placeholder="Tên hiển thị" value={f.display_name} onChange={set('display_name')} />
        <Textarea placeholder="Giới thiệu bản thân" rows={3} value={f.bio} onChange={set('bio')} />
        <Input placeholder="Địa phương (không bắt buộc)" value={f.location} onChange={set('location')} />
        <Input placeholder="Sở thích (không bắt buộc)" value={f.interests} onChange={set('interests')} />
        <Button disabled={busy} onClick={save}>{busy ? 'Đang xử lý...' : 'Lưu'}</Button>
      </DialogContent>
    </Dialog>
  );
}