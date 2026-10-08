import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { COMMENT_LIVE, timeAgo } from '@/lib/pgds';

export default function CollabComments({ me }) {
  const { data: items, isLoading } = useQuery({
    queryKey: ['my', 'allcomments', me.email],
    queryFn: async () => {
      const arts = (await base44.entities.Article.filter({ author_email: me.email }, { fields: ['title'], limit: 100 })).items;
      if (!arts.length) return [];
      const titles = Object.fromEntries(arts.map((a) => [a.id, a.title]));
      const cs = (await base44.entities.Comment.filter({ target_type: 'article', target_id: { $in: arts.map((a) => a.id) }, status: COMMENT_LIVE }, { sort: '-created_date', limit: 50 })).items;
      return cs.map((c) => ({ ...c, title: titles[c.target_id] }));
    },
  });
  if (isLoading) return <p className="text-sm text-muted-foreground">Đang tải...</p>;
  if (!items?.length) return <p className="py-8 text-center text-sm text-muted-foreground">Chưa có bình luận nào được duyệt trên bài viết của bạn.</p>;
  return (
    <div className="divide-y rounded-2xl border bg-card">
      {items.map((c) => (
        <div key={c.id} className="space-y-1 p-3">
          <p className="text-sm font-medium">{c.author_name} <span className="font-normal text-muted-foreground">· {timeAgo(c.created_date)}</span></p>
          <p className="whitespace-pre-wrap break-words text-sm">{c.content}</p>
          <Link to={`/bai/${c.target_id}`} className="text-xs text-[#8A6D0B] underline">Trong bài: {c.title}</Link>
        </div>
      ))}
    </div>
  );
}