import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartsRadialAxisClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element of radius axis. */
  radius: string;
  /** Styles applied to the root element of rotation axis. */
  rotation: string;
  /** Styles applied to the main line element. */
  line: string;
  /** Styles applied to the group including the tick and its label. */
  tickContainer: string;
  /** Styles applied to ticks. */
  tick: string;
  /** Styles applied to the tick label. */
  tickLabel: string;
  /** Styles applied to the tick label when centered. */
  centered: string;
}

export type ChartsRadialAxisClassKey = keyof ChartsRadialAxisClasses;

export function getRadialAxisUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsRadialAxis', slot);
}

export const chartsRadialAxisClasses: ChartsRadialAxisClasses = generateUtilityClasses(
  'MuiChartsRadialAxis',
  ['root', 'radius', 'rotation', 'line', 'tickContainer', 'tick', 'tickLabel', 'centered'],
);
