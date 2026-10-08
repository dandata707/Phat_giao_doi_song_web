import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/app/PageHeader';
import CoverImage from '@/components/app/CoverImage';
import Feed from '@/components/app/Feed';
import { useMe, goLogin } from '@/lib/pgds';

export default function GroupDetail() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: g } = useQuery({ queryKey: ['group', id], queryFn: () => base44.entities.Group.get(id) });
  const { data: members = [] } = useQuery({
    queryKey: ['members', id],
    queryFn: async () => (await base44.entities.GroupMember.filter({ group_id: id }, { limit: 100 })).items,
  });
  const mine = me ? members.find((m) => m.user_email === me.email) : null;
  const active = mine?.status === 'active';
  const refresh = () => { qc.invalidateQueries({ queryKey: ['members', id] }); qc.invalidateQueries({ queryKey: ['group', id] }); qc.invalidateQueries({ queryKey: ['groups'] }); };

  const join = async () => {
    if (!me) return goLogin();
    const pending = g.group_type === 'private';
    await base44.entities.GroupMember.create({ group_id: id, user_email: me.email, user_name: me.full_name || me.email, status: pending ? 'pending' : 'active' });
    if (!pending) await base44.entities.Group.update(id, { member_count: (g.member_count || 0) + 1 });
    refresh();
  };
  const leave = async () => {
    await base44.entities.GroupMember.delete(mine.id);
    if (active) await base44.entities.Group.update(id, { member_count: Math.max(0, (g.member_count || 1) - 1) });
    refresh();
  };

  if (!g) return <div><PageHeader back title="Nhóm" /></div>;
  const canSee = g.group_type === 'public' || active;

  return (
    <div>
      <PageHeader back title={g.name} />
      <div className="flex items-center gap-4 px-5 py-5">
        <CoverImage src={g.logo} className="h-20 w-20 rounded-3xl" />
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg font-bold leading-snug">{g.name}</h2>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" />{g.member_count} thành viên{g.group_type === 'private' && <><Lock className="h-3 w-3" />Nhóm kín</>}</p>
        </div>
      </div>
      <div className="px-5">
        {mine ? (
          <Button variant="outline" className="w-full rounded-full" onClick={leave}>{active ? 'Rời nhóm' : 'Đã gửi yêu cầu · Huỷ'}</Button>
        ) : (
          <Button className="w-full rounded-full" onClick={join}>{g.group_type === 'private' ? 'Xin vào nhóm' : 'Tham gia nhóm'}</Button>
        )}
      </div>
      <Tabs defaultValue="feed" className="px-5 pt-5">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted p-1">
          <TabsTrigger value="about" className="rounded-full text-xs">Giới thiệu</TabsTrigger>
          <TabsTrigger value="feed" className="rounded-full text-xs">Bảng tin</TabsTrigger>
          <TabsTrigger value="members" className="rounded-full text-xs">Thành viên</TabsTrigger>
        </TabsList>
        <TabsContent value="about" className="pt-4 text-[15px] leading-relaxed">{g.description || 'Chưa có giới thiệu.'}</TabsContent>
        <TabsContent value="feed" className="pt-4">
          {canSee ? <Feed groupId={id} canPost={active} /> : <p className="py-8 text-center text-sm text-muted-foreground">Đây là nhóm kín. Hãy xin vào nhóm để xem bài đăng.</p>}
        </TabsContent>
        <TabsContent value="members" className="space-y-3 pt-4">
          {canSee ? members.filter((m) => m.status === 'active').map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227]/25 font-semibold">{(m.user_name || '?')[0].toUpperCase()}</div>
              <span className="text-sm font-medium">{m.user_name}</span>
            </div>
          )) : <p className="py-8 text-center text-sm text-muted-foreground">Chỉ thành viên mới xem được danh sách.</p>}
          {canSee && members.length === 0 && <p className="text-sm text-muted-foreground">Chưa có thành viên tham gia qua ứng dụng.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}