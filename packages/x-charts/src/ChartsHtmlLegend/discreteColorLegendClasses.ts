import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { ContinuousColorLegendProps } from './ContinuousColorLegend';

export interface DiscreteColorLegendClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the list item that renders the `minLabel`. */
  minLabel: string;
  /** Styles applied to the list item that renders the `maxLabel`. */
  maxLabel: string;
  /** Styles applied to the list items. */
  item: string;
  /** Styles applied to the legend with column layout. */
  column: string;
  /** Styles applied to the legend with row layout. */
  row: string;
  /** Styles applied to the legend with the labels below the color marks. */
  below: string;
  /** Styles applied to the legend with the labels above the color marks. */
  above: string;
  /** Styles applied to the legend with the labels on the extremes of the color marks. */
  extremes: string;
  /** Styles applied to the legend with the labels on the left of the color marks. */
  left: string;
  /** Styles applied to the legend with the labels on the right of the color marks. */
  right: string;
}

function getLegendUtilityClass(slot: string) {
  return generateUtilityClass('MuiDiscreteColorLegendClasses', slot);
}

export const useUtilityClasses = (props: ContinuousColorLegendProps) => {
  const { classes, direction, labelPosition } = props;
  const slots = {
    root: ['root', direction, labelPosition],
    minLabel: ['minLabel'],
    maxLabel: ['maxLabel'],
    item: ['item'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

export const discreteColorLegendClasses: DiscreteColorLegendClasses = generateUtilityClasses(
  'MuiDiscreteColorLegendClasses',
  [
    'root',
    'minLabel',
    'maxLabel',
    'item',
    'column',
    'row',
    'below',
    'above',
    'extremes',
    'left',
    'right',
  ],
);
