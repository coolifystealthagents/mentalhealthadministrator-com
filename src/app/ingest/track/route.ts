import {NextResponse} from 'next/server';

export const runtime = 'nodejs';

const TARGET='https://acrtracking.stealthagents.us/api/track';
const MAX_BODY_BYTES = 256_000;
const NO_STORE={'Cache-Control': 'no-store'};

export async function POST(request:Request){
  try{
    const declaredLength=Number(request.headers.get('content-length')||0);
    if(declaredLength>MAX_BODY_BYTES){
      return NextResponse.json({ok:false,error:'Tracking payload is too large.'},{status:413,headers:NO_STORE});
    }

    const body=await request.text();
    if(Buffer.byteLength(body,'utf8')>MAX_BODY_BYTES){
      return NextResponse.json({ok:false,error:'Tracking payload is too large.'},{status:413,headers:NO_STORE});
    }

    const clientIp=request.headers.get('cf-connecting-ip')
      ||request.headers.get('x-real-ip')
      ||request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ||'';

    const upstream=await fetch(TARGET,{
      method:'POST',
      headers:{
        'Content-Type':request.headers.get('content-type')||'application/json',
        'User-Agent':request.headers.get('user-agent')||'',
        'Accept-Language':request.headers.get('accept-language')||'',
        'X-Forwarded-For':clientIp,
        'X-ACR-Client-IP':clientIp,
      },
      body,
      cache:'no-store',
      signal:AbortSignal.timeout(10_000),
    });
    const responseBody=await upstream.text();
    return new NextResponse(responseBody,{
      status:upstream.status,
      headers:{
        'Content-Type':upstream.headers.get('content-type')||'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }catch(error){
    console.error('[acr-proxy] upstream unavailable',error);
    return NextResponse.json({ok:false,error:'Tracking upstream unavailable.'},{status:502,headers:NO_STORE});
  }
}
