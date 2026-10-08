import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ThumbsUp, MessageCircle, Share2, Globe, Users, Lock, UserCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import CommentGate from '@/components/social/CommentGate';
import { memberUrl } from '@/lib/social';
import ContentMenu from '@/components/app/ContentMenu';
import { useMe, goLogin, timeAgo, COMMENT_LIVE } from '@/lib/pgds';

const PRIV_ICON = { public: Globe, members: Users, friends: UserCheck, me: Lock };
const act = 'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground active:bg-muted';

export default function ActivityCard({ a }) {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const { data: count = 0 } = useQuery({ queryKey: ['cc', 'activity', a.id], queryFn: () => base44.entities.Comment.count({ target_type: 'activity', target_id: a.id, status: COMMENT_LIVE }) });
  const likes = a.liked_by || [];
  const liked = me && likes.includes(me.email);
  const Priv = PRIV_ICON[a.privacy] || Globe;
  const profile = a.author_email ? memberUrl(a.author_email) : '#';

  const toggleLike = async () => {
    if (!me) return goLogin();
    await base44.entities.Activity.update(a.id, { liked_by: liked ? likes.filter((e) => e !== me.email) : [...likes, me.email] });
    qc.invalidateQueries({ queryKey: ['feed'] });
  };
  const share = async () => {
    const url = window.location.origin + '/cong-dong';
    if (navigator.share) await navigator.share({ text: a.content, url }).catch(() => {});
    else await navigator.clipboard.writeText(url);
  };

  return (
    <article className="overflow-hidden rounded-xl border bg-card pt-3 shadow-sm">
      <div className="flex items-center gap-3 px-4">
        <Link to={profile} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] font-semibold text-[#2b2108]">{(a.author_name || '?')[0].toUpperCase()}</Link>
        <div className="min-w-0 flex-1">
          <Link to={profile} className="block truncate text-sm font-semibold">{a.author_name}</Link>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">{timeAgo(a.created_date)} · <Priv className="h-3 w-3" /></p>
        </div>
        <ContentMenu targetType="activity" targetId={a.id} authorEmail={a.author_email}
          onDelete={async () => { await base44.entities.Activity.delete(a.id); qc.invalidateQueries({ queryKey: ['feed'] }); }} />
      </div>
      <p className="mt-3 whitespace-pre-wrap break-words px-4 text-[15px] leading-relaxed">{a.content}</p>
      {a.kind === 'article' && a.article_id && (
        <Link to={`/bai/${a.article_id}`} className="mt-2 inline-block px-4 text-sm font-medium text-[#8A6D0B] dark:text-[#C9A227]">Đọc bài viết →</Link>
      )}
      {a.image_url && <Image src={a.image_url} alt="" className="mt-3 aspect-[4/3] w-full" />}
      <div className="flex items-center justify-between px-4 pt-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5 text-[#C9A227]" />{likes.length}</span>
        <button onClick={() => setOpen(!open)}>{count} bình luận</button>
      </div>
      <div className="mx-4 mb-1 mt-2 flex border-t pt-1">
        <button onClick={toggleLike} className={`${act} ${liked ? 'font-semibold text-[#8A6D0B] dark:text-[#C9A227]' : ''}`}><ThumbsUp className={`h-5 w-5 ${liked ? 'fill-[#C9A227] text-[#C9A227]' : ''}`} />Thích</button>
        <button onClick={() => setOpen(!open)} className={act}><MessageCircle className="h-5 w-5" />Bình luận</button>
        <button onClick={share} className={act}><Share2 className="h-5 w-5" />Chia sẻ</button>
      </div>
      {open && <div className="px-4 pb-4 pt-2"><CommentGate targetType="activity" targetId={a.id} authorEmail={a.author_email} /></div>}
    </article>
  );
}