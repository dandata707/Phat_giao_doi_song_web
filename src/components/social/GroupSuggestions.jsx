import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import CoverImage from '@/components/app/CoverImage';
import { useSuggestedGroups, nameOf } from '@/lib/social';

const E = base44.entities;

export default function GroupSuggestions({ me, limit = 6 }) {
  const qc = useQueryClient();
  const { data = [] } = useSuggestedGroups(me, limit);
  const join = async (g) => {
    await E.GroupMember.create({ group_id: g.id, user_email: me.email, user_name: nameOf(me), status: 'active' });
    await E.Group.update(g.id, { member_count: (g.member_count || 0) + 1 });
    qc.invalidateQueries({ queryKey: ['group-suggest'] });
    qc.invalidateQueries({ queryKey: ['groups'] });
  };
  if (!data.length) return <p className="py-6 text-center text-sm text-muted-foreground">Bạn đã tham gia tất cả các nhóm công khai.</p>;
  return data.map((g) => (
    <div key={g.id} className="flex items-center gap-3 border-b border-border/60 py-3 last:border-0">
      <Link to={`/nhom/${g.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <CoverImage src={g.logo} className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{g.name}</p>
          <p className="text-xs text-muted-foreground">{g.member_count} thành viên</p>
        </div>
      </Link>
      <Button size="sm" variant="outline" className="rounded-full" onClick={() => join(g)}>Tham gia</Button>
    </div>
  ));
}