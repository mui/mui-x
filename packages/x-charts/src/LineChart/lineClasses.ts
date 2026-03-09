import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { type SeriesId } from '../models/seriesType/common';

export interface LineClasses {
  /** Styles applied to the line plot element. */
  root: string;
  /** Styles applied to the area element. */
  area: string;
  /** Styles applied to the line element. */
  line: string;
  /** Styles applied to the mark element. */
  mark: string;
  /** Styles applied to a mark element when it is animated. */
  markAnimate: string;
  /** Styles applied to the highlight element. */
  highlight: string;
}

export type LineClassKey = keyof LineClasses;

export interface MarkElementOwnerState {
  seriesId: SeriesId;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<LineClasses>;
  skipAnimation?: boolean;
}

export function getLineUtilityClass(slot: string) {
  return generateUtilityClass('MuiLineChart', slot);
}

export const lineClasses: LineClasses = generateUtilityClasses('MuiLineChart', [
  'root',
  'area',
  'line',
  'mark',
  'markAnimate',
  'highlight',
]);

export interface UseUtilityClassesOptions {
  skipAnimation?: boolean;
  classes?: Partial<LineClasses>;
}

export const useUtilityClasses = (options?: UseUtilityClassesOptions) => {
  const { skipAnimation, classes } = options ?? {};
  const slots = {
    root: ['root'],
    area: ['area'],
    line: ['line'],
    mark: ['mark', !skipAnimation && 'markAnimate'],
    highlight: ['highlight'],
  };

  return composeClasses(slots, getLineUtilityClass, classes);
};
