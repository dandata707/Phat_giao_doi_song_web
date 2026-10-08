import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditProfileDialog from '@/components/social/EditProfileDialog';
import UserAvatar from '@/components/social/UserAvatar';
import { goLogin } from '@/lib/pgds';
import { useProfile, memberUrl, nameOf } from '@/lib/social';

export default function ProfileCard({ me }) {
  const [open, setOpen] = useState(false);
  const { data: profile } = useProfile(me?.email);

  if (!me) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-[#C9A227] to-[#e0bf4f] p-6 text-[#2b2108]">
        <h2 className="font-heading text-xl font-bold">Chào mừng đạo hữu</h2>
        <p className="mt-1 text-sm">Đăng nhập để bình luận, đăng bài và tham gia nhóm.</p>
        <Button onClick={goLogin} className="mt-4 rounded-full bg-[#2b2108] text-white hover:bg-[#2b2108]/90">Đăng nhập / Đăng ký</Button>
      </div>
    );
  }
  const shown = profile?.display_name || nameOf(me);
  const bio = profile?.bio || me.bio;
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#C9A227] to-[#e0bf4f] p-5 text-[#2b2108]">
      <UserAvatar src={profile?.avatar} name={shown} className="h-16 w-16 shrink-0 text-2xl" />
      <Link to={memberUrl(me.email)} className="min-w-0 flex-1">
        <h2 className="truncate font-heading text-lg font-bold">{shown}</h2>
        <p className="truncate text-xs">{me.email}</p>
        {bio && <p className="mt-1 line-clamp-2 text-xs">{bio}</p>}
      </Link>
      <button aria-label="Chỉnh sửa hồ sơ" onClick={() => setOpen(true)} className="rounded-full bg-white/40 p-2"><Pencil className="h-4 w-4" /></button>
      {open && <EditProfileDialog me={me} profile={profile} open={open} onOpenChange={setOpen} />}
    </div>
  );
}