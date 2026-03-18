import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { BarElementOwnerState } from './barClasses';

export { type BarElementOwnerState };

/**
 * @deprecated Use `BarClasses` instead.
 */
export interface BarElementClasses {
  /**
   * Styles applied to the root element.
   * @deprecated Use `barClasses.element` instead.
   */
  root: string;
  /** Styles applied to the root element if it is highlighted. */
  highlighted: string;
  /** Styles applied to the root element if it is faded. */
  faded: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${barElementClasses.series}-${seriesId}`.
   * @deprecated Use `[data-series="${seriesId}"]` selector instead.
   */
  series: string;
}

/**
 * @deprecated Use `BarClassKey` instead.
 */
export type BarElementClassKey = keyof BarElementClasses;

/**
 * @deprecated Use `getBarUtilityClass` instead.
 */
export function getBarElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarElement', slot);
}

/**
 * @deprecated Use `barClasses` instead.
 */
export const barElementClasses: BarElementClasses = generateUtilityClasses('MuiBarElement', [
  'root',
  'highlighted',
  'faded',
  'series',
]);

/**
 * @deprecated Use `useBarElementUtilityClasses` instead.
 */
export const useUtilityClasses = (ownerState: BarElementOwnerState) => {
  const { classes, id, isHighlighted, isFaded } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getBarElementUtilityClass, classes);
};
