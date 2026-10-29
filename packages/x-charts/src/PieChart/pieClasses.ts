import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { SeriesId } from '../models/seriesType/common';

export interface PieClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the `g` element that contains all pie arcs of a series. */
  series: string;
  /** Styles applied to the `g` element that contains all pie arc labels of a series. */
  seriesLabels: string;
  /** Styles applied to an individual pie arc element. */
  arc: string;
  /** Styles applied to an individual pie arc label element. */
  arcLabel: string;
  /** Styles applied when animation is not skipped. */
  animate: string;
  /** Styles applied to the focused pie arc element. */
  focusIndicator: string;
}

export type PieClassKey = keyof PieClasses;

export interface PieArcOwnerState {
  /**
   * The id of the series the element belongs to.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
  /**
   * The color of the element.
   */
  color: string;
  /**
   * If `true`, the element is faded.
   */
  isFaded: boolean;
  /**
   * If `true`, the element is highlighted.
   */
  isHighlighted: boolean;
  /**
   * If `true`, the element has keyboard focus.
   */
  isFocused: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PieClasses>;
}

export function getPieUtilityClass(slot: string) {
  return generateUtilityClass('MuiPieChart', slot);
}

export const pieClasses: PieClasses = generateUtilityClasses('MuiPieChart', [
  'root',
  'series',
  'seriesLabels',
  'arc',
  'arcLabel',
  'animate',
  'focusIndicator',
]);

export const useUtilityClasses = (options?: {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PieClasses>;
  /**
   * If `true`, animations are skipped.
   */
  skipAnimation?: boolean;
}) => {
  const { classes, skipAnimation } = options ?? {};
  const slots = {
    root: ['root'],
    series: ['series'],
    seriesLabels: ['seriesLabels'],
    arc: ['arc'],
    arcLabel: ['arcLabel', !skipAnimation && 'animate'],
    focusIndicator: ['focusIndicator'],
  };

  return composeClasses(slots, getPieUtilityClass, classes);
};
