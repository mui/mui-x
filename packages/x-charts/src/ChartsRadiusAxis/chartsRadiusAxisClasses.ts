import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { ChartsRadiusAxisProps } from './ChartsRadiusAxis';

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
  /** Styles applied to the tick label when centered. */
  centered: string;
}

export type ChartsRadiusAxisClassKey = keyof ChartsRadiusAxisClasses;

export function getRadiusAxisUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsRadiusAxis', slot);
}

export const useUtilityClasses = (props: Pick<ChartsRadiusAxisProps, 'classes' | 'center'>) => {
  const { classes, center } = props;
  const slots = {
    root: ['root'],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel', center && 'centered'],
  };

  return composeClasses(slots, getRadiusAxisUtilityClass, classes);
};

export const chartsRadiusAxisClasses: ChartsRadiusAxisClasses = generateUtilityClasses(
  'MuiChartsRadiusAxis',
  ['root', 'line', 'tickContainer', 'tick', 'tickLabel', 'centered'],
);
