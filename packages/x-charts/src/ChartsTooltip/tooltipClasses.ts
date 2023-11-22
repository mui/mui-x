import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface ChartsTooltipClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the markCell element. */
  markCell: string;
  /** Styles applied to the labelCell element. */
  labelCell: string;
  /** Styles applied to the valueCell element. */
  valueCell: string;
}

export type ChartsTooltipClassKey = keyof ChartsTooltipClasses;

export function getTooltipUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsTooltip', slot);
}
export const tooltipClasses: ChartsTooltipClasses = generateUtilityClasses('MuiChartsTooltip', [
  'root',
  'markCell',
  'labelCell',
  'valueCell',
]);
