import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartsToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type ChartsToolbarClassKey = keyof ChartsToolbarClasses;

export const chartsToolbarClasses: ChartsToolbarClasses = generateUtilityClasses(
  'MuiChartsToolbar',
  ['root'],
);
