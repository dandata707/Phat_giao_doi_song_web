import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '@/components/social/UserAvatar';
import { memberUrl } from '@/lib/social';

export default function PersonRow({ email, name, children }) {
  const shown = name || email.split('@')[0];
  return (
    <div className="flex items-center gap-3 border-b border-border/60 py-3">
      <Link to={memberUrl(email)} className="flex min-w-0 flex-1 items-center gap-3">
        <UserAvatar name={shown} className="h-11 w-11 shrink-0" />
        <span className="truncate text-sm font-semibold">{shown}</span>
      </Link>
      {children}
    </div>
  );
}