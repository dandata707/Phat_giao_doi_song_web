import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal, Flag, Ban } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ReportDialog from '@/components/app/ReportDialog';
import { useMe, goLogin, blockUser, unblockUser } from '@/lib/pgds';
import { useProfile, useRelation, memberUrl, nameOf } from '@/lib/social';

const E = base44.entities;

export default function RelationButtons({ email, name }) {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const { data: rel } = useRelation(me?.email, email);
  const { data: profile } = useProfile(email);
  const [report, setReport] = useState(false);
  if (!me) return <Button onClick={goLogin} className="rounded-full">Đăng nhập để kết nối</Button>;
  if (!rel) return null;
  const run = (fn) => async () => { await fn(); qc.invalidateQueries({ queryKey: ['rel'] }); qc.invalidateQueries({ queryKey: ['social'] }); };
  const f = rel.friendship;
  const sm = 'rounded-full';

  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Tuỳ chọn" className="rounded-full border p-2"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setReport(true)}><Flag className="mr-2 h-4 w-4" />Báo cáo tài khoản</DropdownMenuItem>
        {!rel.blockedByMe && (
          <DropdownMenuItem onClick={run(async () => {
            await blockUser(email);
            if (f) await E.Friendship.delete(f.id);
            if (rel.follow) await E.Follow.delete(rel.follow.id);
          })}><Ban className="mr-2 h-4 w-4" />Chặn thành viên</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
  const reportDlg = <ReportDialog open={report} onOpenChange={setReport} targetType="user" targetId={email} />;

  if (rel.blockedByMe) {
    return <div className="flex gap-2"><Button variant="outline" className={sm} onClick={run(() => unblockUser(email))}>Bỏ chặn</Button>{menu}{reportDlg}</div>;
  }
  if (rel.blockedMe) return <p className="text-sm text-muted-foreground">Bạn không thể tương tác với tài khoản này.</p>;

  let friendBtn;
  if (f?.status === 'accepted') {
    friendBtn = <Button variant="outline" className={sm} onClick={run(() => E.Friendship.delete(f.id))}>Bạn bè · Hủy kết bạn</Button>;
  } else if (f && f.requester_email === me.email) {
    friendBtn = <Button variant="outline" className={sm} onClick={run(() => E.Friendship.delete(f.id))}>Hủy lời mời</Button>;
  } else if (f) {
    friendBtn = (
      <>
        <Button className={sm} onClick={run(() => E.Friendship.update(f.id, { status: 'accepted' }))}>Chấp nhận</Button>
        <Button variant="outline" className={sm} onClick={run(() => E.Friendship.delete(f.id))}>Từ chối</Button>
      </>
    );
  } else if (profile?.who_friend_request === 'none') {
    friendBtn = <Button disabled variant="outline" className={sm}>Không nhận lời mời</Button>;
  } else {
    friendBtn = (
      <Button className={sm} onClick={run(async () => {
        await E.Friendship.create({ requester_email: me.email, requester_name: nameOf(me), recipient_email: email, recipient_name: name, status: 'pending' });
        await E.Notification.create({ recipient_email: email, type: 'friend', title: `${nameOf(me)} đã gửi lời mời kết bạn`, link: memberUrl(me.email) });
      })}>Kết bạn</Button>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {friendBtn}
      {rel.follow
        ? <Button variant="outline" className={sm} onClick={run(() => E.Follow.delete(rel.follow.id))}>Đang theo dõi</Button>
        : <Button variant="secondary" className={sm} onClick={run(() => E.Follow.create({ follower_email: me.email, follower_name: nameOf(me), following_email: email, following_name: name }))}>Theo dõi</Button>}
      {menu}{reportDlg}
    </div>
  );
}