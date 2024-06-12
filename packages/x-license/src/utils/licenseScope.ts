export const LICENSE_SCOPES = ['pro', 'premium'] as const;
export const PRODUCT_SCOPES = ['data-grid', 'date-pickers', 'charts', 'tree-view'] as const;

export type LicenseScope = (typeof LICENSE_SCOPES)[number];
export type ProductScope = (typeof PRODUCT_SCOPES)[number];
