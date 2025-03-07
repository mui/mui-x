import * as React from 'react';
import clsx from 'clsx';
import Button, { ButtonProps } from '@mui/material/Button';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { TypographyProps } from '@mui/material/Typography';
import { PickersToolbarText } from './PickersToolbarText';
import { ExtendMui } from '../models/helpers';
import { getPickersToolbarUtilityClass } from './pickersToolbarClasses';
import { PickersToolbarButtonClasses } from './pickersToolbarButtonClasses';

export interface PickersToolbarButtonProps extends ExtendMui<ButtonProps, 'value' | 'variant'> {
  align?: TypographyProps['align'];
  selected: boolean;
  typographyClassName?: string;
  value: React.ReactNode;
  variant: TypographyProps['variant'];
  classes?: Partial<PickersToolbarButtonClasses>;
  width?: number;
}

const useUtilityClasses = (classes: Partial<PickersToolbarButtonClasses> | undefined) => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getPickersToolbarUtilityClass, classes);
};

const PickersToolbarButtonRoot = styled(Button, {
  name: 'MuiPickersToolbarButton',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({
  padding: 0,
  minWidth: 16,
  textTransform: 'none',
});

export const PickersToolbarButton = React.forwardRef(function PickersToolbarButton(
  inProps: PickersToolbarButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersToolbarButton' });
  const {
    align,
    className,
    classes: classesProp,
    selected,
    typographyClassName,
    value,
    variant,
    width,
    ...other
  } = props;

  const classes = useUtilityClasses(classesProp);

  return (
    <PickersToolbarButtonRoot
      data-testid="toolbar-button"
      variant="text"
      ref={ref}
      className={clsx(classes.root, className)}
      {...(width ? { sx: { width } } : {})}
      {...other}
    >
      <PickersToolbarText
        align={align}
        className={typographyClassName}
        variant={variant}
        value={value}
        selected={selected}
      />
    </PickersToolbarButtonRoot>
  );
});
