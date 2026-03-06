import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { BarElementOwnerState } from './barClasses';

export { type BarElementOwnerState };

/**
 * @deprecated Use `BarClasses` from `./barClasses` instead.
 */
export interface BarElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if it is highlighted. */
  highlighted: string;
  /** Styles applied to the root element if it is faded. */
  faded: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${barElementClasses.series}-${seriesId}`.
   */
  series: string;
}

/**
 * @deprecated Use `BarClassKey` from `./barClasses` instead.
 */
export type BarElementClassKey = keyof BarElementClasses;

/**
 * @deprecated Use `getBarUtilityClass` from `./barClasses` instead.
 */
export function getBarElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarElement', slot);
}

/**
 * @deprecated Use `barClasses` from `./barClasses` instead.
 */
export const barElementClasses: BarElementClasses = generateUtilityClasses('MuiBarElement', [
  'root',
  'highlighted',
  'faded',
  'series',
]);

/**
 * @deprecated Use `useBarElementUtilityClasses` from `./barClasses` instead.
 */
export const useUtilityClasses = (ownerState: BarElementOwnerState) => {
  const { classes, seriesId, isHighlighted, isFaded } = ownerState;
  const slots = {
    root: ['root', `series-${seriesId}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getBarElementUtilityClass, classes);
};
