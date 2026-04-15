import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartsRadiusAxisClasses {
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

export type ChartsRadiusAxisClassKey = keyof ChartsRadiusAxisClasses;

export function getRadiusAxisUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsRadiusAxis', slot);
}

export const radiusAxisClasses: ChartsRadiusAxisClasses = generateUtilityClasses(
  'MuiChartsRadiusAxis',
  ['root', 'line', 'tickContainer', 'tick', 'tickLabel'],
);
