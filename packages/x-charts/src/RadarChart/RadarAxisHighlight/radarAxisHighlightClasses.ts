import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { createSlotArrayMap } from '@mui/x-internals/createSlotArrayMap';

/**
 * @deprecated Use `RadarClasses` instead.
 */
export interface RadarAxisHighlightClasses {
  /**
   * Styles applied to the root element.
   * @deprecated Use `radarClasses.axisHighlightRoot` instead.
   */
  root: string;
  /**
   * Styles applied to the highlighted axis line element.
   * @deprecated Use `radarClasses.axisHighlightLine` instead.
   */
  line: string;
  /**
   * Styles applied to every highlight dot.
   * @deprecated Use `radarClasses.axisHighlightDot` instead.
   */
  dot: string;
}

/**
 * @deprecated Use `RadarClassKey` instead.
 */
export type RadarAxisHighlightClassKey = keyof RadarAxisHighlightClasses;

/**
 * @deprecated Use `getRadarUtilityClass` instead.
 */
export function getRadarAxisHighlightUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarAxisHighlight', slot);
}

/**
 * @deprecated Use `radarClasses` instead.
 */
export const chartsAxisHighlightClasses: RadarAxisHighlightClasses = generateUtilityClasses(
  'MuiRadarAxisHighlight',
  ['root', 'line', 'dot'],
);

/**
 * @deprecated Use `useUtilityClasses` instead.
 */
export const useUtilityClasses = (classes?: Partial<RadarAxisHighlightClasses>) => {
  const slots = {
    ...createSlotArrayMap(['root', 'line', 'dot'] as const),
  };

  return composeClasses(slots, getRadarAxisHighlightUtilityClass, classes);
};
