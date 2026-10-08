import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMe, goLogin } from '@/lib/pgds';

export default function TopicVote({ t, horizontal }) {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const up = t.upvoted_by || [];
  const down = t.downvoted_by || [];
  const isUp = !!me && up.includes(me.email);
  const isDown = !!me && down.includes(me.email);

  const vote = async (dir) => {
    if (!me) return goLogin();
    const u = up.filter((e) => e !== me.email);
    const d = down.filter((e) => e !== me.email);
    if (dir === 'up' && !isUp) u.push(me.email);
    if (dir === 'down' && !isDown) d.push(me.email);
    await base44.entities.Topic.update(t.id, { upvoted_by: u, downvoted_by: d, score: u.length - d.length });
    qc.invalidateQueries({ queryKey: ['topics'] });
    qc.invalidateQueries({ queryKey: ['topic', t.id] });
  };

  return (
    <div className={`flex items-center gap-0.5 ${horizontal ? 'rounded-full bg-muted px-1' : 'flex-col'}`}>
      <button aria-label="Ủng hộ" onClick={() => vote('up')} className="rounded p-0.5"><ArrowBigUp className={`h-6 w-6 ${isUp ? 'fill-[#C9A227] text-[#C9A227]' : 'text-muted-foreground'}`} /></button>
      <span className={`text-xs font-bold ${isUp ? 'text-[#8A6D0B]' : isDown ? 'text-sky-600' : ''}`}>{t.score || 0}</span>
      <button aria-label="Không ủng hộ" onClick={() => vote('down')} className="rounded p-0.5"><ArrowBigDown className={`h-6 w-6 ${isDown ? 'fill-sky-500 text-sky-500' : 'text-muted-foreground'}`} /></button>
    </div>
  );
}