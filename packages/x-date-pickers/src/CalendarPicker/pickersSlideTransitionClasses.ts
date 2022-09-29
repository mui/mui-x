import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

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
  // TODO v6: Rename 'PrivatePickersSlideTransition' to 'MuiPickersSlideTransition' to follow convention
  generateUtilityClass('PrivatePickersSlideTransition', slot);

export const pickersSlideTransitionClasses: PickersSlideTransitionClasses = generateUtilityClasses(
  // TODO v6: Rename 'PrivatePickersSlideTransition' to 'MuiPickersSlideTransition' to follow convention
  'PrivatePickersSlideTransition',
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
