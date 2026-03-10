export type MuiCommercialPackageName =
  | 'x-data-grid-pro'
  | 'x-data-grid-premium'
  | 'x-date-pickers-pro'
  | 'x-tree-view-pro'
  | 'x-charts-pro'
  | 'x-charts-premium'
  | 'x-scheduler-premium';

export interface CommercialPackageInfo {
  releaseDate: string;
  version: string;
  name: MuiCommercialPackageName;
}
