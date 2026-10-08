import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, CornerDownRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ContentMenu from '@/components/app/ContentMenu';
import { useMe, goLogin, timeAgo, getBlocked, COMMENT_LIVE, isEditor } from '@/lib/pgds';
import { toast } from '@/components/ui/use-toast';
import { useProfile } from '@/lib/social';
import SuspendedNotice from '@/components/app/SuspendedNotice';

export default function CommentSection({ targetType, targetId, onChanged }) {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: profile } = useProfile(me?.email);
  const [text, setText] = useState('');
  const key = ['comments', targetType, targetId];
  const { data: items = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => (await base44.entities.Comment.filter({ target_type: targetType, target_id: targetId, status: COMMENT_LIVE }, { sort: 'created_date', limit: 100 })).items,
  });
  const refresh = () => { qc.invalidateQueries({ queryKey: key }); qc.invalidateQueries({ queryKey: ['cc', targetType, targetId] }); onChanged?.(); };
  const add = useMutation({
    mutationFn: () => base44.entities.Comment.create({ target_type: targetType, target_id: targetId, content: text.trim(), author_name: me.full_name || me.email, author_email: me.email, status: isEditor(me) ? 'approved' : 'pending' }),
    onSuccess: () => {
      setText(''); refresh();
      if (!isEditor(me)) toast({ title: 'Bình luận đã được gửi', description: 'Bình luận sẽ hiển thị sau khi biên tập viên duyệt.' });
    },
  });
  const blocked = getBlocked();

  return (
    <section className="space-y-4">
      {isLoading && <p className="text-sm text-muted-foreground">Đang tải bình luận...</p>}
      {!isLoading && items.length === 0 && <p className="text-sm text-muted-foreground">Chưa có bình luận nào.</p>}
      {items.filter((c) => !blocked.includes(c.author_email)).map((c) => (
        <div key={c.id} className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/25 text-sm font-semibold text-[#6b530a] dark:text-[#C9A227]">
            {(c.author_name || '?')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
              <p className="text-sm font-semibold">{c.author_name}</p>
              <p className="whitespace-pre-wrap break-words text-sm">{c.content}</p>
            </div>
            <div className="mt-1 flex items-center gap-3 px-1 text-xs text-muted-foreground">
              <span>{timeAgo(c.created_date)}</span>
              <button onClick={() => setText(`@${c.author_name} `)} className="flex items-center gap-1 font-medium"><CornerDownRight className="h-3 w-3" />Trả lời</button>
              <ContentMenu targetType="comment" targetId={c.id} authorEmail={c.author_email}
                onDelete={async () => { await base44.entities.Comment.delete(c.id); refresh(); }} />
            </div>
          </div>
        </div>
      ))}
      {profile?.account_status === 'suspended' ? (
        <SuspendedNotice reason={profile.status_reason} />
      ) : me ? (
        <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) add.mutate(); }} className="flex gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Viết bình luận..." className="h-11 rounded-full" />
          <Button type="submit" disabled={!text.trim() || add.isPending} className="h-11 shrink-0 rounded-full px-4"><Send className="mr-1.5 h-4 w-4" />Gửi bình luận</Button>
        </form>
      ) : (
        <Button variant="outline" onClick={goLogin} className="w-full rounded-full">Đăng nhập để bình luận</Button>
      )}
    </section>
  );
}