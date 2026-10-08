import React from 'react';
import { MapPin, Heart, CalendarDays, Award } from 'lucide-react';
import CoverImage from '@/components/app/CoverImage';
import UserAvatar from '@/components/social/UserAvatar';
import { fullDate } from '@/lib/pgds';

const badgesOf = (s, joined) => {
  const days = joined ? (Date.now() - new Date(joined).getTime()) / 86400000 : 0;
  const b = [];
  if (joined && days < 30) b.push('Thành viên mới');
  if (joined && days >= 365) b.push('Thành viên lâu năm');
  if (s?.posts >= 5) b.push('Người chia sẻ');
  if (s?.friends >= 5) b.push('Thiện hữu');
  return b;
};

export default function ProfileHeader({ name, profile, stats, canView, joined, children }) {
  const badges = canView ? badgesOf(stats, joined) : [];
  return (
    <div>
      <CoverImage src={canView ? profile?.cover : ''} className="h-36 w-full" />
      <div className="px-5">
        <UserAvatar src={canView ? profile?.avatar : ''} name={name} className="-mt-12 h-24 w-24 border-4 border-background text-3xl" />
        <h2 className="mt-2 font-heading text-xl font-bold">{name}</h2>
        {canView && profile?.bio && <p className="mt-1 text-sm">{profile.bio}</p>}
        {canView && (
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            {profile?.location && <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{profile.location}</p>}
            {profile?.interests && <p className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" />{profile.interests}</p>}
            {joined && <p className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Tham gia {fullDate(joined)}</p>}
          </div>
        )}
        {badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => <span key={b} className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium"><Award className="h-3.5 w-3.5 text-[#C9A227]" />{b}</span>)}
          </div>
        )}
        <div className="mt-4 grid grid-cols-3 rounded-2xl border bg-card py-3 text-center">
          {[['Bài viết', stats?.posts], ['Bạn bè', stats?.friends], ['Người theo dõi', stats?.followers]].map(([l, n]) => (
            <div key={l}><p className="font-heading text-lg font-bold">{n ?? '–'}</p><p className="text-xs text-muted-foreground">{l}</p></div>
          ))}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}