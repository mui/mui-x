import * as React from 'react';
import { useFormControl } from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import {
  pickersStandardInputClasses,
  getPickersStandardInputUtilityClass,
} from './pickersInputClasses';
import { PickersInputProps, PickersStandardInputProps } from './PickersInput.types';
import { InputWrapper, PickersInput } from './PickersInput';

const StandardSectionsWrapper = styled(InputWrapper, {
  name: 'MuiPickersOutliedInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => {
  const light = theme.palette.mode === 'light';
  let bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
  if (theme.vars) {
    bottomLineColor = `rgba(${theme.vars.palette.common.onBackgroundChannel} / ${theme.vars.opacity.inputUnderline})`;
  }
  return {
    position: 'relative',
    'label + &': {
      marginTop: 16,
    },
    ...(!ownerState.disableUnderline && {
      '&:after': {
        background: 'red',
        borderBottom: `2px solid ${(theme.vars || theme).palette[ownerState.color].main}`,
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
      '&:before': {
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
      `color${capitalize(color)}`,
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

// TODO: move to utils
// Separates the state props from the form control
function formControlState({ props, states, muiFormControl }) {
  return states.reduce((acc, state) => {
    acc[state] = props[state];

    if (muiFormControl) {
      if (typeof props[state] === 'undefined') {
        acc[state] = muiFormControl[state];
      }
    }

    return acc;
  }, {});
}

interface OwnerStateType extends PickersInputProps {
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  adornedStart?: boolean;
  disableUnderline?: boolean;
}

export const PickersStandardInput = React.forwardRef(function PickersStandardInput(
  props: PickersStandardInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { label, autoFocus, ownerState: ownerStateProp, ...other } = props;

  const muiFormControl = useFormControl();
  const fcs = formControlState({
    props,
    muiFormControl,
    states: [
      'color',
      'disabled',
      'error',
      'focused',
      'size',
      'required',
      'fullWidth',
      'adornedStart',
    ],
  });

  const ownerState = {
    ...props,
    ...ownerStateProp,
    color: fcs.color || 'primary',
    disabled: fcs.disabled,
    error: fcs.error,
    focused: fcs.focused,
    fullWidth: fcs.fullWidth,
    size: fcs.size,
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <PickersInput
      slots={{ root: StandardSectionsWrapper }}
      {...other}
      label={label}
      classes={classes}
      ref={ref as any}
    />
  );
});

(PickersInput as any).muiName = 'StandardInput';
