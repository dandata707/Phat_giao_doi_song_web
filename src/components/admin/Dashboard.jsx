import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const E = base44.entities;
const CARDS = [
  ['articles', 'Bài tin tức'], ['posts', 'Bài đăng cộng đồng'], ['hidden', 'Bài đang bị ẩn'], ['comments', 'Bình luận'],
  ['topics', 'Chủ đề diễn đàn'], ['pending', 'Báo cáo chờ xử lý'], ['suspended', 'Tài khoản bị đình chỉ'], ['locked', 'Tài khoản bị khóa'],
];

export default function Dashboard() {
  const { data } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const r = await Promise.all([
        E.Article.count({}), E.Activity.count({}), E.Activity.count({ status: 'hidden' }), E.Comment.count({}),
        E.Topic.count({}), E.Report.count({ status: 'pending' }),
        E.Profile.count({ account_status: 'suspended' }), E.Profile.count({ account_status: 'locked' }),
      ]);
      return Object.fromEntries(CARDS.map(([k], i) => [k, r[i]]));
    },
  });
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CARDS.map(([k, l]) => (
        <div key={k} className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">{l}</p>
          <p className="mt-2 font-heading text-3xl font-bold">{data?.[k] ?? '–'}</p>
        </div>
      ))}
    </div>
  );
}