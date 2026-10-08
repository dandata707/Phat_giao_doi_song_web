import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DataExport({ me }) {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    const E = base44.entities;
    const pair = (a, b) => ({ $or: [{ [a]: me.email }, { [b]: me.email }] });
    const [profile, posts, comments, friendships, follows] = await Promise.all([
      E.Profile.filter({ user_email: me.email }, { limit: 1 }),
      E.Activity.filter({ author_email: me.email }, { limit: 1000 }),
      E.Comment.filter({ author_email: me.email }, { limit: 1000 }),
      E.Friendship.filter(pair('requester_email', 'recipient_email'), { limit: 1000 }),
      E.Follow.filter(pair('follower_email', 'following_email'), { limit: 1000 }),
    ]);
    const data = { account: { email: me.email, full_name: me.full_name, created_date: me.created_date }, profile: profile.items[0], posts: posts.items, comments: comments.items, friendships: friendships.items, follows: follows.items };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = 'du-lieu-cua-toi.json';
    a.click();
    setBusy(false);
  };
  return (
    <button onClick={run} disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-medium disabled:opacity-50">
      <Download className="h-4 w-4" />{busy ? 'Đang chuẩn bị...' : 'Tải dữ liệu của tôi'}
    </button>
  );
}