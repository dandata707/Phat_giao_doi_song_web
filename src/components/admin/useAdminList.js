import { useInfiniteQuery } from '@tanstack/react-query';
import { pageOpts, flat } from '@/lib/pgds';

export default function useAdminList(key, fetchPage) {
  const q = useInfiniteQuery({ queryKey: key, ...pageOpts(fetchPage) });
  return { q, items: flat(q.data) };
}