import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/app/PageHeader';
import CommentSection from '@/components/app/CommentSection';
import ContentMenu from '@/components/app/ContentMenu';
import TopicVote from '@/components/app/TopicVote';
import { useMe, goLogin, timeAgo } from '@/lib/pgds';

export default function TopicDetail() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: t, isLoading } = useQuery({ queryKey: ['topic', id], queryFn: () => base44.entities.Topic.get(id) });

  const syncCount = async () => {
    const n = await base44.entities.Comment.count({ target_type: 'topic', target_id: id, status: { $nin: ['pending', 'rejected'] } });
    await base44.entities.Topic.update(id, { reply_count: n, last_replier: me?.full_name || me?.email });
    qc.invalidateQueries({ queryKey: ['topics'] });
  };

  if (isLoading || me === undefined) return <div><PageHeader back title="Chủ đề" /></div>;
  if (!t) return <div><PageHeader back title="Chủ đề" /><p className="p-10 text-center text-sm">Không tìm thấy chủ đề.</p></div>;
  if (t.forum === 'members' && !me) {
    return (
      <div><PageHeader back title="Diễn đàn riêng tư" />
        <div className="space-y-4 p-10 text-center"><p className="text-sm">Chủ đề này chỉ dành cho thành viên đã đăng nhập.</p><Button onClick={goLogin} className="rounded-full">Đăng nhập</Button></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader back title="Chủ đề" />
      <div className="px-5 pt-5">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {t.flair && <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">{t.flair}</span>}
          <span>Đăng bởi <b className="text-foreground">u/{t.author_name}</b> · {timeAgo(t.created_date)}</span>
          <span className="ml-auto"><ContentMenu targetType="topic" targetId={t.id} authorEmail={t.author_email} /></span>
        </p>
        <h1 className="mt-2 font-heading text-xl font-bold leading-snug">{t.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed">{t.body}</p>
        <div className="mt-4"><TopicVote t={t} horizontal /></div>
        <h2 className="mb-4 mt-8 font-heading text-lg font-bold">{t.reply_count} trả lời</h2>
        <CommentSection targetType="topic" targetId={id} onChanged={syncCount} />
      </div>
    </div>
  );
}