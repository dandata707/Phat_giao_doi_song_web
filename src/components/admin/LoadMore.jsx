import React from 'react';
import { Button } from '@/components/ui/button';

export default function LoadMore({ q, count }) {
  if (q.isLoading) return <p className="py-6 text-center text-sm text-muted-foreground">Đang tải...</p>;
  return (
    <>
      {count === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Không có dữ liệu.</p>}
      {q.hasNextPage && <Button variant="outline" className="mt-3 w-full" disabled={q.isFetchingNextPage} onClick={() => q.fetchNextPage()}>Tải thêm</Button>}
    </>
  );
}