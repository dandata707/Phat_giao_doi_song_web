import React from 'react';
import { solarToLunar, canChi, WEEKDAYS, pad } from '@/lib/lunar';

export default function LunarCalendar() {
  const now = new Date();
  const d = now.getDate(), m = now.getMonth() + 1, y = now.getFullYear();
  const l = solarToLunar(d, m, y);
  return (
    <section className="mx-5 mt-1 flex items-stretch overflow-hidden rounded-3xl bg-gradient-to-br from-[#C9A227] to-[#e0bf4f] text-[#2b2108] shadow-sm">
      <div className="flex-1 border-r border-[#2b2108]/15 p-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wider">Dương lịch · Tháng {m}/{y}</p>
        <p className="font-heading text-5xl font-bold leading-tight">{d}</p>
        <p className="text-sm font-medium">{WEEKDAYS[now.getDay()]}</p>
      </div>
      <div className="flex-1 p-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wider">Âm lịch · Tháng {l.month}{l.leap ? ' nhuận' : ''}</p>
        <p className="font-heading text-5xl font-bold leading-tight">{l.day}</p>
        <p className="text-sm font-medium">Năm {canChi(l.year)}</p>
      </div>
    </section>
  );
}