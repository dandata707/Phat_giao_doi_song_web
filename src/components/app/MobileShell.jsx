import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/app/BottomNav';
import Splash from '@/components/app/Splash';
import EnsureProfile from '@/components/app/EnsureProfile';
import AccountGate from '@/components/app/AccountGate';
import { getPref } from '@/lib/pgds';

const SIZES = { s: '15px', m: '16px', l: '18px' };

export default function MobileShell() {
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
    <div className="min-h-screen bg-stone-200/50 dark:bg-black">
      <div className="relative mx-auto min-h-screen max-w-xl bg-background pb-24 shadow-xl">
        <Splash />
        <EnsureProfile />
        <AccountGate />
        <Outlet />
        <BottomNav />
      </div>
    </div>
  );
}