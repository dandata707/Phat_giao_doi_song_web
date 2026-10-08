import React from 'react';
import { Link } from 'react-router-dom';
import PersonRow from '@/components/social/PersonRow';
import AddFriendButton from '@/components/social/AddFriendButton';
import GroupSuggestions from '@/components/social/GroupSuggestions';
import { useSuggestedPeople } from '@/lib/social';
import { useMe, goLogin } from '@/lib/pgds';

const Card = ({ title, to, children }) => (
  <section className="rounded-2xl border bg-card p-5">
    <div className="flex items-center justify-between">
      <h3 className="font-heading text-base font-bold">{title}</h3>
      <Link to={to} className="text-xs font-medium text-[#8A6D0B] dark:text-[#C9A227]">Xem tất cả</Link>
    </div>
    <div className="mt-2">{children}</div>
  </section>
);

function People({ me }) {
  const { data = [] } = useSuggestedPeople(me, true, 4);
  if (!data.length) return <p className="py-4 text-center text-sm text-muted-foreground">Chưa có gợi ý nào.</p>;
  return data.map((p) => (
    <PersonRow key={p.id} email={p.user_email} name={p.display_name}>
      <AddFriendButton me={me} email={p.user_email} name={p.display_name} />
    </PersonRow>
  ));
}

export default function SideSuggestions() {
  const { data: me } = useMe();
  if (!me) {
    return (
      <section className="rounded-2xl border bg-card p-5 text-center">
        <p className="text-sm text-muted-foreground">Đăng nhập để nhận gợi ý bạn bè và nhóm phù hợp.</p>
        <button onClick={goLogin} className="mt-3 rounded-full bg-[#C9A227] px-5 py-2 text-sm font-medium text-[#2b2108]">Đăng nhập</button>
      </section>
    );
  }
  return (
    <div className="space-y-5">
      <Card title="Gợi ý bạn bè" to="/ban-be?tab=suggest"><People me={me} /></Card>
      <Card title="Nhóm có thể tham gia" to="/ban-be?tab=groups"><GroupSuggestions me={me} limit={4} /></Card>
    </div>
  );
}