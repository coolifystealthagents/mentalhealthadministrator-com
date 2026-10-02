const apex = 'mentalhealthadministrator.com';
const www = `www.${apex}`;

export function visitorProtocol(cfVisitor: string | null, forwarded: string | null, fallback: string) {
  if (cfVisitor) {
    try {
      const scheme = JSON.parse(cfVisitor).scheme;
      if (scheme === 'http' || scheme === 'https') return scheme;
    } catch {}
  }
  return forwarded || fallback;
}

export function canonicalRedirect(protocol: string, host: string, pathAndQuery: string) {
  const cleanProtocol = protocol.split(',')[0].trim().replace(':', '').toLowerCase();
  const cleanHost = host.split(':')[0].toLowerCase();

  if (cleanHost !== apex && cleanHost !== www) return null;
  if (cleanProtocol === 'https' && cleanHost === apex) return null;

  return `https://${apex}${pathAndQuery}`;
}
