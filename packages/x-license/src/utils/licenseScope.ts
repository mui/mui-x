export const LICENSE_SCOPES = ['pro', 'premium'] as const;
export const PLAN_VERSIONS = ['initial', 'Q3-2024'] as const;

export type LicenseScope = (typeof LICENSE_SCOPES)[number];
export type PlanVersion = (typeof PLAN_VERSIONS)[number];
export type ProductLine = 'data-grid' | 'date-pickers' | 'charts' | 'tree-view'

export const extractProductLine = (packageName: string): ProductLine => {
  // extract the part between "x-" and "-pro"/"-premium"
  const regex = /x-(.*?)(-pro|-premium)?$/;
  const match = packageName.match(regex);
  return match![1] as ProductLine;
};

export const extractAcceptedScopes = (packageName: string): readonly LicenseScope[] => {
  return packageName.includes('premium')
    ? LICENSE_SCOPES.filter((scope) => scope.includes('premium'))
    : LICENSE_SCOPES;
};
