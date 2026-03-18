import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { type SeriesId } from '../models/seriesType/common';

export interface BarClasses {
  /** Styles applied to the bar plot element. */
  root: string;
  /** Styles applied to the group surrounding a series' bar elements. */
  series: string;
  /** Styles applied to the group surrounding a series' labels. */
  seriesLabels: string;
  /** Styles applied to an individual bar element. */
  element: string;
  /** Styles applied to an individual bar label. */
  label: string;
  /** Styles applied to a bar label when it is animated. */
  labelAnimate: string;
}

export type BarClassKey = keyof BarClasses;

export interface BarElementOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  isFocused: boolean;
  classes?: Partial<BarClasses>;
}

export function getBarUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarChart', slot);
}

export const barClasses: BarClasses = generateUtilityClasses('MuiBarChart', [
  'root',
  'series',
  'seriesLabels',
  'element',
  'label',
  'labelAnimate',
]);

export interface UseUtilityClassesOptions {
  skipAnimation?: boolean;
  classes?: Partial<BarClasses>;
}

export const useUtilityClasses = (options?: UseUtilityClassesOptions) => {
  const { skipAnimation, classes } = options ?? {};
  const slots = {
    root: ['root'],
    series: ['series'],
    seriesLabels: ['seriesLabels'],
    element: ['element'],
    label: ['label', !skipAnimation && 'labelAnimate'],
  };

  return composeClasses(slots, getBarUtilityClass, classes);
};
