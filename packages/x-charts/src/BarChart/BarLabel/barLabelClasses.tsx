import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { BarLabelOwnerState } from './BarLabel.types';

/**
 * @deprecated Use `BarClasses` from `../barClasses` instead.
 */
export interface BarLabelClasses {
  /** Styles applied to the root element. */
  root: string;
  /**
   * Styles applied to the root element if it is highlighted.
   * @deprecated Use `[data-highlighted]` selector instead.
   */
  highlighted: string;
  /**
   * Styles applied to the root element if it is faded.
   * @deprecated Use `[data-faded]` selector instead.
   */
  faded: string;
  /** Styles applied to the root element if it is animated. */
  animate: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${barLabelClasses.series}-${seriesId}`.
   */
  series: string;
}

/**
 * @deprecated Use `BarClassKey` from `../barClasses` instead.
 */
export type BarLabelClassKey = keyof BarLabelClasses;

/**
 * @deprecated Use `getBarUtilityClass` from `../barClasses` instead.
 */
export function getBarLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarLabel', slot);
}

/**
 * @deprecated Use `barClasses` from `../barClasses` instead.
 */
export const barLabelClasses = generateUtilityClasses('MuiBarLabel', [
  'root',
  'highlighted',
  'faded',
  'animate',
]);

/**
 * @deprecated Use `useBarLabelUtilityClasses` from `../barClasses` instead.
 */
export const useUtilityClasses = (ownerState: BarLabelOwnerState) => {
  const { classes, seriesId, isFaded, isHighlighted, skipAnimation } = ownerState;
  const slots = {
    root: [
      'root',
      `series-${seriesId}`,
      isHighlighted && 'highlighted',
      isFaded && 'faded',
      !skipAnimation && 'animate',
    ],
  };

  return composeClasses(slots, getBarLabelUtilityClass, classes as Partial<BarLabelClasses>);
};
