import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { CLOCK_WIDTH, CLOCK_HOUR_WIDTH } from './shared';
import { PickerOwnerState, TimeView } from '../models';
import { ClockPointerClasses, getClockPointerUtilityClass } from './clockPointerClasses';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

export interface ClockPointerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * `true` if the pointer is between two clock values.
   * On the `hours` view, it is always false.
   * On the `minutes` view, it is true if the pointer is on a value that is not a multiple of 5.
   */
  isBetweenTwoClockValues: boolean;
  isInner: boolean;
  type: TimeView;
  viewValue: number;
  classes?: Partial<ClockPointerClasses>;
}

interface ClockPointerOwnerState extends PickerOwnerState {
  /**
   * `true` if the clock pointer should animate.
   */
  isClockPointerAnimated: boolean;
  /**
   * `true` if the pointer is between two clock values.
   * On the `hours` view, it is always false.
   * On the `minutes` view, it is true if the pointer is on a value that is not a multiple of 5.
   */
  isClockPointerBetweenTwoValues: boolean;
}

const useUtilityClasses = (classes: Partial<ClockPointerClasses> | undefined) => {
  const slots = {
    root: ['root'],
    thumb: ['thumb'],
  };

  return composeClasses(slots, getClockPointerUtilityClass, classes);
};

const ClockPointerRoot = styled('div', {
  name: 'MuiClockPointer',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{
  ownerState: ClockPointerOwnerState;
}>(({ theme }) => ({
  width: 2,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  position: 'absolute',
  left: 'calc(50% - 1px)',
  bottom: '50%',
  transformOrigin: 'center bottom 0px',
  variants: [
    {
      props: { isClockPointerAnimated: true },
      style: {
        transition: theme.transitions.create(['transform', 'height']),
      },
    },
  ],
}));

const ClockPointerThumb = styled('div', {
  name: 'MuiClockPointer',
  slot: 'Thumb',
  overridesResolver: (_, styles) => styles.thumb,
})<{
  ownerState: ClockPointerOwnerState;
}>(({ theme }) => ({
  width: 4,
  height: 4,
  backgroundColor: (theme.vars || theme).palette.primary.contrastText,
  borderRadius: '50%',
  position: 'absolute',
  top: -21,
  left: `calc(50% - ${CLOCK_HOUR_WIDTH / 2}px)`,
  border: `${(CLOCK_HOUR_WIDTH - 4) / 2}px solid ${(theme.vars || theme).palette.primary.main}`,
  boxSizing: 'content-box',
  variants: [
    {
      props: { isBetweenTwoClockValues: false },
      style: {
        backgroundColor: (theme.vars || theme).palette.primary.main,
      },
    },
  ],
}));

/**
 * @ignore - internal component.
 */
export function ClockPointer(inProps: ClockPointerProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiClockPointer' });
  const {
    className,
    classes: classesProp,
    isBetweenTwoClockValues,
    isInner,
    type,
    viewValue,
    ...other
  } = props;
  const previousType = React.useRef<TimeView | null>(type);
  React.useEffect(() => {
    previousType.current = type;
  }, [type]);

  const { ownerState: pickerOwnerState } = usePickerPrivateContext();
  const ownerState: ClockPointerOwnerState = {
    ...pickerOwnerState,
    isClockPointerAnimated: previousType.current !== type,
    isClockPointerBetweenTwoValues: isBetweenTwoClockValues,
  };
  const classes = useUtilityClasses(classesProp);

  const getAngleStyle = () => {
    const max = type === 'hours' ? 12 : 60;
    let angle = (360 / max) * viewValue;

    if (type === 'hours' && viewValue > 12) {
      angle -= 360; // round up angle to max 360 degrees
    }

    return {
      height: Math.round((isInner ? 0.26 : 0.4) * CLOCK_WIDTH),
      transform: `rotateZ(${angle}deg)`,
    };
  };

  return (
    <ClockPointerRoot
      style={getAngleStyle()}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <ClockPointerThumb ownerState={ownerState} className={classes.thumb} />
    </ClockPointerRoot>
  );
}
