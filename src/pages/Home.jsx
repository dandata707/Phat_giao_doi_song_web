import React from 'react';
import Feed from '@/components/app/Feed';
import LunarCalendar from '@/components/app/LunarCalendar';
import HomeEvents from '@/components/web/HomeEvents';
import HomeForum from '@/components/web/HomeForum';

export default function Home() {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:px-8">
      <main className="w-full"><Feed /></main>
      <aside className="space-y-5">
        <LunarCalendar />
        <HomeEvents />
        <HomeForum />
      </aside>
    </div>
  );
}