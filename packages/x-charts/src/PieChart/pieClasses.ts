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
  return generateUtilityClass('MuiPie', slot);
}

export const pieClasses: PieClasses = generateUtilityClasses('MuiPie', [
  'root',
  'series',
  'seriesLabels',
]);

export const useUtilityClasses = (classes?: Partial<PieClasses>) => {
  const slots = {
    root: ['root'],
    series: ['series'],
    seriesLabels: ['seriesLabels'],
  };

  return composeClasses(slots, getPieUtilityClass, classes);
};
