import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Globe, Share2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { LOGO_URL } from '@/lib/pgds';

const COVER = 'https://media.base44.com/images/public/6abf320452f1fb20c3a37225/8c1af76d7_generated_image.png';

export default function CommunityCover() {
  const { data: n = 0 } = useQuery({ queryKey: ['members-count'], queryFn: () => base44.entities.Profile.count({}) });
  const share = async () => {
    const url = window.location.origin + '/cong-dong';
    if (navigator.share) await navigator.share({ title: 'Cộng đồng Phật Giáo Đời Sống', url }).catch(() => {});
    else await navigator.clipboard.writeText(url);
  };
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Image src={COVER} alt="" className="aspect-[16/7] w-full" />
      <div className="px-4 pb-3 pt-3">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="" className="h-12 w-12 rounded-xl border bg-card object-contain p-1" />
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-lg font-bold leading-tight">Cộng đồng Phật Giáo Đời Sống</h2>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Globe className="h-3 w-3" />Nhóm công khai · {n} thành viên</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1">Đã tham gia</Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={share}><Share2 className="mr-1.5 h-4 w-4" />Chia sẻ</Button>
        </div>
      </div>
    </div>
  );
}