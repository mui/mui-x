import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { ContinuousColorLegendProps } from './ContinuousColorLegend';
import type { ChartsLegendSlotExtension } from './chartsLegend.types';

export interface ContinuousColorLegendClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the list item that renders the `minLabel`. */
  minLabel: string;
  /** Styles applied to the list item that renders the `maxLabel`. */
  maxLabel: string;
  /** Styles applied to the list item with the gradient. */
  gradient: string;
  /** Styles applied to the legend in column layout. */
  vertical: string;
  /** Styles applied to the legend in row layout. */
  horizontal: string;
  /** Styles applied to the legend with the labels before the gradient. */
  start: string;
  /** Styles applied to the legend with the labels after the gradient. */
  end: string;
  /** Styles applied to the legend with the labels on the extremes of the gradient. */
  extremes: string;
  /** Styles applied to the series label. */
  label: string;
}

function getLegendUtilityClass(slot: string) {
  return generateUtilityClass('MuiContinuousColorLegend', slot);
}

export const useUtilityClasses = (
  props: ContinuousColorLegendProps & ChartsLegendSlotExtension,
) => {
  const { classes, direction, labelPosition } = props;
  const slots = {
    root: ['root', direction, labelPosition],
    minLabel: ['minLabel'],
    maxLabel: ['maxLabel'],
    gradient: ['gradient'],
    mark: ['mark'],
    label: ['label'],
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
    'vertical',
    'horizontal',
    'start',
    'end',
    'extremes',
    'label',
  ],
);
