import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/app/PageHeader';
import ActivityCard from '@/components/app/ActivityCard';
import ProfileHeader from '@/components/social/ProfileHeader';
import { useMe } from '@/lib/pgds';
import { useProfile, useRelation, useStats } from '@/lib/social';

export default function MemberProfile() {
  const { email } = useParams();
  const { data: me } = useMe();
  const { data: profile } = useProfile(email);
  const { data: rel } = useRelation(me?.email, email);
  const { data: stats } = useStats(email);
  const own = me?.email === email;
  const isFriend = rel?.friendship?.status === 'accepted';
  const v = profile?.who_view || 'public';
  const blocked = rel?.blockedByMe || rel?.blockedMe;
  const canView = own || (!blocked && (v === 'public' || (v === 'members' && !!me) || (v === 'friends' && isFriend)));
  const name = profile?.display_name || email.split('@')[0];

  const { data: posts = [] } = useQuery({
    queryKey: ['social', 'posts', email, isFriend, !!me],
    enabled: canView,
    queryFn: async () => {
      const privacy = ['public', ...(me ? ['members'] : []), ...(isFriend || own ? ['friends'] : []), ...(own ? ['me'] : [])];
      return (await base44.entities.Activity.filter({ author_email: email, privacy: { $in: privacy }, status: { $nin: ['hidden', 'pending', 'rejected', 'removed'] } }, { sort: '-created_date', limit: 20 })).items;
    },
  });

  return (
    <div>
      <PageHeader title={name} back />
      <ProfileHeader name={name} profile={profile} stats={stats} canView={canView} joined={own ? me.created_date : profile?.created_date}>
        {own
          ? <Link to="/tai-khoan" className="inline-block rounded-full border px-4 py-2 text-sm font-medium">Chỉnh sửa hồ sơ</Link>
          : null}
      </ProfileHeader>
      <div className="space-y-4 px-5 py-5">
        {!canView && <p className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground"><Lock className="h-4 w-4" />Hồ sơ này không được hiển thị với bạn.</p>}
        {canView && posts.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Chưa có bài viết nào.</p>}
        {canView && posts.map((a) => <ActivityCard key={a.id} a={a} />)}
      </div>
    </div>
  );
}