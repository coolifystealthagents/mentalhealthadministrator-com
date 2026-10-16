import { type NextRequest } from 'next/server';

const TRACKING_API = 'https://acrtracking.stealthagents.us/api/track';
const MAX_BODY_BYTES = 256_000;

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const declaredLength = Number(request.headers.get('content-length') || '0');
    if (declaredLength > MAX_BODY_BYTES) {
      return Response.json({ status: 'error', detail: 'Payload too large' }, { status: 413 });
    }
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
      return Response.json({ status: 'error', detail: 'Payload too large' }, { status: 413 });
    }
    const clientIp = request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '0.0.0.0';
    const upstream = await fetch(TRACKING_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || '',
        'Accept-Language': request.headers.get('accept-language') || '',
        'X-Forwarded-For': clientIp,
        'X-ACR-Client-IP': clientIp,
      },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return Response.json({ status: 'error' }, { status: 502 });
  }
}
