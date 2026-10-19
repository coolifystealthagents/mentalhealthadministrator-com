import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src https://go.oncehub.com; object-src 'none'; script-src 'self' 'unsafe-inline' https://acrtracking.stealthagents.us; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://acrtracking.stealthagents.us; upgrade-insecure-requests" },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=("https://go.oncehub.com"), microphone=("https://go.oncehub.com"), geolocation=(), payment=(), usb=()' },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  webpack(config) { return config; },
};

export default nextConfig;
