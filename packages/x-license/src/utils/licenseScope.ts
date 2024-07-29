export const LICENSE_SCOPES = ['pro', 'premium'] as const;
export const PLAN_VERSIONS = ['initial', 'Q3-2024'] as const;

export type LicenseScope = (typeof LICENSE_SCOPES)[number];
export type PlanVersion = (typeof PLAN_VERSIONS)[number];
