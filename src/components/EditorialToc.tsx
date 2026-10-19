'use client';

import {useEffect,useState} from 'react';
import type {ContentHeading} from '@/lib/content';

export function EditorialToc({items}:{items:ContentHeading[]}){
 const [activeId,setActiveId]=useState(items[0]?.id||'');
 useEffect(()=>{
  if(!items.length)return;
  const headings=items.map((item)=>document.getElementById(item.id)).filter((item):item is HTMLElement=>Boolean(item));
  const observer=new IntersectionObserver((entries)=>{
   const visible=entries.filter((entry)=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
   if(visible[0])setActiveId(visible[0].target.id);
  },{rootMargin:'-112px 0px -65% 0px',threshold:[0,1]});
  headings.forEach((heading)=>observer.observe(heading));
  return()=>observer.disconnect();
 },[items]);
 if(!items.length)return null;
 return <details className="toc editorial-toc" open>
  <summary>On this page</summary>
  <nav aria-label="Article table of contents"><ol>{items.map((item)=><li className={item.level===3?'toc-subheading':undefined} key={item.id}><a href={`#${item.id}`} aria-current={activeId===item.id?'location':undefined}>{item.label}</a></li>)}</ol></nav>
 </details>;
}
