export const PLAN_SCOPES = ['pro', 'premium'] as const;
export const PLAN_VERSIONS = ['initial', 'Q3-2024', 'Q1-2026'] as const;

export type PlanScope = (typeof PLAN_SCOPES)[number];
export type PlanVersion = (typeof PLAN_VERSIONS)[number];
