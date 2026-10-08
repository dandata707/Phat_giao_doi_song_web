import React, { useState } from 'react';
import { Search } from 'lucide-react';
import UserAvatar from '@/components/social/UserAvatar';
import { timeAgo } from '@/lib/pgds';

export default function ConversationList({ me, convs, activeEmail, onSelect }) {
  const [term, setTerm] = useState('');
  const list = convs.filter((c) => (c.name || c.email).toLowerCase().includes(term.toLowerCase()));
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b p-4">
        <h1 className="font-heading text-2xl font-bold">Đoạn chat</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Tìm kiếm bạn bè" className="h-9 w-full rounded-full bg-muted pl-9 pr-3 text-sm outline-none" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {list.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Chưa có cuộc trò chuyện nào. Hãy kết bạn để bắt đầu nhắn tin.</p>}
        {list.map((c) => {
          const name = c.name || c.email.split('@')[0];
          const mineLast = c.last?.sender_email === me;
          return (
            <button key={c.email} onClick={() => onSelect(c.email)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${activeEmail === c.email ? 'bg-[#C9A227]/20' : 'hover:bg-muted'}`}>
              <UserAvatar name={name} className="h-12 w-12 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className={`truncate text-sm ${c.unread ? 'font-bold' : 'font-semibold'}`}>{name}</p>
                  {c.last && <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(c.last.created_date)}</span>}
                </div>
                <p className={`truncate text-xs ${c.unread ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {c.last ? `${mineLast ? 'Bạn: ' : ''}${c.last.content}` : 'Bắt đầu cuộc trò chuyện'}
                </p>
              </div>
              {c.unread > 0 && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#C9A227]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}