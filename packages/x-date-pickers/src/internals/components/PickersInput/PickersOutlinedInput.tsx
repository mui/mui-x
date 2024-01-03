import * as React from 'react';
import { FormControlState, useFormControl } from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import {
  pickersOutlinedInputClasses,
  getPickersOutlinedInputUtilityClass,
} from './pickersInputClasses';
import Outline from './Outline';
import { PickersOutlinedInputProps } from './PickersInput.types';
import { PickersInputRoot, PickersInput, PickersInputSectionsContainer } from './PickersInput';

const OutlinedInputRoot = styled(PickersInputRoot, {
  name: 'MuiPickersOutlinedInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    padding: '0 14px',

    borderRadius: (theme.vars || theme).shape.borderRadius,
    [`&:hover .${pickersOutlinedInputClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.text.primary,
    },

    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      [`&:hover .${pickersOutlinedInputClasses.notchedOutline}`]: {
        borderColor: theme.vars
          ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
          : borderColor,
      },
    },
    [`&.${pickersOutlinedInputClasses.focused} .${pickersOutlinedInputClasses.notchedOutline}`]: {
      borderStyle: 'solid',
      borderColor: (theme.vars || theme).palette[ownerState.color as string].main,
      borderWidth: 2,
    },
    [`&.${pickersOutlinedInputClasses.disabled}`]: {
      [`& .${pickersOutlinedInputClasses.notchedOutline}`]: {
        borderColor: (theme.vars || theme).palette.action.disabled,
      },

      '*': {
        color: (theme.vars || theme).palette.action.disabled,
      },
    },

    [`&.${pickersOutlinedInputClasses.error} .${pickersOutlinedInputClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.error.main,
    },
  };
});

const OutlinedPickersInputSectionsContainer = styled(PickersInputSectionsContainer, {
  name: 'MuiPickersOutlinedInput',
  slot: 'SectionsContainer',
  overridesResolver: (props, styles) => styles.sectionsContainer,
})<{ ownerState: OwnerStateType }>(({ ownerState }) => ({
  padding: '16.5px 0',
  ...(ownerState.size === 'small' && {
    padding: '8.5px 0',
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
      `color${color ? capitalize(color as string) : ''}`,
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

  return composeClasses(slots, getPickersOutlinedInputUtilityClass, classes);
};

interface OwnerStateType
  extends FormControlState,
    Omit<PickersOutlinedInputProps, keyof FormControlState> {}

export const PickersOutlinedInput = React.forwardRef(function PickersOutlinedInput(
  props: PickersOutlinedInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { label, autoFocus, ownerState: ownerStateProp, notched, ...other } = props;

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
      slots={{ root: OutlinedInputRoot, input: OutlinedPickersInputSectionsContainer }}
      renderSuffix={(state) => (
        <Outline
          shrink={Boolean(notched || state.adornedStart || state.focused || state.filled)}
          notched={Boolean(notched || state.adornedStart || state.focused || state.filled)}
          className={classes.notchedOutline}
          label={
            label != null && label !== '' && muiFormControl?.required ? (
              <React.Fragment>
                {label}
                &thinsp;{'*'}
              </React.Fragment>
            ) : (
              label
            )
          }
          ownerState={ownerState}
        />
      )}
      {...other}
      label={label}
      classes={classes}
      ref={ref as any}
    />
  );
});

(PickersInput as any).muiName = 'Input';
