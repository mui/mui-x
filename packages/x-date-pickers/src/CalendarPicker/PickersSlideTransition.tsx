import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { TransitionGroupProps } from 'react-transition-group/TransitionGroup';
import {
  getPickersSlideTransitionUtilityClass,
  pickersSlideTransitionClasses,
  PickersSlideTransitionClasses,
} from './pickersSlideTransitionClasses';

export type SlideDirection = 'right' | 'left';
export interface SlideTransitionProps extends Omit<CSSTransitionProps, 'timeout'> {
  children: React.ReactElement;
  className?: string;
  reduceAnimations: boolean;
  slideDirection: SlideDirection;
  transKey: React.Key;
  classes?: Partial<PickersSlideTransitionClasses>;
}

const useUtilityClasses = (ownerState: SlideTransitionProps) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getPickersSlideTransitionUtilityClass, classes);
};

export const slideAnimationDuration = 350;

const PickersSlideTransitionRoot = styled(TransitionGroup, {
  name: 'PrivatePickersSlideTransition',
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
    duration: slideAnimationDuration,
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
export function PickersSlideTransition(props: SlideTransitionProps) {
  // TODO v6: add 'useThemeProps' once the component class names are aligned
  const { children, className, reduceAnimations, slideDirection, transKey, ...other } = props;
  const classes = useUtilityClasses(props);
  if (reduceAnimations) {
    return <div className={clsx(classes.root, className)}>{children}</div>;
  }

  const transitionClasses = {
    exit: pickersSlideTransitionClasses.slideExit,
    enterActive: pickersSlideTransitionClasses.slideEnterActive,
    enter:
      pickersSlideTransitionClasses[
        `slideEnter-${slideDirection}` as 'slideEnter-left' | 'slideEnter-right'
      ],
    exitActive:
      pickersSlideTransitionClasses[
        `slideExitActiveLeft-${slideDirection}` as
          | 'slideExitActiveLeft-left'
          | 'slideExitActiveLeft-right'
      ],
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
        timeout={slideAnimationDuration}
        classNames={transitionClasses}
        {...other}
      >
        {children}
      </CSSTransition>
    </PickersSlideTransitionRoot>
  );
}
