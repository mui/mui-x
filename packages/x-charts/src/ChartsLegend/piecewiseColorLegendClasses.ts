import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { PiecewiseColorLegendProps } from './PiecewiseColorLegend';
import type { ChartsLegendSlotExtension } from './chartsLegend.types';

export interface PiecewiseColorLegendClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the list item that renders the `minLabel`. */
  minLabel: string;
  /** Styles applied to the list item that renders the `maxLabel`. */
  maxLabel: string;
  /** Styles applied to the list items. */
  item: string;
  /** Styles applied to the legend in column layout. */
  vertical: string;
  /** Styles applied to the legend in row layout. */
  horizontal: string;
  /** Styles applied to the legend with the labels before the color marks. */
  start: string;
  /** Styles applied to the legend with the labels after the color marks. */
  end: string;
  /** Styles applied to the legend with the labels on the extremes of the color marks. */
  extremes: string;
  /** Styles applied to the marks. */
  mark: string;
  /** Styles applied to the series label. */
  label: string;
}

function getLegendUtilityClass(slot: string) {
  return generateUtilityClass('MuiPiecewiseColorLegendClasses', slot);
}

export const useUtilityClasses = (props: PiecewiseColorLegendProps & ChartsLegendSlotExtension) => {
  const { classes, direction, labelPosition } = props;
  const slots = {
    root: ['root', direction, labelPosition],
    minLabel: ['minLabel'],
    maxLabel: ['maxLabel'],
    item: ['item'],
    mark: ['mark'],
    label: ['label'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

export const piecewiseColorLegendClasses: PiecewiseColorLegendClasses = generateUtilityClasses(
  'MuiPiecewiseColorLegendClasses',
  [
    'root',
    'minLabel',
    'maxLabel',
    'item',
    'vertical',
    'horizontal',
    'start',
    'end',
    'extremes',
    'mark',
    'label',
  ],
);
