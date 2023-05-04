import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersSlideTransitionClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to content element sliding in from left. */
  'slideEnter-left': string;
  /** Styles applied to content element sliding in from right. */
  'slideEnter-right': string;
  /** Styles applied to the element entering (transitioning into) the container. */
  slideEnterActive: string;
  /** Styles applied to the element leaving (transitioning out of) the container. */
  slideExit: string;
  /** Styles applied to the element on the left leaving (transitioning out of) the container. */
  'slideExitActiveLeft-left': string;
  /** Styles applied to the element on the right leaving (transitioning out of) the container. */
  'slideExitActiveLeft-right': string;
}

export type PickersSlideTransitionClassKey = keyof PickersSlideTransitionClasses;

export const getPickersSlideTransitionUtilityClass = (slot: string) =>
  generateUtilityClass('MuiPickersSlideTransition', slot);

export const pickersSlideTransitionClasses: PickersSlideTransitionClasses = generateUtilityClasses(
  'MuiPickersSlideTransition',
  [
    'root',
    'slideEnter-left',
    'slideEnter-right',
    'slideEnterActive',
    'slideExit',
    'slideExitActiveLeft-left',
    'slideExitActiveLeft-right',
  ],
);
