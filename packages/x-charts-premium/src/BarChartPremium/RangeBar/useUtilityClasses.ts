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

export const rangeBarClasses: RangeBarClasses = generateUtilityClasses('MuiRangeBar', [
  'root',
  'series',
  'seriesLabels',
]);

export const useUtilityClasses = (classes?: Partial<RangeBarClasses>) => {
  const slots = {
    root: ['root'],
    series: ['series'],
    seriesLabels: ['seriesLabels'],
  };

  return composeClasses(slots, getRangeBarUtilityClass, classes);
};
