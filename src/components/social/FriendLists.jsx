import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import PersonRow from '@/components/social/PersonRow';

const E = base44.entities;
const Empty = ({ t }) => <p className="py-8 text-center text-sm text-muted-foreground">{t}</p>;

function useAct() {
  const qc = useQueryClient();
  return (fn) => async () => { await fn(); qc.invalidateQueries({ queryKey: ['social'] }); qc.invalidateQueries({ queryKey: ['rel'] }); };
}

export function FriendList({ me }) {
  const act = useAct();
  const { data = [] } = useQuery({
    queryKey: ['social', 'friends', me],
    queryFn: async () => (await E.Friendship.filter({ status: 'accepted', $or: [{ requester_email: me }, { recipient_email: me }] }, { limit: 200 })).items,
  });
  if (!data.length) return <Empty t="Bạn chưa có bạn bè nào." />;
  return data.map((f) => {
    const mine = f.requester_email === me;
    return (
      <PersonRow key={f.id} email={mine ? f.recipient_email : f.requester_email} name={mine ? f.recipient_name : f.requester_name}>
        <Button size="sm" variant="outline" className="rounded-full" onClick={act(() => E.Friendship.delete(f.id))}>Hủy kết bạn</Button>
      </PersonRow>
    );
  });
}

export function RequestList({ me }) {
  const act = useAct();
  const { data } = useQuery({
    queryKey: ['social', 'requests', me],
    queryFn: async () => {
      const [i, o] = await Promise.all([
        E.Friendship.filter({ status: 'pending', recipient_email: me }, { limit: 100 }),
        E.Friendship.filter({ status: 'pending', requester_email: me }, { limit: 100 }),
      ]);
      return { incoming: i.items, outgoing: o.items };
    },
  });
  if (!data || (!data.incoming.length && !data.outgoing.length)) return <Empty t="Không có lời mời nào." />;
  return (
    <>
      {data.incoming.map((f) => (
        <PersonRow key={f.id} email={f.requester_email} name={f.requester_name}>
          <Button size="sm" className="rounded-full" onClick={act(() => E.Friendship.update(f.id, { status: 'accepted' }))}>Chấp nhận</Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={act(() => E.Friendship.delete(f.id))}>Từ chối</Button>
        </PersonRow>
      ))}
      {data.outgoing.map((f) => (
        <PersonRow key={f.id} email={f.recipient_email} name={f.recipient_name}>
          <Button size="sm" variant="outline" className="rounded-full" onClick={act(() => E.Friendship.delete(f.id))}>Hủy lời mời</Button>
        </PersonRow>
      ))}
    </>
  );
}

export function FollowList({ me, mode }) {
  const act = useAct();
  const followers = mode === 'followers';
  const { data = [] } = useQuery({
    queryKey: ['social', mode, me],
    queryFn: async () => (await E.Follow.filter(followers ? { following_email: me } : { follower_email: me }, { limit: 200 })).items,
  });
  if (!data.length) return <Empty t={followers ? 'Chưa có người theo dõi.' : 'Bạn chưa theo dõi ai.'} />;
  return data.map((f) => (
    <PersonRow key={f.id} email={followers ? f.follower_email : f.following_email} name={followers ? f.follower_name : f.following_name}>
      {!followers && <Button size="sm" variant="outline" className="rounded-full" onClick={act(() => E.Follow.delete(f.id))}>Bỏ theo dõi</Button>}
    </PersonRow>
  ));
}