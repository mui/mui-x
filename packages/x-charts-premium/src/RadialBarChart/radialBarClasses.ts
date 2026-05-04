import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RadialBarClasses {
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

export type RadialBarClassKey = keyof RadialBarClasses;

function getRadialBarUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadialBarChart', slot);
}

export const radialBarClasses: RadialBarClasses = generateUtilityClasses('MuiRadialBarChart', [
  'root',
  'series',
  'seriesLabels',
  'element',
  'label',
  'labelAnimate',
]);

interface UseUtilityClassesOptions {
  skipAnimation?: boolean;
  classes?: Partial<RadialBarClasses>;
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

  return composeClasses(slots, getRadialBarUtilityClass, classes);
};
