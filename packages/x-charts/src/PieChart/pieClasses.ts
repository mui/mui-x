import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface PieClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the `g` element that contains all pie arcs of a series. */
  series: string;
  /** Styles applied to the `g` element that contains all pie arc labels of a series. */
  seriesLabels: string;
}

export type PieClassKey = keyof PieClasses;

export function getPieUtilityClass(slot: string) {
  return generateUtilityClass('MuiPieChart', slot);
}

const slotNames = [
  'root',
  'series',
  'seriesLabels',
] as (keyof PieClasses)[];

export const pieClasses: PieClasses = generateUtilityClasses('MuiPieChart', slotNames);

export const useUtilityClasses = (classes?: Partial<PieClasses>) => {
  const slots = Object.fromEntries(Object.keys(pieClasses).map((key) => [key, [key]]));

  return composeClasses(slots, getPieUtilityClass, classes);
};
