import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Newspaper, MessageSquare, MessagesSquare, Flag, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Dashboard from '@/components/admin/Dashboard';
import ArticlesAdmin from '@/components/admin/ArticlesAdmin';
import PostsAdmin from '@/components/admin/PostsAdmin';
import CommentsAdmin from '@/components/admin/CommentsAdmin';
import ReportsAdmin from '@/components/admin/ReportsAdmin';
import UsersAdmin from '@/components/admin/UsersAdmin';
import { useMe, goLogin, LOGO_URL } from '@/lib/pgds';

const TABS = [
  ['dash', 'Tổng quan', LayoutDashboard], ['articles', 'Tin tức', Newspaper], ['posts', 'Bài đăng', MessageSquare],
  ['comments', 'Bình luận', MessagesSquare], ['reports', 'Báo cáo', Flag], ['users', 'Tài khoản', Users],
];

export default function Admin() {
  const { data: me, isLoading } = useMe();
  const [tab, setTab] = useState('dash');
  const [userSearch, setUserSearch] = useState('');
  if (isLoading) return null;
  if (!me) return <div className="p-10 text-center"><p className="mb-3">Đăng nhập bằng tài khoản quản trị.</p><Button onClick={goLogin}>Đăng nhập</Button></div>;
  if (me.role !== 'admin') return <div className="p-10 text-center"><p className="mb-3">Bạn không có quyền truy cập trang quản trị.</p><Link to="/" className="underline">Về trang chủ</Link></div>;

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 md:flex-row">
      <aside className="border-b bg-card md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 p-4"><img src={LOGO_URL} alt="" className="h-9 w-auto" /><span className="font-heading font-bold">Quản trị</span></div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {TABS.map(([v, l, Icon]) => (
            <button key={v} onClick={() => setTab(v)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${tab === v ? 'bg-[#C9A227] text-[#2b2108]' : 'hover:bg-muted'}`}>
              <Icon className="h-4 w-4" />{l}
            </button>
          ))}
          <Link to="/" className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground md:mt-4"><ArrowLeft className="h-4 w-4" />Về ứng dụng</Link>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <h1 className="mb-5 font-heading text-2xl font-bold">{TABS.find((t) => t[0] === tab)[1]}</h1>
        {tab === 'dash' && <Dashboard />}
        {tab === 'articles' && <ArticlesAdmin />}
        {tab === 'posts' && <PostsAdmin />}
        {tab === 'comments' && <CommentsAdmin />}
        {tab === 'reports' && <ReportsAdmin onOpenUser={(e) => { setUserSearch(e); setTab('users'); }} />}
        {tab === 'users' && <UsersAdmin key={userSearch} initialSearch={userSearch} />}
      </main>
    </div>
  );
}