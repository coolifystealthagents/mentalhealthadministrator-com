export interface FallbackLeadPayload {
  name: string;
  email: string;
  phoneCountry?: string;
  phone: string;
  business?: string;
  companyWebsite?: string;
  message?: string;
  companySize?: string;
  positions?: string;
  referral?: string;
  pageUrl: string;
  userAgent?: string;
}

export async function sendLeadFallbackToMattermost(lead: FallbackLeadPayload, options: {forceDelivery?: boolean} = {}): Promise<void> {
  // ACR alone owns lead notifications. Never send directly to Mattermost.
  return undefined;
}
