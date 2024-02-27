import * as React from 'react';
import clsx from 'clsx';
import { TransitionGroup } from 'react-transition-group';
import Fade from '@mui/material/Fade';
import { styled, useTheme, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import {
  getPickersFadeTransitionGroupUtilityClass,
  PickersFadeTransitionGroupClasses,
} from './pickersFadeTransitionGroupClasses';

export interface PickersFadeTransitionGroupProps {
  children: React.ReactElement;
  className?: string;
  reduceAnimations: boolean;
  transKey: React.Key;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersFadeTransitionGroupClasses>;
}

const useUtilityClasses = (ownerState: PickersFadeTransitionGroupProps) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getPickersFadeTransitionGroupUtilityClass, classes);
};

const PickersFadeTransitionGroupRoot = styled(TransitionGroup, {
  name: 'MuiPickersFadeTransitionGroup',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({
  display: 'block',
  position: 'relative',
});

/**
 * @ignore - do not document.
 */
export function PickersFadeTransitionGroup(inProps: PickersFadeTransitionGroupProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersFadeTransitionGroup' });
  const { children, className, reduceAnimations, transKey } = props;
  const classes = useUtilityClasses(props);
  const theme = useTheme();
  if (reduceAnimations) {
    return children;
  }

  return (
    <PickersFadeTransitionGroupRoot className={clsx(classes.root, className)}>
      <Fade
        appear={false}
        mountOnEnter
        unmountOnExit
        key={transKey}
        timeout={{
          appear: theme.transitions.duration.enteringScreen,
          enter: theme.transitions.duration.enteringScreen,
          exit: 0,
        }}
      >
        {children}
      </Fade>
    </PickersFadeTransitionGroupRoot>
  );
}
