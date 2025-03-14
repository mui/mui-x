import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { SeriesId } from '../models/seriesType/common';

export interface MarkElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
  /** Styles applied to the root element when animation is not skipped. */
  animate: string;
}

export type MarkElementClassKey = keyof MarkElementClasses;

export interface MarkElementOwnerState {
  id: SeriesId;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<MarkElementClasses>;
  skipAnimation?: boolean;
}

export function getMarkElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiMarkElement', slot);
}

export const markElementClasses: MarkElementClasses = generateUtilityClasses('MuiMarkElement', [
  'root',
  'highlighted',
  'faded',
  'animate',
]);

export const useUtilityClasses = (ownerState: MarkElementOwnerState) => {
  const { classes, id, isFaded, isHighlighted, skipAnimation } = ownerState;
  const slots = {
    root: [
      'root',
      `series-${id}`,
      isHighlighted && 'highlighted',
      isFaded && 'faded',
      skipAnimation ? undefined : 'animate',
    ],
  };

  return composeClasses(slots, getMarkElementUtilityClass, classes);
};
