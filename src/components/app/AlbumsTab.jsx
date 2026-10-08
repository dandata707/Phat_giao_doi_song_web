import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CoverImage from '@/components/app/CoverImage';
import PhotoViewer from '@/components/app/PhotoViewer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AlbumsTab() {
  const [album, setAlbum] = useState(null);
  const [viewer, setViewer] = useState(-1);
  const { data: albums = [], isLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: async () => (await base44.entities.Album.filter({}, { sort: '-created_date', limit: 30 })).items,
  });
  const photos = album?.photos || [];
  return (
    <>
      {isLoading && <p className="py-8 text-center text-sm text-muted-foreground">Đang tải...</p>}
      <div className="grid grid-cols-2 gap-3">
        {albums.map((a) => (
          <button key={a.id} onClick={() => setAlbum(a)} className="text-left active:scale-[0.98]">
            <CoverImage src={a.cover || a.photos?.[0]} className="aspect-square w-full rounded-3xl" />
            <p className="mt-2 line-clamp-2 text-sm font-semibold">{a.title}</p>
            <p className="text-xs text-muted-foreground">{a.photos?.length || 0} ảnh</p>
          </button>
        ))}
      </div>
      <Dialog open={!!album} onOpenChange={(v) => !v && setAlbum(null)}>
        <DialogContent className="max-h-[85vh] max-w-[94vw] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-heading">{album?.title}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-3 gap-1.5">
            {photos.map((p, i) => (
              <button key={p + i} onClick={() => setViewer(i)}><CoverImage src={p} className="aspect-square w-full rounded-xl" /></button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {viewer >= 0 && <PhotoViewer photos={photos} index={viewer} onClose={() => setViewer(-1)} />}
    </>
  );
}