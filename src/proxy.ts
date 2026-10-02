import { NextRequest, NextResponse } from 'next/server';
import { canonicalRedirect, visitorProtocol } from '@/lib/canonical-redirect';

export function proxy(request: NextRequest) {
  const protocol = visitorProtocol(
    request.headers.get('cf-visitor'),
    request.headers.get('x-forwarded-proto'),
    request.nextUrl.protocol,
  );
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host;
  const pathAndQuery = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const destination = canonicalRedirect(protocol, host, pathAndQuery);

  return destination ? NextResponse.redirect(destination, 308) : NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
