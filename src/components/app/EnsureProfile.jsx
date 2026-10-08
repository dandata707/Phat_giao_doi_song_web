import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMe } from '@/lib/pgds';
import { nameOf } from '@/lib/social';

const done = new Set();

export default function EnsureProfile() {
  const { data: me } = useMe();
  useEffect(() => {
    if (!me || done.has(me.email)) return;
    done.add(me.email);
    (async () => {
      const r = await base44.entities.Profile.filter({ user_email: me.email }, { limit: 1 });
      if (!r.items.length) await base44.entities.Profile.create({ user_email: me.email, display_name: nameOf(me), bio: me.bio || '' });
    })();
  }, [me?.email]);
  return null;
}