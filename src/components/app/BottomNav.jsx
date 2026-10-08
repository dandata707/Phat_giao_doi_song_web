import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Newspaper, Users, Bell, User } from 'lucide-react';

const items = [
  { to: '/', label: 'Trang chủ', icon: Home, end: true },
  { to: '/tin-tuc', label: 'Tin tức', icon: Newspaper },
  { to: '/cong-dong', label: 'Cộng đồng', icon: Users },
  { to: '/thong-bao', label: 'Thông báo', icon: Bell },
  { to: '/tai-khoan', label: 'Tài khoản', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-xl -translate-x-1/2 border-t border-border/70 bg-card/95 backdrop-blur">
      <ul className="flex">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink to={to} end={end} className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${isActive ? 'text-[#8A6D0B] dark:text-[#C9A227]' : 'text-muted-foreground'}`}>
              {({ isActive }) => (
                <>
                  <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${isActive ? 'bg-[#C9A227]/25' : ''}`}>
                    <Icon className="h-[19px] w-[19px]" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}