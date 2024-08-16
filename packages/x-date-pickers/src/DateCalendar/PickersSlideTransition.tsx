import * as React from 'react';
import clsx from 'clsx';
import { styled, useTheme, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { TransitionGroupProps } from 'react-transition-group/TransitionGroup';
import {
  getPickersSlideTransitionUtilityClass,
  pickersSlideTransitionClasses,
  PickersSlideTransitionClasses,
} from './pickersSlideTransitionClasses';

export type SlideDirection = 'right' | 'left';
export interface ExportedSlideTransitionProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersSlideTransitionClasses>;
}
export interface SlideTransitionProps
  extends Omit<CSSTransitionProps, 'timeout'>,
    ExportedSlideTransitionProps {
  children: React.ReactElement;
  className?: string;
  reduceAnimations: boolean;
  slideDirection: SlideDirection;
  transKey: React.Key;
}

const useUtilityClasses = (ownerState: SlideTransitionProps) => {
  const { classes, slideDirection } = ownerState;
  const slots = {
    root: ['root'],
    exit: ['slideExit'],
    enterActive: ['slideEnterActive'],
    enter: [`slideEnter-${slideDirection}`],
    exitActive: [`slideExitActiveLeft-${slideDirection}`],
  };

  return composeClasses(slots, getPickersSlideTransitionUtilityClass, classes);
};

const PickersSlideTransitionRoot = styled(TransitionGroup, {
  name: 'MuiPickersSlideTransition',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    styles.root,
    { [`.${pickersSlideTransitionClasses['slideEnter-left']}`]: styles['slideEnter-left'] },
    { [`.${pickersSlideTransitionClasses['slideEnter-right']}`]: styles['slideEnter-right'] },
    { [`.${pickersSlideTransitionClasses.slideEnterActive}`]: styles.slideEnterActive },
    { [`.${pickersSlideTransitionClasses.slideExit}`]: styles.slideExit },
    {
      [`.${pickersSlideTransitionClasses['slideExitActiveLeft-left']}`]:
        styles['slideExitActiveLeft-left'],
    },
    {
      [`.${pickersSlideTransitionClasses['slideExitActiveLeft-right']}`]:
        styles['slideExitActiveLeft-right'],
    },
  ],
})<TransitionGroupProps>(({ theme }) => {
  const slideTransition = theme.transitions.create('transform', {
    duration: theme.transitions.duration.complex,
    easing: 'cubic-bezier(0.35, 0.8, 0.4, 1)',
  });
  return {
    display: 'block',
    position: 'relative',
    overflowX: 'hidden',
    '& > *': {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
    },
    [`& .${pickersSlideTransitionClasses['slideEnter-left']}`]: {
      willChange: 'transform',
      transform: 'translate(100%)',
      zIndex: 1,
    },
    [`& .${pickersSlideTransitionClasses['slideEnter-right']}`]: {
      willChange: 'transform',
      transform: 'translate(-100%)',
      zIndex: 1,
    },
    [`& .${pickersSlideTransitionClasses.slideEnterActive}`]: {
      transform: 'translate(0%)',
      transition: slideTransition,
    },
    [`& .${pickersSlideTransitionClasses.slideExit}`]: {
      transform: 'translate(0%)',
    },
    [`& .${pickersSlideTransitionClasses['slideExitActiveLeft-left']}`]: {
      willChange: 'transform',
      transform: 'translate(-100%)',
      transition: slideTransition,
      zIndex: 0,
    },
    [`& .${pickersSlideTransitionClasses['slideExitActiveLeft-right']}`]: {
      willChange: 'transform',
      transform: 'translate(100%)',
      transition: slideTransition,
      zIndex: 0,
    },
  };
});

/**
 * @ignore - do not document.
 */
export function PickersSlideTransition(inProps: SlideTransitionProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersSlideTransition' });
  const {
    children,
    className,
    reduceAnimations,
    slideDirection,
    transKey,
    // extracting `classes` from `other`
    classes: providedClasses,
    ...other
  } = props;
  const classes = useUtilityClasses(props);
  const theme = useTheme();
  if (reduceAnimations) {
    return <div className={clsx(classes.root, className)}>{children}</div>;
  }

  const transitionClasses = {
    exit: classes.exit,
    enterActive: classes.enterActive,
    enter: classes.enter,
    exitActive: classes.exitActive,
  };

  return (
    <PickersSlideTransitionRoot
      className={clsx(classes.root, className)}
      childFactory={(element: React.ReactElement) =>
        React.cloneElement(element, {
          classNames: transitionClasses,
        })
      }
      role="presentation"
    >
      <CSSTransition
        mountOnEnter
        unmountOnExit
        key={transKey}
        timeout={theme.transitions.duration.complex}
        classNames={transitionClasses}
        {...other}
      >
        {children}
      </CSSTransition>
    </PickersSlideTransitionRoot>
  );
}
