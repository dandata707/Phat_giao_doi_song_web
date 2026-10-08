import React from 'react';

export default function SuspendedNotice({ reason }) {
  return (
    <p className="rounded-2xl bg-amber-100 px-4 py-3 text-xs text-amber-900">
      Tài khoản của bạn đang bị đình chỉ nên không thể đăng bài hoặc bình luận.{reason ? ` Lý do: ${reason}` : ''}
    </p>
  );
}