import React, { useState } from 'react';
import { MoreHorizontal, Flag, Ban, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ReportDialog from '@/components/app/ReportDialog';
import { useMe, blockUser } from '@/lib/pgds';

export default function ContentMenu({ targetType, targetId, authorEmail, onDelete }) {
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const own = me && me.email === authorEmail;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Tuỳ chọn" className="rounded-full p-1.5 text-muted-foreground active:bg-muted">
          <MoreHorizontal className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}><Flag className="mr-2 h-4 w-4" />Báo cáo bài đăng</DropdownMenuItem>
          {!own && authorEmail && (
            <DropdownMenuItem onClick={() => blockUser(authorEmail)}><Ban className="mr-2 h-4 w-4" />Chặn thành viên</DropdownMenuItem>
          )}
          {own && onDelete && (
            <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Xoá</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ReportDialog open={open} onOpenChange={setOpen} targetType={targetType} targetId={targetId} />
    </>
  );
}