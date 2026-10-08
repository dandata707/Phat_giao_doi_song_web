import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Switch } from '@/components/ui/switch';
import { useProfile, saveProfile } from '@/lib/social';

const FIELDS = [
  ['who_view', 'public', 'Ai được xem hồ sơ', [['public', 'Công khai'], ['members', 'Thành viên'], ['friends', 'Bạn bè'], ['me', 'Chỉ mình tôi']]],
  ['who_friend_request', 'everyone', 'Ai được gửi lời mời kết bạn', [['everyone', 'Mọi người'], ['none', 'Không ai']]],
  ['who_message', 'everyone', 'Ai được nhắn tin', [['everyone', 'Mọi người'], ['friends', 'Bạn bè'], ['none', 'Không ai']]],
  ['who_comment', 'everyone', 'Ai được bình luận bài của tôi', [['everyone', 'Mọi người'], ['friends', 'Bạn bè'], ['me', 'Chỉ mình tôi']]],
];

export default function PrivacySettings({ me }) {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useProfile(me.email);
  if (isLoading) return null;
  const save = async (patch) => { await saveProfile(me, profile, patch); qc.invalidateQueries({ queryKey: ['profile'] }); };
  return (
    <div className="rounded-3xl border bg-card p-5">
      <h3 className="font-heading font-bold">Quyền riêng tư</h3>
      <div className="mt-3 space-y-3">
        {FIELDS.map(([k, def, label, opts]) => (
          <div key={k} className="flex items-center justify-between gap-3 text-sm">
            <span>{label}</span>
            <select value={profile?.[k] || def} onChange={(e) => save({ [k]: e.target.value })} className="rounded-lg border bg-background px-2 py-1.5 text-sm">
              {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 text-sm">
          <span>Tắt gợi ý kết nối</span>
          <Switch checked={!!profile?.hide_suggestions} onCheckedChange={(v) => save({ hide_suggestions: v })} />
        </div>
      </div>
    </div>
  );
}