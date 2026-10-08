import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Send } from 'lucide-react';
import moment from 'moment';
import { base44 } from '@/api/base44Client';
import UserAvatar from '@/components/social/UserAvatar';
import { useProfile, memberUrl, nameOf } from '@/lib/social';

const E = base44.entities;

export default function ChatWindow({ me, other, onBack }) {
  const qc = useQueryClient();
  const { data: profile } = useProfile(other.email);
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const name = profile?.display_name || other.name || other.email.split('@')[0];

  const { data: msgs = [] } = useQuery({
    queryKey: ['chat', me.email, other.email],
    queryFn: async () => (await E.Message.filter({ $or: [
      { sender_email: me.email, recipient_email: other.email },
      { sender_email: other.email, recipient_email: me.email },
    ] }, { sort: '-created_date', limit: 100 })).items.reverse(),
  });

  const refresh = () => ['convs', 'chat', 'unread'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
    if (msgs.some((m) => m.sender_email === other.email && !m.read)) {
      E.Message.updateMany({ sender_email: other.email, recipient_email: me.email, read: false }, { $set: { read: true } }).then(refresh);
    }
  }, [msgs.length, other.email]);

  const send = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setText('');
    await E.Message.create({ sender_email: me.email, sender_name: nameOf(me), recipient_email: other.email, recipient_name: name, content, read: false });
    await E.Notification.create({ recipient_email: other.email, type: 'message', title: `${nameOf(me)} đã gửi tin nhắn cho bạn`, body: content, link: `/tin-nhan?with=${encodeURIComponent(me.email)}` });
    refresh();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <button onClick={onBack} aria-label="Quay lại" className="rounded-full p-2 hover:bg-muted md:hidden"><ArrowLeft className="h-5 w-5" /></button>
        <UserAvatar src={profile?.avatar} name={name} className="h-10 w-10" />
        <Link to={memberUrl(other.email)} className="font-semibold hover:underline">{name}</Link>
      </div>
      <div className="flex-1 space-y-1.5 overflow-y-auto bg-muted/30 p-5">
        {msgs.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Hãy gửi lời chào đến {name} 🙏</p>}
        {msgs.map((m, i) => {
          const mine = m.sender_email === me.email;
          const showTime = i === 0 || new Date(m.created_date) - new Date(msgs[i - 1].created_date) > 30 * 60000;
          return (
            <div key={m.id}>
              {showTime && <p className="py-2 text-center text-[11px] text-muted-foreground">{moment(m.created_date).format('HH:mm, DD/MM/YYYY')}</p>}
              <div className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                {!mine && <UserAvatar src={profile?.avatar} name={name} className="h-7 w-7 shrink-0" />}
                <div title={moment(m.created_date).format('HH:mm DD/MM/YYYY')} className={`max-w-[65%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm ${mine ? 'rounded-br-md bg-[#C9A227] text-[#2b2108]' : 'rounded-bl-md bg-card shadow-sm'}`}>{m.content}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="flex items-center gap-2 border-t p-3">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Aa" className="h-11 flex-1 rounded-full bg-muted px-5 text-sm outline-none" />
        <button type="submit" aria-label="Gửi" disabled={!text.trim()} className="rounded-full bg-[#C9A227] p-3 text-[#2b2108] transition-opacity disabled:opacity-40"><Send className="h-4 w-4" /></button>
      </form>
    </div>
  );
}