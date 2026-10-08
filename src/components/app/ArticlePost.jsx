import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ThumbsUp, MessageCircle, Share2, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CoverImage from '@/components/app/CoverImage';
import ContentMenu from '@/components/app/ContentMenu';
import { useMe, goLogin, timeAgo } from '@/lib/pgds';

export default function ArticlePost({ a }) {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: count = 0 } = useQuery({ queryKey: ['cc', 'article', a.id], queryFn: () => base44.entities.Comment.count({ target_type: 'article', target_id: a.id, status: { $nin: ['pending', 'rejected'] } }) });
  const likes = a.liked_by || [];
  const liked = !!me && likes.includes(me.email);
  const author = a.author_name || 'Phật Giáo Đời Sống';

  const toggleLike = async () => {
    if (!me) return goLogin();
    await base44.entities.Article.update(a.id, { liked_by: liked ? likes.filter((e) => e !== me.email) : [...likes, me.email] });
    qc.invalidateQueries();
  };
  const share = async () => {
    const url = `${window.location.origin}/bai/${a.id}`;
    if (navigator.share) await navigator.share({ title: a.title, url }).catch(() => {});
    else await navigator.clipboard.writeText(url);
  };
  const act = 'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground active:bg-muted';

  return (
    <article className="border-y bg-card py-3">
      <div className="flex items-center gap-3 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] font-semibold text-[#2b2108]">{author[0].toUpperCase()}</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{author}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">{timeAgo(a.created_date)} · <Globe className="h-3 w-3" /> · {a.subcategory || a.category}</p>
        </div>
        <ContentMenu targetType="article" targetId={a.id} authorEmail={a.author_email} />
      </div>
      <Link to={`/bai/${a.id}`} className="mt-3 block px-4">
        <h3 className="font-heading text-[17px] font-semibold leading-snug">{a.title}</h3>
        {a.excerpt && <p className="mt-1 line-clamp-3 text-[15px] leading-relaxed">{a.excerpt}</p>}
      </Link>
      <Link to={`/bai/${a.id}`} className="mt-3 block"><CoverImage src={a.cover_image} className="aspect-[4/3] w-full" /></Link>
      <div className="flex items-center justify-between px-4 pt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5 text-[#C9A227]" />{likes.length}</span>
        <Link to={`/bai/${a.id}`}>{count} bình luận</Link>
      </div>
      <div className="mx-4 mt-2 flex border-t pt-1">
        <button onClick={toggleLike} className={`${act} ${liked ? 'font-semibold text-[#8A6D0B] dark:text-[#C9A227]' : ''}`}><ThumbsUp className={`h-5 w-5 ${liked ? 'fill-[#C9A227] text-[#C9A227]' : ''}`} />Thích</button>
        <Link to={`/bai/${a.id}`} className={act}><MessageCircle className="h-5 w-5" />Bình luận</Link>
        <button onClick={share} className={act}><Share2 className="h-5 w-5" />Chia sẻ</button>
      </div>
    </article>
  );
}