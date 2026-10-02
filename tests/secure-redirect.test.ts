import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { canonicalRedirect, visitorProtocol } from '../src/lib/canonical-redirect';

describe('canonicalRedirect', () => {
  it('forces plain HTTP to the secure main domain', () => {
    expect(canonicalRedirect('http', 'mentalhealthadministrator.com', '/services?x=1'))
      .toBe('https://mentalhealthadministrator.com/services?x=1');
  });

  it('sends www to the secure main domain', () => {
    expect(canonicalRedirect('https', 'www.mentalhealthadministrator.com', '/blog'))
      .toBe('https://mentalhealthadministrator.com/blog');
  });

  it('does not redirect the secure main domain', () => {
    expect(canonicalRedirect('https', 'mentalhealthadministrator.com', '/research')).toBeNull();
  });

  it('uses Cloudflare visitor scheme before the proxy scheme', () => {
    expect(visitorProtocol('{"scheme":"http"}', 'https', 'https:')).toBe('http');
  });

  it('configures browser security headers for every route', () => {
    const config = fs.readFileSync(path.resolve(__dirname, '../next.config.ts'), 'utf8');
    for (const header of ['Strict-Transport-Security','Content-Security-Policy','X-Content-Type-Options','X-Frame-Options','Referrer-Policy','Permissions-Policy']) {
      expect(config).toContain(header);
    }
  });
});
