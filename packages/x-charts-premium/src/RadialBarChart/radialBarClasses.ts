import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RadialBarClasses {
  /** Styles applied to the bar plot element. */
  root: string;
  /** Styles applied to the group surrounding a series' bar elements. */
  series: string;
  /** Styles applied to an individual bar element. */
  element: string;
}

export type RadialBarClassKey = keyof RadialBarClasses;

function getRadialBarUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadialBarChart', slot);
}

export const radialBarClasses: RadialBarClasses = generateUtilityClasses('MuiRadialBarChart', [
  'root',
  'series',
  'element',
]);

interface UseUtilityClassesOptions {
  classes?: Partial<RadialBarClasses>;
}

export const useUtilityClasses = (options?: UseUtilityClassesOptions) => {
  const { classes } = options ?? {};
  const slots = {
    root: ['root'],
    series: ['series'],
    element: ['element'],
  };

  return composeClasses(slots, getRadialBarUtilityClass, classes);
};
