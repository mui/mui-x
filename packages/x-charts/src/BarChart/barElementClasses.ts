import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { SeriesId } from '../models/seriesType/common';

export interface BarElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if it is highlighted. */
  highlighted: string;
  /** Styles applied to the root element if it is faded. */
  faded: string;
   /** Styles applied to the root element for a specified series.
   *  To be used like this: `&.${barElementClasses.series}-${seriesId}`.
   */
   series: string;
}

export type BarElementClassKey = keyof BarElementClasses;

export interface BarElementOwnerState {
  id: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<BarElementClasses>;
}

export function getBarElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarElement', slot);
}

export const barElementClasses: BarElementClasses = generateUtilityClasses('MuiBarElement', [
  'root',
  'highlighted',
  'faded',
  'series',
]);

export const useUtilityClasses = (ownerState: BarElementOwnerState) => {
  const { classes, id, isHighlighted, isFaded } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getBarElementUtilityClass, classes);
};
