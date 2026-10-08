import React, { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from 'lucide-react';

export default function PhotoViewer({ photos, index, onClose }) {
  const [i, setI] = useState(index);
  const [zoom, setZoom] = useState(false);
  const startX = useRef(null);
  const go = (d) => { setZoom(false); setI((i + d + photos.length) % photos.length); };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-black"
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - startX.current;
        if (!zoom && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}>
      <div className="flex items-center justify-between p-4 text-white">
        <button aria-label="Đóng" onClick={onClose}><X className="h-6 w-6" /></button>
        <span className="text-sm">{i + 1} / {photos.length}</span>
        <div className="flex gap-4">
          <button aria-label="Phóng to" onClick={() => setZoom(!zoom)}><ZoomIn className="h-6 w-6" /></button>
          <a aria-label="Lưu ảnh" href={photos[i]} download target="_blank" rel="noreferrer"><Download className="h-6 w-6" /></a>
        </div>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-auto">
        <img src={photos[i]} alt="" onClick={() => setZoom(!zoom)}
          className={`transition-transform duration-300 ${zoom ? 'max-w-none scale-[2]' : 'max-h-full max-w-full'} object-contain`} />
        {photos.length > 1 && (
          <>
            <button aria-label="Ảnh trước" onClick={() => go(-1)} className="absolute left-2 rounded-full bg-white/15 p-2 text-white"><ChevronLeft /></button>
            <button aria-label="Ảnh sau" onClick={() => go(1)} className="absolute right-2 rounded-full bg-white/15 p-2 text-white"><ChevronRight /></button>
          </>
        )}
      </div>
    </div>
  );
}