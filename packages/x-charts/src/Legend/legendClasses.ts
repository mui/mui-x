import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface LegendClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to a series element. */
  series: string;
  /** Styles applied to series mark element. */
  mark: string;
  /** Styles applied to the series label. */
  label: string;
  /** Styles applied to the legend with column layout. */
  column: string;
  /** Styles applied to the legend with row layout. */
  row: string;
}

export function getLegendUtilityClass(slot: string) {
  return generateUtilityClass('MuiLegend', slot);
}

export const legendClasses: LegendClasses = generateUtilityClasses('MuiLegend', [
  'root',
  'series',
  'mark',
  'label',
  'column',
  'row',
]);
