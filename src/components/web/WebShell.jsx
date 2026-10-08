import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopNav from '@/components/web/TopNav';
import Footer from '@/components/web/Footer';
import Splash from '@/components/app/Splash';
import EnsureProfile from '@/components/app/EnsureProfile';
import AccountGate from '@/components/app/AccountGate';
import { getPref } from '@/lib/pgds';

const SIZES = { s: '15px', m: '16px', l: '18px' };
const WIDE = ['/', '/tin-tuc', '/cong-dong', '/tin-nhan'];

export default function WebShell() {
  const { pathname } = useLocation();
  useEffect(() => {
    const apply = () => {
      document.documentElement.classList.toggle('dark', !!getPref('dark', false));
      document.documentElement.style.fontSize = SIZES[getPref('font', 'm')];
    };
    apply();
    window.addEventListener('pgds-prefs', apply);
    return () => window.removeEventListener('pgds-prefs', apply);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Splash />
      <EnsureProfile />
      <AccountGate />
      <TopNav />
      <main className={WIDE.includes(pathname) ? '' : 'mx-auto max-w-4xl'}><Outlet /></main>
      {pathname !== '/tin-nhan' && <Footer />}
    </div>
  );
}