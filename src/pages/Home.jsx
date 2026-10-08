import React from 'react';
import Feed from '@/components/app/Feed';
import LunarCalendar from '@/components/app/LunarCalendar';
import SideSuggestions from '@/components/social/SideSuggestions';
import HomeEvents from '@/components/web/HomeEvents';
import HomeForum from '@/components/web/HomeForum';

export default function Home() {
  return (
    <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)_300px] xl:grid-cols-[340px_minmax(0,1fr)_340px] xl:px-8">
      <aside className="hidden lg:block"><SideSuggestions /></aside>
      <main className="mx-auto w-full max-w-[680px]"><Feed /></main>
      <div className="space-y-5 lg:hidden"><HomeEvents /><SideSuggestions /></div>
      <aside className="hidden space-y-5 lg:block">
        <LunarCalendar />
        <HomeEvents />
        <HomeForum />
      </aside>
    </div>
  );
}