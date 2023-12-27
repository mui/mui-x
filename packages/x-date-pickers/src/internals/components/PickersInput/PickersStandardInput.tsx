import * as React from 'react';
import { FormControlState, useFormControl } from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import {
  pickersStandardInputClasses,
  getPickersStandardInputUtilityClass,
} from './pickersInputClasses';
import { PickersStandardInputProps } from './PickersInput.types';
import { PickersInputRoot, PickersInput } from './PickersInput';

const StandardInputRoot = styled(PickersInputRoot, {
  name: 'MuiPickersStandardInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => {
  const light = theme.palette.mode === 'light';
  let bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
  if (theme.vars) {
    bottomLineColor = `rgba(${theme.vars.palette.common.onBackgroundChannel} / ${theme.vars.opacity.inputUnderline})`;
  }
  return {
    'label + &': {
      marginTop: 16,
    },
    ...(!ownerState.disableUnderline && {
      '&::after': {
        background: 'red',
        borderBottom: `2px solid ${(theme.vars || theme).palette[ownerState.color as string].main}`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
        content: '""',
        position: 'absolute',
        right: 0,
        transform: 'scaleX(0)',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shorter,
          easing: theme.transitions.easing.easeOut,
        }),
        pointerEvents: 'none', // Transparent to the hover style.
      },
      [`&.${pickersStandardInputClasses.focused}:after`]: {
        // translateX(0) is a workaround for Safari transform scale bug
        // See https://github.com/mui/material-ui/issues/31766
        transform: 'scaleX(1) translateX(0)',
      },
      [`&.${pickersStandardInputClasses.error}`]: {
        '&:before, &:after': {
          borderBottomColor: (theme.vars || theme).palette.error.main,
        },
      },
      '&::before': {
        borderBottom: `1px solid ${bottomLineColor}`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
        content: '"\\00a0"',
        position: 'absolute',
        right: 0,
        transition: theme.transitions.create('border-bottom-color', {
          duration: theme.transitions.duration.shorter,
        }),
        pointerEvents: 'none', // Transparent to the hover style.
      },
      [`&:hover:not(.${pickersStandardInputClasses.disabled}, .${pickersStandardInputClasses.error}):before`]:
        {
          borderBottom: `2px solid ${(theme.vars || theme).palette.text.primary}`,
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            borderBottom: `1px solid ${bottomLineColor}`,
          },
        },
      [`&.${pickersStandardInputClasses.disabled}:before`]: {
        borderBottomStyle: 'dotted',
      },
    }),
  };
});

const useUtilityClasses = (ownerState: OwnerStateType) => {
  const {
    focused,
    disabled,
    error,
    classes,
    fullWidth,
    color,
    size,
    endAdornment,
    startAdornment,
  } = ownerState;

  const slots = {
    root: [
      'root',
      focused && !disabled && 'focused',
      disabled && 'disabled',
      error && 'error',
      fullWidth && 'fullWidth',
      `color${capitalize(color as string)}`,
      size === 'small' && 'inputSizeSmall',
      Boolean(startAdornment) && 'adornedStart',
      Boolean(endAdornment) && 'adornedEnd',
    ],
    notchedOutline: ['notchedOutline'],
    before: ['before'],
    after: ['after'],
    content: ['content'],
    input: ['input'],
  };

  return composeClasses(slots, getPickersStandardInputUtilityClass, classes);
};

interface OwnerStateType
  extends FormControlState,
    Omit<PickersStandardInputProps, keyof FormControlState> {}

export const PickersStandardInput = React.forwardRef(function PickersStandardInput(
  props: PickersStandardInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { label, autoFocus, ownerState: ownerStateProp, ...other } = props;

  const muiFormControl = useFormControl();

  const ownerState = {
    ...props,
    ...ownerStateProp,
    ...muiFormControl,
    color: muiFormControl?.color || 'primary',
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <PickersInput
      slots={{ root: StandardInputRoot }}
      {...other}
      label={label}
      classes={classes}
      ref={ref as any}
    />
  );
});

(PickersInput as any).muiName = 'Input';
