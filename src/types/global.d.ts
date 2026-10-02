export {};

type ACRLeadData={
  name:string;
  email:string;
  phone?:string;
  message?:string;
  source?:string;
  formId?:string;
  [key:string]:unknown;
};

type ACRTrackerConfig={
  siteId:string;
  endpoint:string;
  debug?:boolean;
  funnelSteps?:Array<{path:string;step:number;label:string;event:string}>;
};

declare global{
  interface Window{
    ACR_TRACKER_CONFIG?:ACRTrackerConfig;
    acrTracker?:{
      track:(eventType:string,metadata?:Record<string,unknown>)=>void;
      trackLead:(data:ACRLeadData)=>void;
      flush:()=>void;
    };
  }
}
