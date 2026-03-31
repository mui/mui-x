export const PLAN_SCOPES = ['pro', 'premium'] as const;
export const PLAN_VERSIONS = ['2022', 'initial', 'Q3-2024', 'Q1-2026'] as const;

export type PlanScope = (typeof PLAN_SCOPES)[number];
export type PlanVersion = (typeof PLAN_VERSIONS)[number];

/**
 * Checks if a plan version is older than or equal to the given threshold
 * using the ordering defined in PLAN_VERSIONS.
 * This can be reused for future major version gates
 * (e.g. v10 could set its own max plan version).
 */
export function isPlanVersionOlderOrEqual(planVersion: string, maxVersion: PlanVersion): boolean {
  const index = PLAN_VERSIONS.indexOf(planVersion as PlanVersion);
  const maxIndex = PLAN_VERSIONS.indexOf(maxVersion);
  return index !== -1 && index <= maxIndex;
}
