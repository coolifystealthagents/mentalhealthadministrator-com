'use client';

import Link from 'next/link';
import {useCallback,useEffect,useRef,useState} from 'react';

const primaryLinks=[['Home','/'],['Services','/services'],['Contact Us','/contact-us']] as const;

export function Logo(){return <span className="logo"><span className="logo-mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M7 10c7-2 13 0 17 5 4-5 10-7 17-5v25c-7-2-13 0-17 5-4-5-10-7-17-5V10Z" fill="none" stroke="currentColor" strokeWidth="2.3"/><path d="M14 18c5-1 8 0 10 3 2-3 5-4 10-3M24 15v25" fill="none" stroke="currentColor" strokeWidth="2.3"/></svg></span><span className="logo-type">Mental Health<br/><b>Administrator</b></span></span>}

function ParentBrand(){return <span className="parent-brand"><span>Powered by StealthAgents</span><img src="/images/stealth-agents-logo-black.png" alt="Stealth Agents"/></span>}

export function Header(){
 const [open,setOpen]=useState(false);const menuButton=useRef<HTMLButtonElement>(null);const navigation=useRef<HTMLElement>(null);
 const closeMenu=useCallback((returnFocus=false)=>{setOpen(false);if(returnFocus)requestAnimationFrame(()=>menuButton.current?.focus())},[]);
 useEffect(()=>{
  const desktop=window.matchMedia('(min-width:1101px)');
  const leaveDrawer=(event:MediaQueryListEvent)=>{if(event.matches)closeMenu()};
  desktop.addEventListener('change',leaveDrawer);
  return()=>desktop.removeEventListener('change',leaveDrawer);
 },[closeMenu]);
 useEffect(()=>{
  if(!open)return;
  const links=Array.from(navigation.current?.querySelectorAll<HTMLElement>('a[href]')??[]);
  const background=Array.from(document.querySelectorAll<HTMLElement>('main,footer'));
  const previousOverflow=document.body.style.overflow;
  const previousInert=background.map(element=>element.inert);
  document.body.style.overflow='hidden';background.forEach(element=>{element.inert=true});links[0]?.focus();
  const contain=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){closeMenu(true);return}
   if(event.key!=='Tab'||links.length===0)return;
   const first=links[0],last=links[links.length-1],active=document.activeElement;
   if(event.shiftKey&&active===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&active===last){event.preventDefault();first.focus()}
  };
  document.addEventListener('keydown',contain);
  return()=>{document.removeEventListener('keydown',contain);document.body.style.overflow=previousOverflow;background.forEach((element,index)=>{element.inert=previousInert[index]})};
 },[open,closeMenu]);
 return <><a className="skip-link" href="#main-content">Skip to main content</a><header className="site-header"><div className="shell nav"><Link href="/" aria-label="Mental Health Administrator home"><Logo/></Link><nav ref={navigation} id="primary-navigation" className={open?'is-open':''} aria-label="Main navigation">{primaryLinks.map(([label,href])=><Link href={href} key={href} onClick={()=>closeMenu()}>{label}</Link>)}</nav><div className="nav-actions"><ParentBrand/><button ref={menuButton} className="menu-toggle" type="button" aria-label={open?'Close main menu':'Open main menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={()=>open?closeMenu(true):setOpen(true)}>Menu</button><Link className="nav-cta" href="/contact-us" id="cta-global-nav-consultation">Book a Free Consultation</Link></div></div></header></>}

export function Footer(){return <footer><div className="shell footer-lead"><p className="eyebrow light">Order for the work around care</p><h2>Let clinicians focus on care.<br/><em>Give administration an owner.</em></h2></div><div className="shell footer-grid"><div className="footer-brand"><Logo/><p>Remote human support for the nonclinical work that keeps a mental health practice organized.</p><p className="footer-boundary">Not a clinical, crisis, emergency, legal, or compliance service.</p><ParentBrand/></div><div><b>Explore</b><Link href="/services">Services</Link><Link href="/blog">Blog</Link><Link href="/research">Research</Link><Link href="/alternatives">Alternatives</Link><Link href="/resources">Resources</Link></div><div><b>Company</b><Link href="/about">About</Link><Link href="/contact-us">Contact Us</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div><div className="shell footer-bottom"><p>© Mental Health Administrator</p><p>Nonclinical administrative support for mental health practices.</p></div></footer>}

export function ClosingCTA({page='page'}:{page?:string}){return <section className="closing-wrap"><div className="closing shell"><div><p className="eyebrow light">A calmer administrative queue</p><h2>Start with one workflow.<br/><em>Make ownership visible.</em></h2></div><div className="closing-action"><p>Tell us where intake, scheduling, payer follow-up, records, or routine communication is losing time and ownership.</p><Link className="button button-light" href="/contact-us" id={`cta-${page}-closing-consultation`}>Book a Free Consultation <span aria-hidden="true">↗</span></Link></div></div></section>}
