export const LICENSE_SCOPES = ['pro', 'premium'] as const;

export type LicenseScope = typeof LICENSE_SCOPES[number];
