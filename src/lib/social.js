import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const E = base44.entities;
const enc = (email) => `/thanh-vien/${encodeURIComponent(email)}`;
export const memberUrl = enc;

export const useProfile = (email) => useQuery({
  queryKey: ['profile', email],
  enabled: !!email,
  queryFn: async () => (await E.Profile.filter({ user_email: email }, { limit: 1 })).items[0] || null,
});

export const useRelation = (my, email) => useQuery({
  queryKey: ['rel', my, email],
  enabled: !!my && !!email && my !== email,
  queryFn: async () => {
    const [f, fo, b] = await Promise.all([
      E.Friendship.filter({ $or: [{ requester_email: my, recipient_email: email }, { requester_email: email, recipient_email: my }] }, { limit: 1 }),
      E.Follow.filter({ follower_email: my, following_email: email }, { limit: 1 }),
      E.Block.filter({ $or: [{ blocker_email: my, blocked_email: email }, { blocker_email: email, blocked_email: my }] }, { limit: 5 }),
    ]);
    return {
      friendship: f.items[0] || null,
      follow: fo.items[0] || null,
      blockedByMe: b.items.some((x) => x.blocker_email === my),
      blockedMe: b.items.some((x) => x.blocker_email === email),
    };
  },
});

export const useStats = (email) => useQuery({
  queryKey: ['social', 'stats', email],
  enabled: !!email,
  queryFn: async () => {
    const [posts, friends, followers] = await Promise.all([
      E.Activity.count({ author_email: email, privacy: 'public' }),
      E.Friendship.count({ status: 'accepted', $or: [{ requester_email: email }, { recipient_email: email }] }),
      E.Follow.count({ following_email: email }),
    ]);
    return { posts, friends, followers };
  },
});

export const saveProfile = (me, profile, patch) =>
  profile?.id
    ? E.Profile.update(profile.id, patch)
    : E.Profile.create({ user_email: me.email, display_name: me.display_name || me.full_name || me.email.split('@')[0], ...patch });

export const nameOf = (me) => me.display_name || me.full_name || me.email.split('@')[0];