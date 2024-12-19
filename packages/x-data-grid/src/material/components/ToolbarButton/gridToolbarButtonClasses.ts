import {
  unstable_generateUtilityClasses as generateUtilityClasses,
  unstable_generateUtilityClass as generateUtilityClass,
} from '@mui/utils';

export interface GridToolbarButtonClasses {
  /** Styles applied to the toolbar root element. */
  root: string;
  /** State class applied to the root element if `disabled={true}`. */
  disabled: string;
  /** Styles applied to the root element if `size="small"`. */
  sizeSmall: string;
  /** Styles applied to the root element if `size="medium"`. */
  sizeMedium: string;
  /** Styles applied to the root element if `size="large"`. */
  sizeLarge: string;
}

export type GridToolbarButtonClassKey = keyof GridToolbarButtonClasses;

export function getDataGridToolbarButtonUtilityClass(slot: string): string {
  return generateUtilityClass('MuiDataGridToolbarButton', slot);
}

export const gridToolbarButtonClasses = generateUtilityClasses<GridToolbarButtonClassKey>(
  'MuiDataGridToolbarButton',
  ['root', 'disabled', 'sizeSmall', 'sizeMedium', 'sizeLarge'],
);
