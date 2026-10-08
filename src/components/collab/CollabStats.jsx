import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const A = base44.entities.Article;

export default function CollabStats({ me, onPick }) {
  const { data } = useQuery({
    queryKey: ['my', 'stats', me.email],
    queryFn: async () => {
      const m = { author_email: me.email };
      const [all, pending, rejected, approved] = await Promise.all([
        A.count(m),
        A.count({ ...m, status: 'pending' }),
        A.count({ ...m, status: 'rejected' }),
        A.count({ ...m, status: { $nin: ['pending', 'rejected', 'removed'] } }),
      ]);
      return { all, pending, rejected, approved };
    },
  });
  const CARDS = [['all', 'Tổng số bài', 'bg-muted'], ['pending', 'Chờ duyệt', 'bg-amber-100 text-amber-900'], ['approved', 'Đã duyệt', 'bg-green-100 text-green-900'], ['rejected', 'Cần sửa lại', 'bg-red-100 text-red-900']];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {CARDS.map(([k, l, c]) => (
        <button key={k} onClick={() => onPick(k)} className={`rounded-2xl p-4 text-left ${c}`}>
          <p className="text-3xl font-bold">{data ? data[k] : '–'}</p>
          <p className="text-sm">{l}</p>
        </button>
      ))}
    </div>
  );
}