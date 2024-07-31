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

const useUtilityClasses = (ownerState: ClockNumberProps) => {
  const { classes, selected, disabled } = ownerState;
  const slots = {
    root: ['root', selected && 'selected', disabled && 'disabled'],
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
})<{ ownerState: ClockNumberProps }>(({ theme }) => ({
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
      props: { inner: true },
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
  const { className, disabled, index, inner, label, selected, ...other } = props;
  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const angle = ((index % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  const length = ((CLOCK_WIDTH - CLOCK_HOUR_WIDTH - 2) / 2) * (inner ? 0.65 : 1);
  const x = Math.round(Math.cos(angle) * length);
  const y = Math.round(Math.sin(angle) * length);

  return (
    <ClockNumberRoot
      className={clsx(className, classes.root)}
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
