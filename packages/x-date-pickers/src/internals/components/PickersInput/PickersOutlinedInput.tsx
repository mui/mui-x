import * as React from 'react';
import { useFormControl } from '@mui/material/FormControl';
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
import { PickersInputProps, PickersOutlinedInputProps } from './PickersInput.types';
import { InputWrapper, PickersInput, SectionsContainer } from './PickersInput';
import { formControlState } from './pickersInputUtiles';

const OutlinedSectionsWrapper = styled(InputWrapper, {
  name: 'MuiPickersOutliedInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    cursor: 'text',
    padding: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: ownerState.fullWidth ? '100%' : '25ch',
    position: 'relative',
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
      borderColor: (theme.vars || theme).palette[ownerState.color].main,
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

const OutlinedSectionsContainer = styled(SectionsContainer, {
  name: 'MuiPickersOutlinedInput',
  slot: 'Input',
  overridesResolver: (props, styles) => styles.input,
})<{ ownerState: OwnerStateType }>(({ ownerState }) => ({
  ...(ownerState.size === 'small' && {
    padding: '8.5px 14px',
  }),
}));

const NotchedOutlineRoot = styled(Outline, {
  name: 'MuiPickersOutliendInput',
  slot: 'NotchedOutline',
  overridesResolver: (props, styles) => styles.notchedOutline,
})(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    borderColor: theme.vars
      ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
      : borderColor,
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

  return composeClasses(slots, getPickersOutlinedInputUtilityClass, classes);
};

interface OwnerStateType extends PickersInputProps {
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  adornedStart?: boolean;
}

export const PickersOutlinedInput = React.forwardRef(function PickersOutlinedInput(
  props: PickersOutlinedInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { label, autoFocus, ownerState: ownerStateProp, notched, ...other } = props;

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
      slots={{ root: OutlinedSectionsWrapper, input: OutlinedSectionsContainer }}
      renderSuffix={(state) => (
        <NotchedOutlineRoot
          shrink={notched || state.adornedStart || state.focused || state.filled}
          notched={notched || state.adornedStart || state.focused || state.filled}
          className={classes.notchedOutline}
          label={
            label != null && label !== '' && fcs.required ? (
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

(PickersInput as any).muiName = 'OutlinedInput';
