'use client';

import {useEffect,useRef} from 'react';
import reviews from '@/data/stealth-agents-reviews.json';

export function ReviewMarquee(){
  const viewport=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const element=viewport.current;
    if(!element)return;
    const reduced=window.matchMedia('prefers-reduced-motion: reduce');
    let frame=0;
    let previous=0;
    let hovered=false;
    let focused=false;

    const stopped=()=>reduced.matches||hovered||focused||document.hidden;
    const move=(time:number)=>{
      if(stopped()){frame=0;previous=0;return}
      if(previous)element.scrollLeft+=(time-previous)*0.025;
      previous=time;
      const first=element.firstElementChild as HTMLElement|null;
      if(first){
        const gap=Number.parseFloat(getComputedStyle(element).columnGap)||0;
        const distance=first.getBoundingClientRect().width+gap;
        if(element.scrollLeft>=distance){
          element.appendChild(first);
          element.scrollLeft-=distance;
        }
      }
      frame=requestAnimationFrame(move);
    };
    const stop=()=>{cancelAnimationFrame(frame);frame=0;previous=0};
    const start=()=>{stop();if(!stopped())frame=requestAnimationFrame(move)};
    const mouseEnter=()=>{hovered=true;stop()};
    const mouseLeave=()=>{hovered=false;start()};
    const focusIn=()=>{focused=true;stop()};
    const focusOut=(event:FocusEvent)=>{if(!event.relatedTarget||!element.contains(event.relatedTarget as Node)){focused=false;start()}};
    const visibility=()=>document.hidden?stop():start();

    element.addEventListener('mouseenter',mouseEnter);
    element.addEventListener('mouseleave',mouseLeave);
    element.addEventListener('focusin',focusIn);
    element.addEventListener('focusout',focusOut);
    reduced.addEventListener('change',start);
    document.addEventListener('visibilitychange',visibility);
    start();
    return()=>{
      stop();
      element.removeEventListener('mouseenter',mouseEnter);
      element.removeEventListener('mouseleave',mouseLeave);
      element.removeEventListener('focusin',focusIn);
      element.removeEventListener('focusout',focusOut);
      reduced.removeEventListener('change',start);
      document.removeEventListener('visibilitychange',visibility);
    };
  },[]);

  return <section className="review-marquee" aria-labelledby="review-marquee-title">
    <p className="eyebrow light" id="review-marquee-title">StealthAgents reviews</p>
    <div className="review-marquee-track" ref={viewport} role="list" tabIndex={0} aria-label="Verified StealthAgents client reviews. Focus or hover to pause.">
      {reviews.map(review=><figure className="review-card" role="listitem" key={`${review.name}:${review.quote}`}>
        <div className="review-stars" aria-label="5 out of 5 stars"><span aria-hidden="true">★★★★★</span></div>
        <h3>Client perspective</h3>
        <blockquote>{review.quote}</blockquote>
        <figcaption><strong>{review.name}</strong><span>{review.role}</span></figcaption>
      </figure>)}
    </div>
  </section>;
}
