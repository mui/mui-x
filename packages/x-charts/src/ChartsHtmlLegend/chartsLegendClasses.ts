import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { ChartsLegendProps } from './ChartsLegend';
import { ChartsLegendSlotExtension } from './legend.types';

export interface ChartsLegendClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to a series element. */
  series: string;
  /** Styles applied to series mark element. */
  mark: string;
  /** Styles applied to the series label. */
  label: string;
  /** Styles applied to the legend with column layout. */
  column: string;
  /** Styles applied to the legend with row layout. */
  row: string;
}

export type ChartsLegendClassKey = keyof ChartsLegendClasses;

function getLegendUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsLegend', slot);
}

export const useUtilityClasses = (props: ChartsLegendProps & ChartsLegendSlotExtension) => {
  const { classes, direction } = props;
  const slots = {
    root: ['root', direction],
    mark: ['mark'],
    label: ['label'],
    series: ['series'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

export const legendClasses: ChartsLegendClasses = generateUtilityClasses('MuiChartsLegend', [
  'root',
  'series',
  'itemBackground',
  'mark',
  'label',
  'column',
  'row',
]);
