import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fullDate } from '@/lib/pgds';

const E = base44.entities;
const LABEL = { active: 'Bình thường', suspended: 'Đình chỉ', locked: 'Bị khóa' };
const COLOR = { active: 'bg-green-100 text-green-800', suspended: 'bg-amber-100 text-amber-800', locked: 'bg-red-100 text-red-800' };

export default function UsersAdmin({ initialSearch = '' }) {
  const qc = useQueryClient();
  const [search, setSearch] = useState(initialSearch);
  const { data = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const r = await E.User.list('-created_date', 500);
      const users = Array.isArray(r) ? r : r.items;
      const profiles = await E.Profile.filter({ user_email: { $in: users.map((u) => u.email) } }, { limit: 1000 });
      const map = Object.fromEntries(profiles.items.map((p) => [p.user_email, p]));
      return users.map((u) => ({ ...u, profile: map[u.email] }));
    },
  });
  const setStatus = async (u, status) => {
    const reason = status === 'active' ? '' : prompt('Lý do (hiển thị cho thành viên):', u.profile?.status_reason || '') ?? '';
    const patch = { account_status: status, status_reason: reason };
    if (u.profile) await E.Profile.update(u.profile.id, patch);
    else await E.Profile.create({ user_email: u.email, display_name: u.full_name || u.email.split('@')[0], ...patch });
    qc.invalidateQueries({ queryKey: ['admin'] });
  };
  const s = search.trim().toLowerCase();
  const rows = data.filter((u) => !s || u.email.toLowerCase().includes(s) || (u.full_name || '').toLowerCase().includes(s));

  return (
    <div>
      <Input className="mb-4" placeholder="Tìm theo tên hoặc email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">Đang tải...</p>}
      <div className="divide-y rounded-2xl border bg-card">
        {rows.map((u) => {
          const st = u.profile?.account_status || 'active';
          return (
            <div key={u.id} className="flex flex-wrap items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{u.profile?.display_name || u.full_name || u.email} {u.role === 'admin' && <span className="text-xs text-muted-foreground">(quản trị)</span>}</p>
                <p className="truncate text-xs text-muted-foreground">{u.email} · tham gia {fullDate(u.created_date)}</p>
                {st !== 'active' && u.profile?.status_reason && <p className="text-xs text-muted-foreground">Lý do: {u.profile.status_reason}</p>}
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${COLOR[st]}`}>{LABEL[st]}</span>
              {u.role !== 'admin' && (
                <div className="flex gap-2">
                  <select value={u.role || 'user'} onChange={async (e) => { await E.User.update(u.id, { role: e.target.value }); qc.invalidateQueries({ queryKey: ['admin'] }); }} className="h-8 rounded-md border bg-background px-2 text-xs">
                    <option value="user">Thành viên</option><option value="collaborator">Cộng tác viên</option><option value="editor">Biên tập viên</option>
                  </select>
                  {st !== 'active' && <Button size="sm" variant="outline" onClick={() => setStatus(u, 'active')}>Khôi phục</Button>}
                  {st !== 'suspended' && <Button size="sm" variant="outline" onClick={() => setStatus(u, 'suspended')}>Đình chỉ</Button>}
                  {st !== 'locked' && <Button size="sm" variant="outline" className="text-destructive" onClick={() => setStatus(u, 'locked')}>Khóa</Button>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!isLoading && rows.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Không có tài khoản.</p>}
    </div>
  );
}