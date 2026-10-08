import React from 'react';

export default function ArticleBody({ content }) {
  const blocks = (content || '').split(/\n\s*\n/).filter(Boolean);
  return (
    <div className="mt-5 space-y-4">
      {blocks.map((b, i) =>
        b.startsWith('## ') ? (
          <h2 key={i} className="pt-2 font-heading text-xl font-semibold">{b.slice(3)}</h2>
        ) : (
          <p key={i} className="text-[1.0625rem] leading-[1.85]">{b}</p>
        )
      )}
    </div>
  );
}