import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const E = base44.entities;
const MAP = { article: 'Article', activity: 'Activity', comment: 'Comment', topic: 'Topic' };

export default function AuthorActions({ report, onDone }) {
  const { data: email } = useQuery({
    queryKey: ['ra', report.target_type, report.target_id],
    queryFn: async () => {
      if (report.target_type === 'user') return report.target_id;
      const x = await E[MAP[report.target_type]]?.get(report.target_id).catch(() => null);
      return x?.author_email || null;
    },
  });
  if (!email) return null;

  const act = async (account_status, ask) => {
    const reason = (prompt(ask) || '').trim();
    if (!reason) return;
    const found = (await E.Profile.filter({ user_email: email }, { limit: 1 })).items[0];
    if (found) await E.Profile.update(found.id, { account_status, status_reason: reason });
    else await E.Profile.create({ user_email: email, account_status, status_reason: reason });
    toast({ title: account_status === 'locked' ? 'Đã khóa tài khoản' : 'Đã đình chỉ tài khoản', description: email });
    onDone(account_status);
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => act('suspended', 'Lý do đình chỉ tài khoản tác giả:')}>Đình chỉ tác giả</Button>
      <Button size="sm" variant="outline" className="text-destructive" onClick={() => act('locked', 'Lý do khóa tài khoản tác giả:')}>Khóa tác giả</Button>
    </>
  );
}