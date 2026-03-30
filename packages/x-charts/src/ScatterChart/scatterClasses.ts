import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ScatterClasses {
  /** Styles applied to the scatter plot element. */
  root: string;
  /** Styles applied to the group surrounding a series' scatter elements. */
  series: string;
  /**
   * Styles applied to an individual scatter marker element.
   * Not applied when using the `svg-batch` renderer.
   */
  marker: string;
  /** Styles applied to the focused scatter mark element. */
  focusedMark: string;
}

export type ScatterClassKey = keyof ScatterClasses;

function getScatterUtilityClass(slot: string) {
  return generateUtilityClass('MuiScatterChart', slot);
}

export const scatterClasses: ScatterClasses = generateUtilityClasses('MuiScatterChart', [
  'root',
  'series',
  'marker',
  'focusedMark',
]);

interface UseUtilityClassesOptions {
  classes?: Partial<ScatterClasses>;
}

export const useUtilityClasses = (options?: UseUtilityClassesOptions) => {
  const { classes } = options ?? {};
  const slots = {
    root: ['root'],
    series: ['series'],
    marker: ['marker'],
    focusedMark: ['focusedMark'],
  };

  return composeClasses(slots, getScatterUtilityClass, classes);
};
