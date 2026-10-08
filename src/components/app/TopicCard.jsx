import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Share2 } from 'lucide-react';
import TopicVote from '@/components/app/TopicVote';
import ContentMenu from '@/components/app/ContentMenu';
import { timeAgo } from '@/lib/pgds';

export default function TopicCard({ t }) {
  const share = async () => {
    const url = `${window.location.origin}/chu-de/${t.id}`;
    if (navigator.share) await navigator.share({ title: t.title, url }).catch(() => {});
    else await navigator.clipboard.writeText(url);
  };
  return (
    <article className="flex overflow-hidden rounded-xl border bg-card">
      <div className="w-11 shrink-0 bg-muted/50 pt-2"><TopicVote t={t} /></div>
      <div className="min-w-0 flex-1 p-3">
        <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {t.flair && <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">{t.flair}</span>}
          <span>Đăng bởi <b className="font-semibold text-foreground">u/{t.author_name}</b></span><span>· {timeAgo(t.created_date)}</span>
        </p>
        <Link to={`/chu-de/${t.id}`} className="mt-1.5 block">
          <h4 className="font-heading text-[16px] font-semibold leading-snug">{t.title}</h4>
          {t.body && <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{t.body}</p>}
        </Link>
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Link to={`/chu-de/${t.id}`} className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 hover:bg-muted"><MessageSquare className="h-4 w-4" />{t.reply_count || 0} bình luận</Link>
          <button onClick={share} className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 hover:bg-muted"><Share2 className="h-4 w-4" />Chia sẻ</button>
          <span className="ml-auto"><ContentMenu targetType="topic" targetId={t.id} authorEmail={t.author_email} /></span>
        </div>
      </div>
    </article>
  );
}