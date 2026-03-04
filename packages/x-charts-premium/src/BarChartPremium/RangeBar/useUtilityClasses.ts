import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RangeBarClasses {
  /** Styles applied to the range bar plot element. */
  root: string;
  /** Styles applied to the group surrounding a series' bar elements. */
  series: string;
  /** Styles applied to the group surrounding a series' labels. */
  seriesLabels: string;
}

export type RangeBarClassKey = keyof RangeBarClasses;

export function getRangeBarUtilityClass(slot: string) {
  return generateUtilityClass('MuiRangeBar', slot);
}

const slotNames = [
  'root',
  'series',
  'seriesLabels',
] as (keyof RangeBarClasses)[];

export const rangeBarClasses: RangeBarClasses = generateUtilityClasses('MuiRangeBar', slotNames);

export const useUtilityClasses = (classes?: Partial<RangeBarClasses>) => {
  const slots = Object.fromEntries(Object.keys(rangeBarClasses).map((key) => [key, [key]]));

  return composeClasses(slots, getRangeBarUtilityClass, classes);
};
