import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { type SeriesId } from '../models/seriesType/common';
import { createSlotArrayMap } from '@mui/x-internals/createSlotArrayMap';

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
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  isFocused: boolean;
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
  classes?: Partial<PieClasses>;
  skipAnimation?: boolean;
}) => {
  const { classes, skipAnimation } = options ?? {};
  const slots = {
    arcLabel: ['arcLabel', !skipAnimation && 'animate'],
    ...createSlotArrayMap(['root', 'series', 'seriesLabels', 'arc', 'focusIndicator'] as const),
  };

  return composeClasses(slots, getPieUtilityClass, classes);
};
