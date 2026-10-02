'use client';
import {useState} from 'react';
type Review={quote:string;source:string};
export function ReviewCarousel({reviews}:{reviews:Review[]|null}){const [i,setI]=useState(0);if(!reviews?.length)return null;return <section aria-label="Reviews"><blockquote>{reviews[i].quote}<cite>{reviews[i].source}</cite></blockquote><button onClick={()=>setI((i-1+reviews.length)%reviews.length)}>Previous</button><button onClick={()=>setI((i+1)%reviews.length)}>Next</button><div>{reviews.map((_,n)=><button key={n} aria-label={`Review ${n+1}`} aria-current={n===i} onClick={()=>setI(n)}/>)}</div></section>}
