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

export interface ExportedPickersFadeTransitionGroupProps {
  className?: string;
  reduceAnimations: boolean;
  transKey: React.Key;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersFadeTransitionGroupClasses>;
}

export interface PickersFadeTransitionGroupProps extends ExportedPickersFadeTransitionGroupProps {
  children: React.ReactElement<any>;
}

const useUtilityClasses = (classes: Partial<PickersFadeTransitionGroupClasses> | undefined) => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getPickersFadeTransitionGroupUtilityClass, classes);
};

const PickersFadeTransitionGroupRoot = styled(TransitionGroup, {
  name: 'MuiPickersFadeTransitionGroup',
  slot: 'Root',
})<{ ownerState: ExportedPickersFadeTransitionGroupProps }>({
  display: 'block',
  position: 'relative',
});

/**
 * @ignore - do not document.
 */
export function PickersFadeTransitionGroup(inProps: PickersFadeTransitionGroupProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersFadeTransitionGroup' });
  const { className, reduceAnimations, transKey, classes: classesProp } = props;
  const { children, ...other } = props;
  const classes = useUtilityClasses(classesProp);
  const theme = useTheme();

  if (reduceAnimations) {
    return children;
  }
  const ownerState = { ...other };

  return (
    <PickersFadeTransitionGroupRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
    >
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
