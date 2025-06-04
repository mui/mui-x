import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartsToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the toolbar divider element. */
  divider: string;
}

export type ChartsToolbarClassKey = keyof ChartsToolbarClasses;

export const chartsToolbarClasses: ChartsToolbarClasses = generateUtilityClasses(
  'MuiChartsToolbar',
  ['root', 'divider'],
);
