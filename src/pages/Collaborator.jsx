import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Clock, CheckCircle2, RotateCcw, MessagesSquare, Megaphone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MyArticles from '@/components/collab/MyArticles';
import MyPosts from '@/components/collab/MyPosts';
import CollabStats from '@/components/collab/CollabStats';
import CollabComments from '@/components/collab/CollabComments';
import { useMe, goLogin, canWrite, LOGO_URL } from '@/lib/pgds';

const WRITER_TABS = [
  ['dashboard', 'Tổng quan', LayoutDashboard], ['all', 'Tất cả bài viết', FileText], ['pending', 'Chờ duyệt', Clock],
  ['approved', 'Đã duyệt', CheckCircle2], ['rejected', 'Cần sửa lại', RotateCcw], ['comments', 'Bình luận', MessagesSquare],
];
const POSTS_TAB = ['posts', 'Bài đăng của tôi', Megaphone];

export default function Collaborator() {
  const { data: me, isLoading } = useMe();
  const [tab, setTab] = useState(null);
  if (isLoading) return null;
  if (!me) return <div className="p-10 text-center"><p className="mb-3">Đăng nhập để xem bài viết của bạn.</p><Button onClick={goLogin}>Đăng nhập</Button></div>;
  const tabs = canWrite(me) ? [...WRITER_TABS, POSTS_TAB] : [POSTS_TAB];
  const cur = tab || tabs[0][0];

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 md:flex-row">
      <aside className="border-b bg-card md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 p-4"><img src={LOGO_URL} alt="" className="h-9 w-auto" /><span className="font-heading font-bold">Cộng tác viên</span></div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {tabs.map(([v, l, Icon]) => (
            <button key={v} onClick={() => setTab(v)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${cur === v ? 'bg-[#C9A227] text-[#2b2108]' : 'hover:bg-muted'}`}>
              <Icon className="h-4 w-4" />{l}
            </button>
          ))}
          <Link to="/tai-khoan" className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground md:mt-4"><ArrowLeft className="h-4 w-4" />Về ứng dụng</Link>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <h1 className="mb-1 font-heading text-2xl font-bold">{tabs.find((t) => t[0] === cur)[1]}</h1>
        <p className="mb-5 text-sm text-muted-foreground">Bài viết được gửi tới biên tập viên và chỉ hiển thị sau khi được duyệt.</p>
        {cur === 'dashboard' && <CollabStats me={me} onPick={setTab} />}
        {['all', 'pending', 'approved', 'rejected'].includes(cur) && <MyArticles key={cur} me={me} mode={cur} />}
        {cur === 'comments' && <CollabComments me={me} />}
        {cur === 'posts' && <MyPosts me={me} />}
      </main>
    </div>
  );
}