import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { ContinuousColorLegendProps } from './ContinuousColorLegend';

export interface ContinuousColorLegendClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the list item that renders the `minLabel`. */
  minLabel: string;
  /** Styles applied to the list item that renders the `maxLabel`. */
  maxLabel: string;
  /** Styles applied to the list item with the gradient. */
  gradient: string;
}

export type ContinuousColorLegendClassKey = keyof ContinuousColorLegendClasses;

function getLegendUtilityClass(slot: string) {
  return generateUtilityClass('MuiContinuousColorLegend', slot);
}

export const useUtilityClasses = (props: ContinuousColorLegendProps) => {
  const { classes, direction } = props;
  const slots = {
    root: ['root', direction],
    minLabel: ['minLabel'],
    maxLabel: ['maxLabel'],
    gradient: ['gradient'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

export const continuousColorLegendClasses: ContinuousColorLegendClasses = generateUtilityClasses(
  'MuiContinuousColorLegend',
  ['root', 'minLabel', 'maxLabel', 'gradient'],
);
