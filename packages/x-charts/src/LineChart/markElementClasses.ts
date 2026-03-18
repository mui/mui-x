import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { MarkElementOwnerState } from './lineClasses';

export { type MarkElementOwnerState };

/**
 * @deprecated Use `LineClasses` instead.
 */
export interface MarkElementClasses {
  /**
   * Styles applied to the root element.
   * @deprecated Use `lineClasses.mark` instead.
   */
  root: string;
  /**
   * Styles applied to the root element when highlighted.
   * @deprecated Use `[data-highlighted]` selector instead.
   */
  highlighted: string;
  /**
   * Styles applied to the root element when faded.
   * @deprecated Use `[data-faded]` selector instead.
   */
  faded: string;
  /**
   * Styles applied to the root element when animation is not skipped.
   * @deprecated Use `lineClasses.markAnimate` instead.
   */
  animate: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${markElementClasses.series}-${seriesId}`.
   * @deprecated Use `[data-series="${seriesId}"]` selector instead.
   */
  series: string;
}

/**
 * @deprecated Use `LineClassKey` instead.
 */
export type MarkElementClassKey = keyof MarkElementClasses;

/**
 * @deprecated Use `getLineUtilityClass` instead.
 */
export function getMarkElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiMarkElement', slot);
}

/**
 * @deprecated Use `lineClasses` instead.
 */
export const markElementClasses: MarkElementClasses = generateUtilityClasses('MuiMarkElement', [
  'root',
  'highlighted',
  'faded',
  'animate',
  'series',
]);

/**
 * @deprecated Use `useUtilityClasses` instead.
 */
export const useUtilityClasses = (ownerState: MarkElementOwnerState) => {
  const { classes, seriesId, isFaded, isHighlighted, skipAnimation } = ownerState;
  const slots = {
    root: [
      'root',
      `series-${seriesId}`,
      isHighlighted && 'highlighted',
      isFaded && 'faded',
      skipAnimation ? undefined : 'animate',
    ],
  };

  return composeClasses(slots, getMarkElementUtilityClass, classes);
};
