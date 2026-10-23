'use client';
import { useState } from 'react';
import type { ContentHeading } from '@/lib/content';
export function MobileToc({ items }: { items: ContentHeading[] }) {
  const [open, setOpen] = useState(false);
  if (!items.length) return null;
  return <div className="mobile-toc" aria-label="Article contents"><button type="button" className="mobile-toc-toggle" aria-expanded={open} aria-controls="mobile-toc-list" onClick={() => setOpen((v) => !v)}><span>On this page</span><span aria-hidden="true">{open ? 'Close' : 'Open'}</span></button>{open ? <nav id="mobile-toc-list" aria-label="Table of contents">{items.map((item) => <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>{item.label}</a>)}</nav> : null}</div>;
}
