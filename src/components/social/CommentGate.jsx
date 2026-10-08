import React from 'react';
import CommentSection from '@/components/app/CommentSection';
import { useMe } from '@/lib/pgds';
import { useProfile, useRelation } from '@/lib/social';

export default function CommentGate({ targetType, targetId, authorEmail }) {
  const { data: me } = useMe();
  const { data: profile, isLoading } = useProfile(authorEmail);
  const { data: rel } = useRelation(me?.email, authorEmail);
  const own = !authorEmail || me?.email === authorEmail;
  if (isLoading) return null;
  const rule = profile?.who_comment || 'everyone';
  let msg = '';
  if (!own) {
    if (rel?.blockedByMe || rel?.blockedMe) msg = 'Bạn không thể bình luận do một bên đã chặn.';
    else if (rule === 'me') msg = 'Tác giả đã tắt bình luận.';
    else if (rule === 'friends' && rel?.friendship?.status !== 'accepted') msg = 'Chỉ bạn bè của tác giả mới được bình luận.';
  }
  if (msg) return <p className="rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground">{msg}</p>;
  return <CommentSection targetType={targetType} targetId={targetId} />;
}