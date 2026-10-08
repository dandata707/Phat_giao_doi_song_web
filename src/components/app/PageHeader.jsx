import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({ title, back = false, right }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/60 bg-background/90 px-4 backdrop-blur">
      {back && (
        <button aria-label="Quay lại" onClick={() => navigate(-1)} className="-ml-2 rounded-full p-2 active:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="flex-1 truncate font-heading text-lg font-semibold">{title}</h1>
      {right}
    </header>
  );
}