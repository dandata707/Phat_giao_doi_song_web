import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell, Newspaper, MessageCircle, Heart, AtSign, UserPlus, Mail, CheckCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/app/PageHeader';
import { useMe, timeAgo, getPref, setPref } from '@/lib/pgds';

const ICONS = { breaking: Bell, new_post: Newspaper, comment: MessageCircle, like: Heart, mention: AtSign, friend: UserPlus, message: Mail };

export default function Notifications() {
  const navigate = useNavigate();
  const { data: me } = useMe();
  const [read, setRead] = useState(getPref('read', []));
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['notifs', me?.email],
    enabled: me !== undefined,
    queryFn: async () => (await base44.entities.Notification.filter({ recipient_email: { $in: me ? ['all', me.email] : ['all'] } }, { sort: '-created_date', limit: 50 })).items,
  });
  const markRead = (ids) => { const r = [...new Set([...read, ...ids])]; setRead(r); setPref('read', r); };
  const open = (n) => { markRead([n.id]); if (n.link) navigate(n.link); };

  return (
    <div>
      <PageHeader title="Thông báo" right={items.length > 0 && (
        <button onClick={() => markRead(items.map((n) => n.id))} className="flex items-center gap-1 text-xs font-medium text-[#8A6D0B] dark:text-[#C9A227]"><CheckCheck className="h-4 w-4" />Đọc hết</button>
      )} />
      <div className="px-5 pt-2">
        {isLoading && <p className="py-10 text-center text-sm text-muted-foreground">Đang tải...</p>}
        {!isLoading && items.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Chưa có thông báo nào.</p>}
        {items.map((n) => {
          const Icon = ICONS[n.type] || Bell;
          const unread = !read.includes(n.id);
          return (
            <button key={n.id} onClick={() => open(n)} className="flex w-full gap-3 border-b border-border/60 py-4 text-left">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${unread ? 'bg-[#C9A227] text-[#2b2108]' : 'bg-muted text-muted-foreground'}`}><Icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className={`block text-sm ${unread ? 'font-semibold' : ''}`}>{n.title}</span>
                {n.body && <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{n.body}</span>}
                <span className="mt-1 block text-[11px] text-muted-foreground">{timeAgo(n.created_date)}</span>
              </span>
              {unread && <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#C9A227]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}