import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface BarClasses {
  /** Styles applied to the bar plot element. */
  root: string;
  /** Styles applied to the group surrounding a series' bar elements. */
  series: string;
}

export type BarClassKey = keyof BarClasses;

export function getBarUtilityClass(slot: string) {
  return generateUtilityClass('MuiBar', slot);
}

export const barClasses: BarClasses = generateUtilityClasses('MuiBar', ['root', 'series']);

export const useUtilityClasses = (classes?: Partial<BarClasses>) => {
  const slots = {
    root: ['root'],
    series: ['series'],
  };

  return composeClasses(slots, getBarUtilityClass, classes);
};
