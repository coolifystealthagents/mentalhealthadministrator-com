'use server';

const ACR_HEALTH_URL = 'https://acrtracking.stealthagents.us/api/health';
const SITE_ID = 'mental-health-administrator';

export interface FallbackLeadPayload {
  name: string;
  email: string;
  phone: string;
  business?: string;
  message?: string;
  companySize?: string;
  positions?: string;
  referral?: string;
  pageUrl: string;
  userAgent?: string;
}

async function isACRHealthy(): Promise<boolean> {
  if (process.env.ACR_FALLBACK_FORCE_DOWN === '1') return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2_000);
  try {
    const response = await fetch(ACR_HEALTH_URL, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) return false;
    const health = await response.json();
    return health?.status === 'ok' && health?.clickhouse === 'connected';
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendLeadFallbackToMattermost(lead: FallbackLeadPayload): Promise<void> {
  const fallbackWebhook = process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL;
  if (!fallbackWebhook) {
    console.warn('[lead-fallback] SITE_MATTERMOST_FALLBACK_WEBHOOK_URL is missing');
    return;
  }
  try {
    if (await isACRHealthy()) {
      console.info('[lead-fallback] ACR healthy; site-direct skipped');
      return;
    }
    console.warn('[lead-fallback] ACR probe failed; waiting 15s before re-probe');
    await new Promise((resolve) => setTimeout(resolve, 15_000));
    if (await isACRHealthy()) {
      console.info('[lead-fallback] ACR recovered; site-direct skipped');
      return;
    }
    if (looksLikeGarbagePiiLead(lead)) {
      console.warn('[lead-fallback] garbage_pii_lead_submit; site-direct dropped');
      return;
    }
    const lines = [
      `**[SITE-DIRECT:${SITE_ID}] New lead — ${escapeMd(lead.name || lead.email || lead.phone || 'unknown')}**`,
      `_Submitted by the site's independent fallback because ACR failed two health probes_`,
      '', '| Field | Value |', '|---|---|',
      `| Site | ${escapeMd(SITE_ID)} |`,
      `| Name | ${escapeMd(lead.name) || '_(empty)_'} |`,
      `| Email | ${escapeMd(lead.email) || '_(empty)_'} |`,
      `| Phone | ${escapeMd(lead.phone) || '_(empty)_'} |`,
      `| Business | ${escapeMd(lead.business) || '-'} |`,
      `| Company size | ${escapeMd(lead.companySize) || '-'} |`,
      `| Positions | ${escapeMd(lead.positions) || '-'} |`,
      `| Referral | ${escapeMd(lead.referral) || '-'} |`,
      `| Page | ${escapeMd(lead.pageUrl) || '-'} |`,
      `| Time | ${new Date().toISOString()} |`,
      '',
      lead.message ? `**Message:**\n> ${escapeMd(lead.message).replace(/\n/g, '\n> ')}` : '',
    ].filter(Boolean);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    try {
      const response = await fetch(fallbackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lines.join('\n'), username: `${SITE_ID} Direct (fallback)`, icon_emoji: ':warning:' }),
        signal: controller.signal,
        cache: 'no-store',
      });
      if (!response.ok) console.error('[lead-fallback] Mattermost returned', response.status);
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('[lead-fallback] fallback failed', error);
  }
}

function escapeMd(value: string | undefined): string {
  if (!value) return '';
  return String(value).replace(/[|`*_\\]/g, (character) => `\\${character}`).slice(0, 1_000);
}

function looksRandomAlphanumeric(value: string): boolean {
  if (!value || /\s/.test(value) || !/^[A-Za-z0-9]+$/.test(value)) return false;
  const letters = value.match(/[A-Za-z]/g) ?? [];
  let caseTransitions = 0;
  for (let index = 1; index < value.length; index += 1) {
    const previous = value[index - 1];
    const current = value[index];
    if (/[A-Za-z]/.test(previous) && /[A-Za-z]/.test(current) && (previous === previous.toUpperCase()) !== (current === current.toUpperCase())) caseTransitions += 1;
  }
  const chaoticCase = value.length >= 8 && caseTransitions >= 4;
  let extremeVowelRatio = false;
  if (value.length >= 12 && letters.length >= 8) {
    const vowels = letters.filter((letter) => 'aeiouAEIOU'.includes(letter)).length;
    const vowelRatio = vowels / letters.length;
    extremeVowelRatio = vowelRatio < 0.25 || vowelRatio > 0.55;
  }
  return extremeVowelRatio || chaoticCase;
}

function looksLikeGarbagePiiLead(lead: FallbackLeadPayload): boolean {
  return looksRandomAlphanumeric((lead.name || '').trim()) && looksRandomAlphanumeric((lead.message || '').trim());
}
