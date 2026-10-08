import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_URL } from '@/lib/pgds';

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground xl:px-10">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="" className="h-10 w-auto" />
          <span>© Phật Giáo Đời Sống – Lan tỏa tinh thần từ bi, trí tuệ.</span>
        </div>
        <div className="flex gap-6">
          <Link to="/tin-tuc" className="hover:text-foreground">Tin tức</Link>
          <Link to="/cong-dong" className="hover:text-foreground">Cộng đồng</Link>
          <Link to="/dieu-khoan" className="hover:text-foreground">Điều khoản</Link>
        </div>
      </div>
    </footer>
  );
}