import React from 'react';
import { Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useMe } from '@/lib/pgds';
import { useProfile } from '@/lib/social';

export default function AccountGate() {
  const { data: me } = useMe();
  const { data: profile } = useProfile(me?.email);
  if (profile?.account_status !== 'locked' || me.role === 'admin') return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-background p-8 text-center">
      <Lock className="h-10 w-10 text-destructive" />
      <h2 className="font-heading text-xl font-bold">Tài khoản đã bị khóa</h2>
      {profile.status_reason && <p className="text-sm text-muted-foreground">Lý do: {profile.status_reason}</p>}
      <p className="text-sm text-muted-foreground">Vui lòng liên hệ quản trị viên để được hỗ trợ.</p>
      <Button variant="outline" onClick={() => base44.auth.logout('/')}>Đăng xuất</Button>
    </div>
  );
}