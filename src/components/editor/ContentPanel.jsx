import React, { useState } from 'react';
import ContentList from '@/components/editor/ContentList';

export default function ContentPanel({ mode }) {
  const [kind, setKind] = useState('article');
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {[['article', 'Tin tức'], ['activity', 'Bài đăng thành viên']].map(([v, l]) => (
          <button key={v} onClick={() => setKind(v)} className={`rounded-full px-4 py-1.5 text-sm ${kind === v ? 'bg-[#C9A227] text-[#2b2108]' : 'bg-muted'}`}>{l}</button>
        ))}
      </div>
      <ContentList key={kind + mode} kind={kind} mode={mode} />
    </div>
  );
}