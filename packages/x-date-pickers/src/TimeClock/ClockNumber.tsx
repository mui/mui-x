import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { CLOCK_WIDTH, CLOCK_HOUR_WIDTH } from './shared';
import {
  ClockNumberClasses,
  getClockNumberUtilityClass,
  clockNumberClasses,
} from './clockNumberClasses';
import { PickerOwnerState } from '../models/pickers';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

export interface ClockNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  'aria-label': string;
  disabled: boolean;
  /**
   * Make sure callers pass an id which. It should be defined if selected.
   */
  id: string | undefined;
  index: number;
  inner: boolean;
  label: string;
  selected: boolean;
  classes?: Partial<ClockNumberClasses>;
}

interface ClockNumberOwnerState extends PickerOwnerState {
  /**
   * `true` if the clock number is in the inner clock ring.
   * When used with meridiem, all the hours are in the outer ring.
   * When used without meridiem, the hours from 1 to 12 are in the outer ring and the hours from 13 to 24 are in the inner ring.
   * The minutes are always in the outer ring.
   */
  isClockNumberInInnerRing: boolean;
  /**
   * `true` if the clock number is selected.
   */
  isClockNumberSelected: boolean;
  /**
   * `true` if the clock number is disabled.
   */
  isClockNumberDisabled: boolean;
}

const useUtilityClasses = (
  classes: Partial<ClockNumberClasses> | undefined,
  ownerState: ClockNumberOwnerState,
) => {
  const slots = {
    root: [
      'root',
      ownerState.isClockNumberSelected && 'selected',
      ownerState.isClockNumberDisabled && 'disabled',
    ],
  };

  return composeClasses(slots, getClockNumberUtilityClass, classes);
};

const ClockNumberRoot = styled('span', {
  name: 'MuiClockNumber',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    styles.root,
    { [`&.${clockNumberClasses.disabled}`]: styles.disabled },
    { [`&.${clockNumberClasses.selected}`]: styles.selected },
  ],
})<{ ownerState: ClockNumberOwnerState }>(({ theme }) => ({
  height: CLOCK_HOUR_WIDTH,
  width: CLOCK_HOUR_WIDTH,
  position: 'absolute',
  left: `calc((100% - ${CLOCK_HOUR_WIDTH}px) / 2)`,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  color: (theme.vars || theme).palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '&:focused': {
    backgroundColor: (theme.vars || theme).palette.background.paper,
  },
  [`&.${clockNumberClasses.selected}`]: {
    color: (theme.vars || theme).palette.primary.contrastText,
  },
  [`&.${clockNumberClasses.disabled}`]: {
    pointerEvents: 'none',
    color: (theme.vars || theme).palette.text.disabled,
  },
  variants: [
    {
      props: { isClockNumberInInnerRing: true },
      style: {
        ...theme.typography.body2,
        color: (theme.vars || theme).palette.text.secondary,
      },
    },
  ],
}));

/**
 * @ignore - internal component.
 */
export function ClockNumber(inProps: ClockNumberProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiClockNumber' });
  const {
    className,
    classes: classesProp,
    disabled,
    index,
    inner,
    label,
    selected,
    ...other
  } = props;

  const { ownerState: pickerOwnerState } = usePickerPrivateContext();
  const ownerState: ClockNumberOwnerState = {
    ...pickerOwnerState,
    isClockNumberInInnerRing: inner,
    isClockNumberSelected: selected,
    isClockNumberDisabled: disabled,
  };
  const classes = useUtilityClasses(classesProp, ownerState);

  const angle = ((index % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  const length = ((CLOCK_WIDTH - CLOCK_HOUR_WIDTH - 2) / 2) * (inner ? 0.65 : 1);
  const x = Math.round(Math.cos(angle) * length);
  const y = Math.round(Math.sin(angle) * length);

  return (
    <ClockNumberRoot
      className={clsx(classes.root, className)}
      aria-disabled={disabled ? true : undefined}
      aria-selected={selected ? true : undefined}
      role="option"
      style={{
        transform: `translate(${x}px, ${y + (CLOCK_WIDTH - CLOCK_HOUR_WIDTH) / 2}px`,
      }}
      ownerState={ownerState}
      {...other}
    >
      {label}
    </ClockNumberRoot>
  );
}
