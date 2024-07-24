import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface ChartsAxisClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the main line element. */
  line: string;
  /** Styles applied to group including the tick and its label. */
  tickContainer: string;
  /** Styles applied to ticks. */
  tick: string;
  /** Styles applied to ticks label. */
  tickLabel: string;
  /** Styles applied to the group containing the axis label. */
  label: string;
  /** Styles applied to x-axes. */
  directionX: string;
  /** Styles applied to y-axes. */
  directionY: string;
  /** Styles applied to the top axis. */
  top: string;
  /** Styles applied to the bottom axis. */
  bottom: string;
  /** Styles applied to the left axis. */
  left: string;
  /** Styles applied to the right axis. */
  right: string;
}

export type ChartsAxisClassKey = keyof ChartsAxisClasses;

export function getAxisUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsAxis', slot);
}
export const axisClasses: ChartsAxisClasses = generateUtilityClasses('MuiChartsAxis', [
  'root',
  'line',
  'tickContainer',
  'tick',
  'tickLabel',
  'label',
  'directionX',
  'directionY',
  'top',
  'bottom',
  'left',
  'right',
]);
