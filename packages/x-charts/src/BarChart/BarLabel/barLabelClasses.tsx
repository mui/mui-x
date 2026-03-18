import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { BarLabelOwnerState } from './BarLabel.types';

/**
 * @deprecated Use `BarClasses` instead.
 */
export interface BarLabelClasses {
  /** Styles applied to the root element.
   * @deprecated Use `barClasses.label` instead.
   */
  root: string;
  /** Styles applied to the root element if it is highlighted. */
  highlighted: string;
  /** Styles applied to the root element if it is faded. */
  faded: string;
  /** Styles applied to the root element if it is animated.
   * @deprecated Use `barClasses.labelAnimate` instead.
   */
  animate: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${barLabelClasses.series}-${seriesId}`.
   * @deprecated Use `[data-series="${seriesId}"]` selector instead.
   */
  series: string;
}

/**
 * @deprecated Use `BarClassKey` instead.
 */
export type BarLabelClassKey = keyof BarLabelClasses;

/**
 * @deprecated Use `getBarUtilityClass` instead.
 */
export function getBarLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarLabel', slot);
}

/**
 * @deprecated Use `barClasses` instead.
 */
export const barLabelClasses = generateUtilityClasses('MuiBarLabel', [
  'root',
  'highlighted',
  'faded',
  'animate',
]);

/**
 * @deprecated Use `useBarLabelUtilityClasses` instead.
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

  return composeClasses(slots, getBarLabelUtilityClass, classes);
};
