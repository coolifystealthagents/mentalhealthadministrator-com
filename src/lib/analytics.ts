export type LeadPayload={name:string;email:string;referral_source?:string;message?:string};
export function track(event:string,payload:Record<string,unknown>={}){if(typeof window==='undefined')return;window.dispatchEvent(new CustomEvent('acr:track',{detail:{event,...payload}}));}
