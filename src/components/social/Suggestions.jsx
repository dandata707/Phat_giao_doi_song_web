import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import PersonRow from '@/components/social/PersonRow';
import { Link } from 'react-router-dom';
import { useProfile, saveProfile, memberUrl } from '@/lib/social';

const E = base44.entities;

export default function Suggestions({ me }) {
  const qc = useQueryClient();
  const { data: profile } = useProfile(me.email);
  const hidden = !!profile?.hide_suggestions;
  const { data = [] } = useQuery({
    queryKey: ['social', 'suggest', me.email],
    enabled: !hidden && profile !== undefined,
    queryFn: async () => {
      const [fr, bl] = await Promise.all([
        E.Friendship.filter({ $or: [{ requester_email: me.email }, { recipient_email: me.email }] }, { limit: 200 }),
        E.Block.filter({ $or: [{ blocker_email: me.email }, { blocked_email: me.email }] }, { limit: 200 }),
      ]);
      const skip = new Set([me.email]);
      fr.items.forEach((f) => { skip.add(f.requester_email); skip.add(f.recipient_email); });
      bl.items.forEach((b) => { skip.add(b.blocker_email); skip.add(b.blocked_email); });
      return (await E.Profile.filter({ user_email: { $nin: [...skip] }, hide_suggestions: { $ne: true }, who_friend_request: { $ne: 'none' } }, { sort: '-created_date', limit: 10 })).items;
    },
  });
  const toggle = async (v) => { await saveProfile(me, profile, { hide_suggestions: v }); qc.invalidateQueries({ queryKey: ['profile'] }); qc.invalidateQueries({ queryKey: ['social', 'suggest'] }); };

  if (hidden) {
    return <div className="py-8 text-center text-sm text-muted-foreground"><p>Bạn đã tắt gợi ý kết nối.</p><Button variant="outline" className="mt-3 rounded-full" onClick={() => toggle(false)}>Bật lại gợi ý</Button></div>;
  }
  return (
    <div>
      <p className="pb-2 text-xs text-muted-foreground">Gợi ý dựa trên các thành viên mới tham gia.</p>
      {data.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Chưa có gợi ý nào.</p>}
      {data.map((p) => (
        <PersonRow key={p.id} email={p.user_email} name={p.display_name}>
          <Link to={memberUrl(p.user_email)} className="rounded-full border px-3 py-1.5 text-xs font-medium">Xem</Link>
        </PersonRow>
      ))}
      <button onClick={() => toggle(true)} className="mt-4 text-xs text-muted-foreground underline">Tắt gợi ý kết nối</button>
    </div>
  );
}