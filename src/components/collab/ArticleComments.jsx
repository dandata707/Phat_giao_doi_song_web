import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { COMMENT_LIVE, timeAgo } from '@/lib/pgds';

export default function ArticleComments({ article, onClose }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['my', 'comments', article.id],
    queryFn: async () => (await base44.entities.Comment.filter({ target_type: 'article', target_id: article.id, status: COMMENT_LIVE }, { sort: '-created_date', limit: 50 })).items,
  });
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="line-clamp-2">Bình luận: {article.title}</DialogTitle></DialogHeader>
        {isLoading && <p className="text-sm text-muted-foreground">Đang tải...</p>}
        {!isLoading && data.length === 0 && <p className="text-sm text-muted-foreground">Chưa có bình luận nào được duyệt.</p>}
        <div className="space-y-3">
          {data.map((c) => (
            <div key={c.id} className="rounded-2xl bg-muted px-3.5 py-2.5">
              <p className="text-sm font-semibold">{c.author_name} <span className="font-normal text-muted-foreground">· {timeAgo(c.created_date)}</span></p>
              <p className="whitespace-pre-wrap break-words text-sm">{c.content}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}