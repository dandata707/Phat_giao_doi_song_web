import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { memberUrl, nameOf } from '@/lib/social';

const E = base44.entities;

export default function AddFriendButton({ me, email, name }) {
  const qc = useQueryClient();
  const add = async () => {
    await E.Friendship.create({ requester_email: me.email, requester_name: nameOf(me), recipient_email: email, recipient_name: name, status: 'pending' });
    await E.Notification.create({ recipient_email: email, type: 'friend', title: `${nameOf(me)} đã gửi lời mời kết bạn`, link: memberUrl(me.email) });
    qc.invalidateQueries({ queryKey: ['social'] });
    qc.invalidateQueries({ queryKey: ['rel'] });
  };
  return <Button size="sm" className="rounded-full" onClick={add}><UserPlus className="mr-1 h-3.5 w-3.5" />Kết bạn</Button>;
}