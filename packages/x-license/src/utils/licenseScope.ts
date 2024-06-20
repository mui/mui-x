export const LICENSE_SCOPES = ['pro', 'premium'] as const;
export const PRODUCT_SCOPES = ['data-grid', 'date-pickers', 'charts', 'tree-view'] as const;
export const PLAN_VERSIONS = ['initial', 'Q3-2024'] as const;

export type LicenseScope = (typeof LICENSE_SCOPES)[number];
export type ProductScope = (typeof PRODUCT_SCOPES)[number];
export type PlanVersion = (typeof PLAN_VERSIONS)[number];

export const extractProductScope = (packageName: string): ProductScope => {
  // extract the part between "x-" and "-pro"/"-premium"
  const regex = /x-(.*?)(-pro|-premium)?$/;
  const match = packageName.match(regex);
  return match![1] as ProductScope;
};

export const extractAcceptedScopes = (packageName: string): readonly LicenseScope[] => {
  return packageName.includes('premium')
    ? LICENSE_SCOPES.filter((scope) => scope.includes('premium'))
    : LICENSE_SCOPES;
};
