import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface XAxisClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the main line element. */
  line: string;
  /** Styles applied to group ingruding the tick and its label. */
  tickContainer: string;
  /** Styles applied to ticks. */
  tick: string;
  /** Styles applied to ticks label. */
  tickLabel: string;
  /** Styles applied to the axis label. */
  label: string;
}

export type XAxisClassKey = keyof XAxisClasses;

export function getXAxisUtilityClass(slot: string) {
  return generateUtilityClass('MuiXAxis', slot);
}

export const xAxisClasses: XAxisClasses = generateUtilityClasses('MuiXAxis', [
  'root',
  'line',
  'tickContainer',
  'tick',
  'tickLabel',
  'label',
]);
