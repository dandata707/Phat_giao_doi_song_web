import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { MENU } from '@/components/web/menu';

function Item({ it, depth = 0 }) {
  const [open, setOpen] = useState(false);
  const kids = it.children || [];
  const pad = { paddingLeft: `${12 + depth * 16}px` };
  return (
    <li>
      <div className="flex items-center">
        <SheetClose asChild>
          <Link to={it.to} style={pad} className={`flex-1 rounded-lg py-3 pr-2 text-sm hover:bg-[#C9A227]/20 ${depth === 0 ? 'font-bold uppercase tracking-wide' : ''}`}>{it.label}</Link>
        </SheetClose>
        {kids.length > 0 && (
          <button aria-label="Mở rộng" onClick={() => setOpen(!open)} className="rounded-lg p-3 hover:bg-muted">
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {open && <ul>{kids.map((c) => <Item key={c.label} it={c} depth={depth + 1} />)}</ul>}
    </li>
  );
}

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="Menu" className="rounded-full p-2 hover:bg-muted lg:hidden"><Menu className="h-6 w-6" /></button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto p-4">
        <SheetHeader><SheetTitle className="text-left font-heading">Menu</SheetTitle></SheetHeader>
        <ul className="mt-4">{MENU.map((m) => <Item key={m.label} it={m} />)}</ul>
      </SheetContent>
    </Sheet>
  );
}