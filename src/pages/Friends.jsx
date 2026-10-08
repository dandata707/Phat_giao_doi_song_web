import React, { useState } from 'react';
import PageHeader from '@/components/app/PageHeader';
import { Button } from '@/components/ui/button';
import { FriendList, RequestList, FollowList } from '@/components/social/FriendLists';
import Suggestions from '@/components/social/Suggestions';
import { useMe, goLogin } from '@/lib/pgds';

const TABS = [['friends', 'Bạn bè'], ['requests', 'Lời mời'], ['followers', 'Người theo dõi'], ['following', 'Đang theo dõi'], ['suggest', 'Gợi ý']];

export default function Friends() {
  const { data: me, isLoading } = useMe();
  const [tab, setTab] = useState('friends');
  if (isLoading) return <PageHeader title="Bạn bè" back />;
  if (!me) {
    return <div><PageHeader title="Bạn bè" back /><div className="p-8 text-center"><p className="text-sm">Đăng nhập để xem bạn bè.</p><Button onClick={goLogin} className="mt-3">Đăng nhập</Button></div></div>;
  }
  return (
    <div>
      <PageHeader title="Bạn bè" back />
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3">
        {TABS.map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium ${tab === v ? 'bg-[#C9A227] text-[#2b2108]' : 'bg-muted text-muted-foreground'}`}>{l}</button>
        ))}
      </div>
      <div className="px-5">
        {tab === 'friends' && <FriendList me={me.email} />}
        {tab === 'requests' && <RequestList me={me.email} />}
        {tab === 'followers' && <FollowList me={me.email} mode="followers" />}
        {tab === 'following' && <FollowList me={me.email} mode="following" />}
        {tab === 'suggest' && <Suggestions me={me} />}
      </div>
    </div>
  );
}