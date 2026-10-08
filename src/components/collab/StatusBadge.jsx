import React from 'react';

const MAP = {
  pending: ['Chờ duyệt', 'bg-amber-100 text-amber-800'],
  rejected: ['Cần làm lại', 'bg-red-100 text-red-800'],
  removed: ['Đã gỡ', 'bg-red-100 text-red-800'],
  hidden: ['Đã ẩn', 'bg-red-100 text-red-800'],
  approved: ['Đã đăng', 'bg-green-100 text-green-800'],
};

export default function StatusBadge({ status }) {
  const [label, cls] = MAP[status] || MAP.approved;
  return <span className={`rounded-full px-2.5 py-0.5 text-xs ${cls}`}>{label}</span>;
}