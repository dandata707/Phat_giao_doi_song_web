import moment from 'moment';
import 'moment/locale/vi';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

moment.locale('vi');

export const CATEGORIES = [
  { name: 'Tin tức Phật giáo', subs: ['Tin quốc tế', 'Phật sự Miền Bắc', 'Phật sự Miền Nam', 'Phật sự Miền Trung', 'Phật sự Tây Nguyên'] },
  { name: 'Văn hoá', subs: [] },
  { name: 'Phật giáo – Đời sống', subs: ['Phật giáo và Đời sống', 'Xã hội – Từ thiện'] },
  { name: 'Nghiên cứu', subs: ['Phật học', 'Khoa học'] },
  { name: 'Văn học – Tùy bút – Ký sự', subs: [] },
];

export const PRIVACY = [
  { value: 'public', label: 'Công khai' },
  { value: 'members', label: 'Tất cả thành viên' },
  { value: 'friends', label: 'Bạn bè' },
  { value: 'me', label: 'Chỉ mình tôi' },
];

export const NOT_LIVE = { $nin: ['hidden', 'pending', 'rejected', 'removed'] };
export const COMMENT_LIVE = { $nin: ['pending', 'rejected'] };
export const canWrite = (me) => ['collaborator', 'editor', 'admin'].includes(me?.role);
export const isEditor = (me) => ['editor', 'admin'].includes(me?.role);

export const REPORT_REASONS = ['Giả mạo', 'Không phù hợp', 'Phản cảm', 'Quấy rối', 'Thông tin sai lệch', 'Khác'];

export const timeAgo = (d) => {
  const s = Math.max(0, (Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'Vừa xong';
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
  if (s < 2592000) return `${Math.floor(s / 86400)} ngày trước`;
  return moment(d).format('DD/MM/YYYY');
};
export const fullDate = (d) => moment(d).format('DD/MM/YYYY');

export function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: () => base44.auth.me().catch(() => null), staleTime: 60000 });
}

export const LOGO_URL = 'https://media.base44.com/images/public/6abf320452f1fb20c3a37225/4d6e29cd3_logo-pgds_new.png';

export const goLogin = () => {
  const back = window.location.pathname + window.location.search;
  window.location.href = '/login?returnTo=' + encodeURIComponent(back);
};

export const pageOpts = (fetchPage) => ({
  initialPageParam: undefined,
  queryFn: ({ pageParam }) => fetchPage(pageParam),
  getNextPageParam: (last) => (last.has_more ? last.next_cursor : undefined),
});
export const flat = (data) => data?.pages.flatMap((p) => p.items) ?? [];

const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
export const getPref = (k, d) => read('pgds_' + k, d);
export const setPref = (k, v) => {
  localStorage.setItem('pgds_' + k, JSON.stringify(v));
  window.dispatchEvent(new Event('pgds-prefs'));
};
export const getBlocked = () => read('pgds_blocked', []);
export const blockUser = async (email) => {
  setPref('blocked', [...new Set([...getBlocked(), email])]);
  const me = await base44.auth.me().catch(() => null);
  if (me) await base44.entities.Block.create({ blocker_email: me.email, blocked_email: email });
};
export const unblockUser = async (email) => {
  setPref('blocked', getBlocked().filter((e) => e !== email));
  const me = await base44.auth.me().catch(() => null);
  if (me) await base44.entities.Block.deleteMany({ blocker_email: me.email, blocked_email: email });
};