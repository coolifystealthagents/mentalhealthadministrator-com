'use client';

import {useEffect,useRef} from 'react';
import reviews from '@/data/stealth-agents-reviews.json';

export function ReviewMarquee(){
  const viewport=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const element=viewport.current;
    if(!element)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0;
    let previous=0;
    let motionOffset=element.scrollLeft;
    
    let focused=false;

    const stopped=()=>reduced.matches||focused||document.hidden;
    const move=(time:number)=>{
      if(stopped()){frame=0;previous=0;return}
      if(previous)motionOffset+=Math.min(time-previous,50)*0.025;
      element.scrollLeft=Math.round(motionOffset);
      previous=time;
      const first=element.firstElementChild as HTMLElement|null;
      if(first){
        const gap=Number.parseFloat(getComputedStyle(element).columnGap)||0;
        const distance=first.getBoundingClientRect().width+gap;
        if(motionOffset>=distance){
          element.appendChild(first);
          motionOffset-=distance;
          element.scrollLeft=Math.round(motionOffset);
        }
      }
      frame=requestAnimationFrame(move);
    };
    const stop=()=>{cancelAnimationFrame(frame);frame=0;previous=0};
    const start=()=>{stop();if(!stopped())frame=requestAnimationFrame(move)};
    
    
    const focusIn=()=>{focused=true;stop()};
    const focusOut=(event:FocusEvent)=>{if(!event.relatedTarget||!element.contains(event.relatedTarget as Node)){focused=false;start()}};
    const visibility=()=>document.hidden?stop():start();

    
    
    element.addEventListener('focusin',focusIn);
    element.addEventListener('focusout',focusOut);
    reduced.addEventListener('change',start);
    document.addEventListener('visibilitychange',visibility);
    start();
    return()=>{
      stop();
      
      
      element.removeEventListener('focusin',focusIn);
      element.removeEventListener('focusout',focusOut);
      reduced.removeEventListener('change',start);
      document.removeEventListener('visibilitychange',visibility);
    };
  },[]);

  return <section className="review-marquee" aria-labelledby="review-marquee-title">
    <p className="eyebrow light" id="review-marquee-title">StealthAgents reviews</p>
    <div className="review-marquee-track" ref={viewport} role="list" tabIndex={0} aria-label="Verified StealthAgents client reviews. Focus to pause.">
      {reviews.map(review=><figure className="review-card" role="listitem" key={`${review.name}:${review.quote}`}>
        <div className="review-stars" aria-label="5 out of 5 stars"><span aria-hidden="true">★★★★★</span></div>
        <h3>Client perspective</h3>
        <blockquote>{review.quote}</blockquote>
        <figcaption><strong>{review.name}</strong><span>{review.role}</span></figcaption>
      </figure>)}
    </div>
  </section>;
}
