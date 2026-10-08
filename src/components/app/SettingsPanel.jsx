import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { getPref, setPref } from '@/lib/pgds';

const NOTIFS = [['breaking', 'Tin nóng'], ['new_post', 'Bài mới theo chuyên mục'], ['personal', 'Bình luận, lượt thích, nhắc tên']];
const SIZES = [['s', 'Nhỏ'], ['m', 'Vừa'], ['l', 'Lớn']];

export default function SettingsPanel() {
  const [, force] = useState(0);
  const set = (k, v) => { setPref(k, v); force((n) => n + 1); };
  const font = getPref('font', 'm');
  return (
    <div className="space-y-5 rounded-3xl border bg-card p-5">
      <div className="flex items-center justify-between"><span className="text-sm font-medium">Chế độ tối</span><Switch checked={!!getPref('dark', false)} onCheckedChange={(v) => set('dark', v)} /></div>
      <div>
        <p className="mb-2 text-sm font-medium">Cỡ chữ</p>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map(([v, l]) => (
            <button key={v} onClick={() => set('font', v)} className={`rounded-full py-2 text-sm ${font === v ? 'bg-[#C9A227] font-semibold text-[#2b2108]' : 'bg-muted'}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3 border-t pt-4">
        <p className="text-sm font-medium">Thông báo</p>
        {NOTIFS.map(([k, l]) => (
          <div key={k} className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{l}</span>
            <Switch checked={getPref('n_' + k, true)} onCheckedChange={(v) => set('n_' + k, v)} /></div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t pt-4"><span className="text-sm">Thu thập số liệu ẩn danh</span><Switch checked={getPref('analytics', true)} onCheckedChange={(v) => set('analytics', v)} /></div>
    </div>
  );
}