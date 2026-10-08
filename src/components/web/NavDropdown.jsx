import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const itemCls = 'flex items-center justify-between gap-6 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-[#C9A227]/20';

export default function NavDropdown({ items }) {
  return (
    <div className="invisible absolute left-0 top-full z-50 pt-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
      <ul className="min-w-[250px] rounded-xl border bg-card p-2 shadow-xl">
        {items.map((it) => (
          <li key={it.label} className="group/sub relative">
            <Link to={it.to} className={itemCls}>
              <span>{it.label}</span>
              {it.children?.length > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </Link>
            {it.children?.length > 0 && (
              <div className="invisible absolute left-full top-0 pl-1 opacity-0 transition-all duration-150 group-hover/sub:visible group-hover/sub:opacity-100">
                <ul className="min-w-[230px] rounded-xl border bg-card p-2 shadow-xl">
                  {it.children.map((c) => (
                    <li key={c.label}><Link to={c.to} className={itemCls}>{c.label}</Link></li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}