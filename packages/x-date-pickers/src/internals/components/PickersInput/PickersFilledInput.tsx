import * as React from 'react';
import { useFormControl } from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import {
  pickersFilledInputClasses,
  getPickersFilledInputUtilityClass,
} from './pickersInputClasses';
import { PickersFilledInputProps } from './PickersInput.types';
import { InputWrapper, PickersInput, SectionsContainer } from './PickersInput';
import { formControlState } from './pickersInputUtiles';

const FilledSectionsWrapper = styled(InputWrapper, {
  name: 'MuiPickersOutliedInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => {
  const light = theme.palette.mode === 'light';
  const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
  const backgroundColor = light ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.09)';
  const hoverBackground = light ? 'rgba(0, 0, 0, 0.09)' : 'rgba(255, 255, 255, 0.13)';
  const disabledBackground = light ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)';

  return {
    backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
    borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
    borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut,
    }),
    '&:hover': {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.hoverBg : hoverBackground,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
      },
    },

    [`&.${pickersFilledInputClasses.focused}`]: {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
    },
    [`&.${pickersFilledInputClasses.disabled}`]: {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.disabledBg : disabledBackground,
    },

    ...(!ownerState.disableUnderline && {
      '&:after': {
        borderBottom: `2px solid ${
          (theme.vars || theme).palette[ownerState.color || 'primary']?.main
        }`,
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
      [`&.${pickersFilledInputClasses.focused}:after`]: {
        // translateX(0) is a workaround for Safari transform scale bug
        // See https://github.com/mui/material-ui/issues/31766
        transform: 'scaleX(1) translateX(0)',
      },
      [`&.${pickersFilledInputClasses.error}`]: {
        '&:before, &:after': {
          borderBottomColor: (theme.vars || theme).palette.error.main,
        },
      },
      '&:before': {
        borderBottom: `1px solid ${
          theme.vars
            ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / ${theme.vars.opacity.inputUnderline})`
            : bottomLineColor
        }`,
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
      [`&:hover:not(.${pickersFilledInputClasses.disabled}, .${pickersFilledInputClasses.error}):before`]:
        {
          borderBottom: `1px solid ${(theme.vars || theme).palette.text.primary}`,
        },
      [`&.${pickersFilledInputClasses.disabled}:before`]: {
        borderBottomStyle: 'dotted',
      },
    }),
    ...(ownerState.startAdornment && {
      paddingLeft: 12,
    }),
    ...(ownerState.endAdornment && {
      paddingRight: 12,
    }),
  };
});

const FilledSectionsContainer = styled(SectionsContainer, {
  name: 'MuiPickersFilledInput',
  slot: 'Input',
  overridesResolver: (props, styles) => styles.input,
})<{ ownerState: OwnerStateType }>(({ ownerState }) => ({
  paddingTop: 25,
  paddingRight: 12,
  paddingBottom: 8,
  paddingLeft: 12,
  ...(ownerState.size === 'small' && {
    paddingTop: 21,
    paddingBottom: 4,
  }),

  ...(ownerState.startAdornment && {
    paddingLeft: 0,
  }),
  ...(ownerState.endAdornment && {
    paddingRight: 0,
  }),
  ...(ownerState.hiddenLabel && {
    paddingTop: 16,
    paddingBottom: 17,
  }),
  ...(ownerState.hiddenLabel &&
    ownerState.size === 'small' && {
      paddingTop: 8,
      paddingBottom: 9,
    }),
}));

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

  return composeClasses(slots, getPickersFilledInputUtilityClass, classes);
};

interface OwnerStateType extends PickersFilledInputProps {
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  adornedStart?: boolean;
}

export const PickersFilledInput = React.forwardRef(function PickersFilledInput(
  props: PickersFilledInputProps,
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
      slots={{ root: FilledSectionsWrapper, input: FilledSectionsContainer }}
      {...other}
      label={label}
      classes={classes}
      ref={ref as any}
    />
  );
});

(PickersInput as any).muiName = 'FilledInput';
