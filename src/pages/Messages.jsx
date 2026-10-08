import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';
import { useConversations } from '@/components/chat/useChat';
import { useMe, goLogin } from '@/lib/pgds';

export default function Messages() {
  const { data: me, isLoading } = useMe();
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const withEmail = params.get('with') || '';
  const { data: convs = [] } = useConversations(me?.email);

  useEffect(() => {
    if (!me) return undefined;
    return base44.entities.Message.subscribe((ev) => {
      if (ev.data?.sender_email === me.email || ev.data?.recipient_email === me.email) {
        ['convs', 'chat', 'unread'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
      }
    });
  }, [me?.email]);

  if (isLoading) return null;
  if (!me) {
    return <div className="p-16 text-center"><p>Đăng nhập để nhắn tin với bạn bè.</p><Button onClick={goLogin} className="mt-4">Đăng nhập</Button></div>;
  }
  const other = withEmail ? (convs.find((c) => c.email === withEmail) || { email: withEmail, name: '' }) : null;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-[1500px] border-x bg-card">
      <aside className={`${other ? 'hidden md:block' : 'block'} w-full shrink-0 border-r md:w-[380px]`}>
        <ConversationList me={me.email} convs={convs} activeEmail={withEmail} onSelect={(e) => setParams({ with: e }, { replace: true })} />
      </aside>
      <section className={`${other ? 'block' : 'hidden md:flex'} min-w-0 flex-1 flex-col items-stretch justify-center`}>
        {other
          ? <ChatWindow key={other.email} me={me} other={other} onBack={() => setParams({}, { replace: true })} />
          : <div className="m-auto text-center text-muted-foreground"><MessageCircle className="mx-auto h-14 w-14 opacity-40" /><p className="mt-3">Chọn một người bạn để bắt đầu trò chuyện</p></div>}
      </section>
    </div>
  );
}