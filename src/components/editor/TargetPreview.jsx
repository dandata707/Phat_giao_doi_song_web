import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const MAP = { article: 'Article', activity: 'Activity', comment: 'Comment', topic: 'Topic' };

export default function TargetPreview({ type, id }) {
  const { data, isLoading } = useQuery({
    queryKey: ['tp', type, id],
    enabled: !!MAP[type],
    queryFn: () => base44.entities[MAP[type]].get(id).catch(() => null),
  });
  if (!MAP[type]) return null;
  if (isLoading) return <p className="text-xs text-muted-foreground">Đang tải nội dung...</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nội dung không còn tồn tại.</p>;
  return (
    <div className="rounded-xl bg-muted px-3 py-2 text-sm">
      {data.status && <p className="text-xs text-muted-foreground">Trạng thái: {data.status}</p>}
      <p className="line-clamp-3 whitespace-pre-wrap">{data.title || data.content || data.body}</p>
      {type === 'article' && <Link to={`/bai/${id}`} className="text-xs text-[#8A6D0B] underline">Xem bài</Link>}
    </div>
  );
}