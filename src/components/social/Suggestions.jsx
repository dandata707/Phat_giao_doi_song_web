import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import PersonRow from '@/components/social/PersonRow';
import AddFriendButton from '@/components/social/AddFriendButton';
import { Link } from 'react-router-dom';
import { useProfile, saveProfile, memberUrl, useSuggestedPeople } from '@/lib/social';

export default function Suggestions({ me }) {
  const qc = useQueryClient();
  const { data: profile } = useProfile(me.email);
  const hidden = !!profile?.hide_suggestions;
  const { data = [] } = useSuggestedPeople(me, !hidden && profile !== undefined);
  const toggle = async (v) => { await saveProfile(me, profile, { hide_suggestions: v }); qc.invalidateQueries({ queryKey: ['profile'] }); qc.invalidateQueries({ queryKey: ['social', 'suggest'] }); };

  if (hidden) {
    return <div className="py-8 text-center text-sm text-muted-foreground"><p>Bạn đã tắt gợi ý kết nối.</p><Button variant="outline" className="mt-3 rounded-full" onClick={() => toggle(false)}>Bật lại gợi ý</Button></div>;
  }
  return (
    <div>
      <p className="pb-2 text-xs text-muted-foreground">Gợi ý dựa trên các thành viên trong cộng đồng.</p>
      {data.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Chưa có gợi ý nào.</p>}
      {data.map((p) => (
        <PersonRow key={p.id} email={p.user_email} name={p.display_name}>
          <Link to={memberUrl(p.user_email)} className="rounded-full border px-3 py-1.5 text-xs font-medium">Xem</Link>
          <AddFriendButton me={me} email={p.user_email} name={p.display_name} />
        </PersonRow>
      ))}
      <button onClick={() => toggle(true)} className="mt-4 text-xs text-muted-foreground underline">Tắt gợi ý kết nối</button>
    </div>
  );
}