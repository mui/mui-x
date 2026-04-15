import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartsRotationAxisClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the main line element. */
  line: string;
  /** Styles applied to the group including the tick and its label. */
  tickContainer: string;
  /** Styles applied to ticks. */
  tick: string;
  /** Styles applied to the tick label. */
  tickLabel: string;
}

export type ChartsRotationAxisClassKey = keyof ChartsRotationAxisClasses;

export function getRotationAxisUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsRotationAxis', slot);
}

export const rotationAxisClasses: ChartsRotationAxisClasses = generateUtilityClasses(
  'MuiChartsRotationAxis',
  ['root', 'line', 'tickContainer', 'tick', 'tickLabel'],
);
