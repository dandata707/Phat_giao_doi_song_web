import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/social/UserAvatar';
import { useMe, goLogin } from '@/lib/pgds';
import { nameOf } from '@/lib/social';

const itemCls = 'block rounded-lg px-3 py-2 text-sm hover:bg-[#C9A227]/20';

export default function UserMenu() {
  const { data: me, isLoading } = useMe();
  if (isLoading) return null;
  if (!me) return <Button onClick={goLogin} className="rounded-full bg-[#C9A227] text-[#2b2108] hover:bg-[#b8921f]">Đăng nhập</Button>;
  const staff = ['editor', 'admin'].includes(me.role);
  return (
    <div className="group relative">
      <Link to="/tai-khoan" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-muted">
        <UserAvatar name={nameOf(me)} className="h-9 w-9" />
        <span className="max-w-[140px] truncate text-sm font-medium">{nameOf(me)}</span>
      </Link>
      <div className="invisible absolute right-0 top-full z-50 pt-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
        <div className="min-w-[220px] rounded-xl border bg-card p-2 shadow-xl">
          <Link to="/tai-khoan" className={itemCls}>Tài khoản của tôi</Link>
          <Link to={`/thanh-vien/${encodeURIComponent(me.email)}`} className={itemCls}>Trang cá nhân</Link>
          <Link to="/cong-tac-vien" className={itemCls}>Cộng tác viên</Link>
          {staff && <Link to="/bien-tap" className={itemCls}>Biên tập</Link>}
          {me.role === 'admin' && <Link to="/admin" className={itemCls}>Quản trị</Link>}
          <button onClick={() => base44.auth.logout('/')} className={`${itemCls} w-full text-left text-destructive`}>Đăng xuất</button>
        </div>
      </div>
    </div>
  );
}