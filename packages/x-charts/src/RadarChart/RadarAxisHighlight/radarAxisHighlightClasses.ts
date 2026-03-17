import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { createSlotArrayMap } from '@mui/x-internals/createSlotArrayMap';

/**
 * @deprecated Use `RadarClasses` from `../radarClasses` instead.
 */
export interface RadarAxisHighlightClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the highlighted axis line element. */
  line: string;
  /** Styles applied to every highlight dot. */
  dot: string;
}

/**
 * @deprecated Use `RadarClassKey` from `../radarClasses` instead.
 */
export type RadarAxisHighlightClassKey = keyof RadarAxisHighlightClasses;

/**
 * @deprecated Use `getRadarUtilityClass` from `../radarClasses` instead.
 */
export function getRadarAxisHighlightUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarAxisHighlight', slot);
}

/**
 * @deprecated Use `radarClasses` from `../radarClasses` instead.
 */
export const chartsAxisHighlightClasses: RadarAxisHighlightClasses = generateUtilityClasses(
  'MuiRadarAxisHighlight',
  ['root', 'line', 'dot'],
);

/**
 * @deprecated Use `useUtilityClasses` from `../radarClasses` instead.
 */
export const useUtilityClasses = (classes?: Partial<RadarAxisHighlightClasses>) => {
  const slots = {
    ...createSlotArrayMap(['root', 'line', 'dot'] as const),
  };

  return composeClasses(slots, getRadarAxisHighlightUtilityClass, classes);
};
