import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const E = base44.entities;

export function useConversations(my) {
  return useQuery({
    queryKey: ['convs', my],
    enabled: !!my,
    queryFn: async () => {
      const [msgs, fr] = await Promise.all([
        E.Message.filter({ $or: [{ sender_email: my }, { recipient_email: my }] }, { sort: '-created_date', limit: 200 }),
        E.Friendship.filter({ status: 'accepted', $or: [{ requester_email: my }, { recipient_email: my }] }, { limit: 100 }),
      ]);
      const map = new Map();
      msgs.items.forEach((m) => {
        const mine = m.sender_email === my;
        const email = mine ? m.recipient_email : m.sender_email;
        if (!map.has(email)) map.set(email, { email, name: mine ? m.recipient_name : m.sender_name, last: m, unread: 0 });
        if (!mine && !m.read) map.get(email).unread += 1;
      });
      fr.items.forEach((f) => {
        const mine = f.requester_email === my;
        const email = mine ? f.recipient_email : f.requester_email;
        if (!map.has(email)) map.set(email, { email, name: mine ? f.recipient_name : f.requester_name, last: null, unread: 0 });
      });
      return [...map.values()];
    },
  });
}