import * as React from 'react';
import clsx from 'clsx';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import {
  getPickersToolbarTextUtilityClass,
  pickersToolbarTextClasses,
  PickersToolbarTextClasses,
} from './pickersToolbarTextClasses';

export interface PickersToolbarTextProps extends Omit<TypographyProps, 'classes'> {
  selected?: boolean;
  value: React.ReactNode;
  classes?: Partial<PickersToolbarTextClasses>;
}

const useUtilityClasses = (ownerState: PickersToolbarTextProps) => {
  const { classes, selected } = ownerState;
  const slots = {
    root: ['root', selected && 'selected'],
  };

  return composeClasses(slots, getPickersToolbarTextUtilityClass, classes);
};

const PickersToolbarTextRoot = styled(Typography, {
  name: 'PrivatePickersToolbarText',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    styles.root,
    { [`&.${pickersToolbarTextClasses.selected}`]: styles.selected },
  ],
})<{
  component?: React.ElementType;
}>(({ theme }) => ({
  transition: theme.transitions.create('color'),
  color: theme.palette.text.secondary,
  [`&.${pickersToolbarTextClasses.selected}`]: {
    color: theme.palette.text.primary,
  },
}));

export const PickersToolbarText = React.forwardRef<HTMLSpanElement, PickersToolbarTextProps>(
  function PickersToolbarText(props, ref) {
    // TODO v6: add 'useThemeProps' once the component class names are aligned
    const { className, selected, value, ...other } = props;
    const classes = useUtilityClasses(props);

    return (
      <PickersToolbarTextRoot
        ref={ref}
        className={clsx(className, classes.root)}
        component="span"
        {...other}
      >
        {value}
      </PickersToolbarTextRoot>
    );
  },
);
