import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Bell, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import NavDropdown from '@/components/web/NavDropdown';
import UserMenu from '@/components/web/UserMenu';
import MobileMenu from '@/components/web/MobileMenu';
import { MENU } from '@/components/web/menu';
import { LOGO_URL, useMe } from '@/lib/pgds';

export default function TopNav() {
  const { data: me } = useMe();
  const { data: unread = 0 } = useQuery({
    queryKey: ['unread', me?.email],
    enabled: !!me,
    refetchInterval: 15000,
    queryFn: () => base44.entities.Message.count({ recipient_email: me.email, read: false }),
  });
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-2 px-3 sm:px-6 lg:gap-8 xl:px-10">
        <MobileMenu />
        <Link to="/" className="shrink-0"><img src={LOGO_URL} alt="Phật Giáo Đời Sống" className="h-9 w-auto sm:h-11" /></Link>
        <nav className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {MENU.map((m) => (
              <li key={m.label} className="group relative">
                <NavLink to={m.to} end={m.end} className={({ isActive }) =>
                  `block rounded-full px-4 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors hover:bg-[#C9A227]/20 ${isActive ? 'text-[#8A6D0B] dark:text-[#C9A227]' : 'text-foreground'}`}>
                  {m.label}
                </NavLink>
                {m.children && <NavDropdown items={m.children} />}
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-0.5 sm:gap-1 lg:ml-0">
          <Link to="/tim-kiem" aria-label="Tìm kiếm" className="rounded-full p-2.5 hover:bg-muted"><Search className="h-5 w-5" /></Link>
          <Link to="/tin-nhan" aria-label="Tin nhắn" className="relative rounded-full p-2.5 hover:bg-muted">
            <MessageCircle className="h-5 w-5" />
            {unread > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">{unread}</span>}
          </Link>
          <Link to="/thong-bao" aria-label="Thông báo" className="rounded-full p-2.5 hover:bg-muted"><Bell className="h-5 w-5" /></Link>
          <div className="ml-1 sm:ml-2"><UserMenu /></div>
        </div>
      </div>
    </header>
  );
}