import * as React from 'react';
import { useFormControl } from '@mui/material/FormControl';
import { styled, Theme } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { fakeInputClasses, getFakeInputUtilityClass } from './fakeTextFieldClasses';
import Outline from './Outline';
import { FieldsTextFieldProps } from '../../models';

const SectionInput = styled('input', {
  name: 'MuiFakeInput',
  slot: 'Section',
  overridesResolver: (props, styles) => styles.root,
})(({ value, placeholder, theme }) => {
  let width = 2;
  if (value) {
    width = String(value).length;
  } else if (placeholder) {
    // might be problematic :-?
    width = String(placeholder).length + 1;
  }
  return {
    border: 'none',
    background: 'none',
    outline: 'none',
    margin: 0,
    fontFamily: theme.typography.fontFamily,
    fontSize: 'inherit',
    color: 'inherit',
    width: `${width}ch`,
    letterSpacing: 'inherit',
  };
});

const SectionsWrapper = styled('div', {
  name: 'MuiFakeInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme, ownerState }: { theme: Theme; ownerState: FakeInputProps }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    lineHeight: '1.4375em', // 23px
    padding: '16.5px 14px',
    display: 'flex',
    // gap: theme.spacing(0.1),
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: ownerState.fullWidth ? '100%' : '25ch',
    position: 'relative',
    borderRadius: (theme.vars || theme).shape.borderRadius,
    [`&:hover .${fakeInputClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.text.primary,
    },

    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      [`&:hover .${fakeInputClasses.notchedOutline}`]: {
        borderColor: theme.vars
          ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
          : borderColor,
      },
    },
    [`&.${fakeInputClasses.focused} .${fakeInputClasses.notchedOutline}`]: {
      borderStyle: 'solid',
      borderColor: (theme.vars || theme).palette[ownerState.color].main,
      borderWidth: 2,
    },

    [`&.${fakeInputClasses.disabled}`]: {
      [`& .${fakeInputClasses.notchedOutline}`]: {
        borderColor: (theme.vars || theme).palette.action.disabled,
      },

      '*': {
        color: (theme.vars || theme).palette.action.disabled,
      },
    },

    [`&.${fakeInputClasses.error} .${fakeInputClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.error.main,
    },

    ...(ownerState.size === 'small' && {
      padding: '8.5px 14px',
    }),
  };
});

const NotchedOutlineRoot = styled(Outline, {
  name: 'MuiFakeInput',
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

const useUtilityClasses = (ownerState: FakeInputProps) => {
  const { focused, disabled, error, classes } = ownerState;

  const slots = {
    root: ['root', focused && !disabled && 'focused', disabled && 'disabled', error && 'error'],
    section: ['section'],
    notchedOutline: ['notchedOutline'],
  };

  return composeClasses(slots, getFakeInputUtilityClass, classes);
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

export interface FakeInputElement extends React.HTMLAttributes<HTMLDivElement> {
  before: string;
  after: string;
  value: string;
  // remove these after
  startSeparator: string;
  endSeparator: string;
  type: string;
}

interface FakeInputProps extends FieldsTextFieldProps {
  elements: FakeInputElement[];
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  label?: string;
  margin?: 'dense' | 'none' | 'normal';
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined' | 'standard';
  // TODO: remove once field behavior is implemented
  onFocus: () => void;
  onBlur: () => void;
  onWrapperClick: () => void;
}

const FakeInput = React.forwardRef(function FakeInput(props: any, ref: React.Ref<HTMLDivElement>) {
  const {
    elements,
    defaultValue,
    InputLabelProps,
    label = 'test',
    onFocus,
    onWrapperClick,
    onBlur,
    areAllSectionsEmpty = false,
    ...other
  } = props;

  const muiFormControl = useFormControl();
  const fcs = formControlState({
    props,
    muiFormControl,
    states: [
      'color',
      'disabled',
      'error',
      'focused',
      'hiddenLabel',
      'size',
      'required',
      'fullWidth',
    ],
  });

  const ownerState = {
    ...props,
    color: fcs.color || 'primary',
    disabled: fcs.disabled,
    error: fcs.error,
    focused: fcs.focused,
    fullWidth: fcs.fullWidth,
    hiddenLabel: fcs.hiddenLabel,
    size: fcs.size,
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <SectionsWrapper
      className={classes.root}
      ref={ref}
      onClick={onWrapperClick}
      {...other}
      ownerState={ownerState}
    >
      {elements &&
        elements.map(
          // TODO: rename to before & after, remove type (eg. type month on the input doesn't make a lot of sense, so separating it until we have the final behavior)
          ({ startSeparator, endSeparator, type, ...otherElementProps }, elementIndex) => (
            <React.Fragment key={elementIndex}>
              <span>{startSeparator}</span>
              <SectionInput
                disabled={fcs.disabled}
                {...otherElementProps}
                // onFocus and onBlur to simulate the state classes
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={() => {}}
                {...{ ownerState }}
              />
              <span>{endSeparator}</span>
            </React.Fragment>
          ),
        )}
      <NotchedOutlineRoot
        shrink={fcs.focused || !areAllSectionsEmpty}
        notched={fcs.focused || !areAllSectionsEmpty}
        {...{ ownerState, label }}
        className={classes.notchedOutline}
      />
    </SectionsWrapper>
  );
});

export default FakeInput;
