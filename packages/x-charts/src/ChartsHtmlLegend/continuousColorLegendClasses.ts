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
  /** Styles applied to the legend with column layout. */
  column: string;
  /** Styles applied to the legend with row layout. */
  row: string;
  /** Styles applied to the legend with the labels below the gradient. */
  below: string;
  /** Styles applied to the legend with the labels above the gradient. */
  above: string;
  /** Styles applied to the legend with the labels on the extremes of the gradient. */
  extremes: string;
  /** Styles applied to the legend with the labels on the left of the gradient. */
  left: string;
  /** Styles applied to the legend with the labels on the right of the gradient. */
  right: string;
}

export type ContinuousColorLegendClassKey = keyof ContinuousColorLegendClasses;

function getLegendUtilityClass(slot: string) {
  return generateUtilityClass('MuiContinuousColorLegend', slot);
}

export const useUtilityClasses = (props: ContinuousColorLegendProps) => {
  const { classes, direction, labelPosition } = props;
  const slots = {
    root: ['root', direction, labelPosition],
    minLabel: ['minLabel'],
    maxLabel: ['maxLabel'],
    gradient: ['gradient'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

export const continuousColorLegendClasses: ContinuousColorLegendClasses = generateUtilityClasses(
  'MuiContinuousColorLegend',
  [
    'root',
    'minLabel',
    'maxLabel',
    'gradient',
    'column',
    'row',
    'below',
    'above',
    'extremes',
    'left',
    'right',
  ],
);
