export const LICENSE_SCOPES = ['pro', 'premium', 'pro2024', 'premium2024'] as const;
export const PRODUCT_SCOPES = ['data-grid', 'date-pickers', 'charts', 'tree-view'] as const;

export type LicenseScope = (typeof LICENSE_SCOPES)[number];
export type ProductScope = (typeof PRODUCT_SCOPES)[number] | null;

export const extractProductScope = (packageName: string): ProductScope | null => {
  const regex = /x-(.*?)(-pro|-premium)?$/;
  const match = packageName.match(regex);
  return match ? (match[1] as ProductScope) : null;
};

export const extractAcceptedScopes = (packageName: string): readonly LicenseScope[] => {
  const productScope = extractProductScope(packageName);

  const scopes = packageName.includes('premium')
    ? LICENSE_SCOPES.filter((scope) => scope.includes('premium'))
    : LICENSE_SCOPES;

  if (productScope === 'charts' || productScope === 'tree-view') {
    return scopes.filter((scope) => scope.includes('2024'));
  }
  return scopes;
};
