import * as React from 'react';
import clsx from 'clsx';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import {
  getPickersToolbarTextUtilityClass,
  PickersToolbarTextClasses,
} from './pickersToolbarTextClasses';

export interface ExportedPickersToolbarTextProps
  extends Omit<TypographyProps, 'classes' | 'variant' | 'align'> {
  classes?: Partial<PickersToolbarTextClasses>;
}

export interface PickersToolbarTextProps
  extends Omit<TypographyProps, 'classes'>,
    Pick<ExportedPickersToolbarTextProps, 'classes'> {
  selected?: boolean;
  value: React.ReactNode;
}

const useUtilityClasses = (classes: Partial<PickersToolbarTextClasses> | undefined) => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getPickersToolbarTextUtilityClass, classes);
};

const PickersToolbarTextRoot = styled(Typography, {
  name: 'MuiPickersToolbarText',
  slot: 'Root',
  overridesResolver: (_, styles) => [styles.root],
})<{
  component?: React.ElementType;
}>(({ theme }) => ({
  transition: theme.transitions.create('color'),
  color: (theme.vars || theme).palette.text.secondary,
  [`&[data-selected]`]: {
    color: (theme.vars || theme).palette.text.primary,
  },
}));

export const PickersToolbarText = React.forwardRef<HTMLSpanElement, PickersToolbarTextProps>(
  function PickersToolbarText(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiPickersToolbarText' });
    const { className, classes: classesProp, selected, value, ...other } = props;
    const classes = useUtilityClasses(classesProp);

    return (
      <PickersToolbarTextRoot
        ref={ref}
        className={clsx(classes.root, className)}
        component="span"
        {...(selected && { 'data-selected': true })}
        {...other}
      >
        {value}
      </PickersToolbarTextRoot>
    );
  },
);
