import type { MetadataRoute } from 'next';
import { ORIGIN, services } from '../lib/site';
import { articles } from '../lib/articles';
import { researchItems } from '../lib/research';
import { alternatives } from '../lib/alternatives';

const PAGE_SIZE=12;
const entry=(path:string,modified:string|Date=new Date('2026-09-01'))=>({url:`${ORIGIN}${path}`,lastModified:modified});
const paginationPaths=(base:string,count:number)=>Array.from({length:Math.max(0,Math.ceil(count/PAGE_SIZE)-1)},(_,index)=>`${base}/page/${index+2}`);

export default function sitemap():MetadataRoute.Sitemap{
 const staticPaths=['/','/about','/services','/contact-us','/blog','/research','/alternatives','/resources','/privacy','/terms'];
 const categories=[...new Set(articles.map((item)=>item.category.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')))];
 const entries=[
  ...staticPaths.map((path)=>entry(path)),
  ...services.map((item)=>entry(`/services/${item.slug}`)),
  ...articles.map((item)=>entry(`/blog/${item.slug}`,item.updatedAt)),
  ...researchItems.map((item)=>entry(`/research/${item.slug}`,item.updatedAt)),
  ...alternatives.map((item)=>entry(`/alternatives/${item.slug}`,item.updatedAt)),
  ...categories.map((slug)=>entry(`/blog/category/${slug}`)),
  ...paginationPaths('/blog',articles.length).map((path)=>entry(path)),
  ...paginationPaths('/research',researchItems.length).map((path)=>entry(path)),
 ];
 return [...new Map(entries.map((item)=>[item.url,item])).values()];
}
