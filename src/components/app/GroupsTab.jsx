import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Lock, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CoverImage from '@/components/app/CoverImage';

const SORTS = [{ v: '-created_date', l: 'Mới nhất' }, { v: '-updated_date', l: 'Hoạt động' }, { v: '-member_count', l: 'Phổ biến' }];

export default function GroupsTab() {
  const [sort, setSort] = useState('-created_date');
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups', sort],
    queryFn: async () => (await base44.entities.Group.filter({}, { sort, limit: 30 })).items,
  });
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {SORTS.map((s) => (
          <button key={s.v} onClick={() => setSort(s.v)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${sort === s.v ? 'bg-[#C9A227] text-[#2b2108]' : 'bg-muted text-muted-foreground'}`}>{s.l}</button>
        ))}
      </div>
      {isLoading && <p className="py-8 text-center text-sm text-muted-foreground">Đang tải...</p>}
      {groups.map((g) => (
        <Link key={g.id} to={`/nhom/${g.id}`} className="flex items-center gap-4 rounded-3xl border bg-card p-3 shadow-sm active:scale-[0.99]">
          <CoverImage src={g.logo} className="h-16 w-16 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading font-semibold">{g.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />{g.member_count} thành viên
              {g.group_type === 'private' && <span className="flex items-center gap-1"><Lock className="h-3 w-3" />Kín</span>}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}