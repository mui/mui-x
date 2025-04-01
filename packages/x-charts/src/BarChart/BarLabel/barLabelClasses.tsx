import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { BarLabelOwnerState } from './BarLabel.types';

export interface BarLabelClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if it is highlighted. */
  highlighted: string;
  /** Styles applied to the root element if it is faded. */
  faded: string;
  /** Styles applied to the root element if it is animated. */
  animate: string;
}

export type BarLabelClassKey = keyof BarLabelClasses;

export function getBarLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarLabel', slot);
}

export const barLabelClasses = generateUtilityClasses('MuiBarLabel', [
  'root',
  'highlighted',
  'faded',
  'animate',
]);

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
