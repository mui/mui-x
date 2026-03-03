export const PLAN_SCOPES = ['pro', 'premium'] as const;
export const PLAN_VERSIONS = ['initial', 'Q3-2024'] as const;

export type PlanScope = (typeof PLAN_SCOPES)[number];
export type PlanVersion = (typeof PLAN_VERSIONS)[number];
