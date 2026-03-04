import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface BarClasses {
  /** Styles applied to the bar plot element. */
  root: string;
  /** Styles applied to the group surrounding a series' bar elements. */
  series: string;
  /** Styles applied to the group surrounding a series' labels. */
  seriesLabels: string;
}

export type BarClassKey = keyof BarClasses;

export function getBarUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarChart', slot);
}

const slotNames = [
  'root',
  'series',
  'seriesLabels',
] as (keyof BarClasses)[];

export const barClasses: BarClasses = generateUtilityClasses('MuiBarChart', slotNames);

export const useUtilityClasses = (classes?: Partial<BarClasses>) => {
  const slots = Object.fromEntries(Object.keys(barClasses).map((key) => [key, [key]]));

  return composeClasses(slots, getBarUtilityClass, classes);
};
