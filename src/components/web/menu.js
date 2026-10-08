import { CATEGORIES } from '@/lib/pgds';

const q = (s) => encodeURIComponent(s);

export const MENU = [
  { label: 'Trang chủ', to: '/', end: true },
  {
    label: 'Tin tức', to: '/tin-tuc',
    children: [
      { label: 'Mới nhất', to: '/tin-tuc' },
      ...CATEGORIES.map((c) => ({
        label: c.name, to: `/tin-tuc?cat=${q(c.name)}`,
        children: c.subs.map((s) => ({ label: s, to: `/tin-tuc?cat=${q(c.name)}&sub=${q(s)}` })),
      })),
    ],
  },
  {
    label: 'Cộng đồng', to: '/cong-dong',
    children: [
      { label: 'Bảng tin', to: '/cong-dong?tab=feed' },
      { label: 'Nhóm', to: '/cong-dong?tab=groups' },
      { label: 'Diễn đàn', to: '/cong-dong?tab=forum' },
      { label: 'Thư viện ảnh', to: '/cong-dong?tab=photos' },
    ],
  },
  {
    label: 'Bạn bè', to: '/ban-be',
    children: [
      { label: 'Danh sách bạn bè', to: '/ban-be?tab=friends' },
      { label: 'Lời mời kết bạn', to: '/ban-be?tab=requests' },
      { label: 'Gợi ý bạn bè', to: '/ban-be?tab=suggest' },
      { label: 'Nhóm có thể tham gia', to: '/ban-be?tab=groups' },
    ],
  },
  { label: 'Tin nhắn', to: '/tin-nhan' },
  {
    label: 'Thông tin', to: '/dieu-khoan',
    children: [
      { label: 'Điều khoản & chính sách', to: '/dieu-khoan' },
      { label: 'Tìm kiếm', to: '/tim-kiem' },
    ],
  },
];