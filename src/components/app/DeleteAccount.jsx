import React from 'react';
import { base44 } from '@/api/base44Client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function DeleteAccount({ me }) {
  const confirm = async () => {
    await base44.entities.Report.create({ target_type: 'account', target_id: me.id, reason: 'Yêu cầu xoá tài khoản', note: me.email, reporter_email: me.email, status: 'pending' });
    base44.auth.logout('/');
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full py-3 text-center text-sm font-medium text-destructive">Xoá tài khoản</AlertDialogTrigger>
      <AlertDialogContent className="max-w-[92vw] rounded-3xl sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Xoá tài khoản?</AlertDialogTitle>
          <AlertDialogDescription>Yêu cầu xoá tài khoản và dữ liệu cá nhân sẽ được gửi tới quản trị viên xử lý, và bạn sẽ được đăng xuất ngay.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction onClick={confirm} className="bg-destructive text-white">Gửi yêu cầu xoá</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}