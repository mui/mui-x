import * as React from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import { useFormControl } from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import {
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
  visuallyHidden,
} from '@mui/utils';
import { fakeInputClasses, getFakeInputUtilityClass } from './fakeTextFieldClasses';
import Outline from './Outline';
import { FakeInputElement, FakeInputProps } from './FakeInput.types';

const SectionsWrapper = styled(Box, {
  name: 'MuiFakeInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    cursor: 'text',
    padding: '16.5px 14px',
    display: 'flex',
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

const SectionsContainer = styled('div', {
  name: 'MuiFakeInput',
  slot: 'Input',
  overridesResolver: (props, styles) => styles.input,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  lineHeight: '1.4375em', // 23px
  flexGrow: 1,
  visibility: ownerState.adornedStart || ownerState.focused ? 'visible' : 'hidden',
}));

const SectionContainer = styled('span', {
  name: 'MuiFakeInput',
  slot: 'Section',
  overridesResolver: (props, styles) => styles.section,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  lineHeight: '1.4375em', // 23px
  flexGrow: 1,
}));

const SectionInput = styled('span', {
  name: 'MuiFakeInput',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  lineHeight: '1.4375em', // 23px
  letterSpacing: 'inherit',
  width: 'fit-content',
}));

const FakeHiddenInput = styled('input', {
  name: 'MuiFakeInput',
  slot: 'HiddenInput',
  overridesResolver: (props, styles) => styles.hiddenInput,
})({
  ...visuallyHidden,
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

function InputContent({
  elements,
  contentEditable,
  ownerState,
}: {
  elements: FakeInputElement[];
  contentEditable?: string | boolean;
  ownerState: OwnerStateType;
}) {
  if (contentEditable) {
    return elements
      .map(({ content, before, after }) => `${before.children}${content.children}${after.children}`)
      .join('');
  }

  return (
    <React.Fragment>
      {elements.map(({ container, content, before, after }, elementIndex) => (
        <SectionContainer key={elementIndex} {...container}>
          <span {...before} className={clsx(fakeInputClasses.before, before?.className)} />
          <SectionInput
            {...content}
            className={clsx(fakeInputClasses.content, content?.className)}
            {...{ ownerState }}
          />
          <span {...after} className={clsx(fakeInputClasses.after, after?.className)} />
        </SectionContainer>
      ))}
    </React.Fragment>
  );
}

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

interface OwnerStateType extends FakeInputProps {
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  variant?: 'filled' | 'outlined' | 'standard';
  size?: 'small' | 'medium';
  adornedStart?: boolean;
}

const FakeInput = React.forwardRef(function FakeInput(
  props: FakeInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    elements,
    defaultValue,
    label,
    onFocus,
    onWrapperClick,
    onBlur,
    valueStr,
    onValueStrChange,
    id,
    InputProps,
    inputProps,
    autoFocus,
    ownerState: ownerStateProp,
    endAdornment,
    startAdornment,
    ...other
  } = props;

  const inputRef = React.useRef<HTMLDivElement>(null);
  const handleInputRef = useForkRef(ref, inputRef);

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

  React.useEffect(() => {
    if (muiFormControl) {
      muiFormControl.setAdornedStart(Boolean(startAdornment));
    }
  }, [muiFormControl, startAdornment]);

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
    <SectionsWrapper
      ref={handleInputRef}
      {...other}
      className={classes.root}
      onClick={onWrapperClick}
      ownerState={ownerState}
      aria-invalid={fcs.error}
    >
      {startAdornment}
      <SectionsContainer ownerState={ownerState} className={classes.input}>
        <InputContent
          elements={elements}
          contentEditable={other.contentEditable}
          ownerState={ownerState}
        />
        <FakeHiddenInput
          value={valueStr}
          onChange={onValueStrChange}
          id={id}
          aria-hidden="true"
          tabIndex={-1}
        />
      </SectionsContainer>
      {endAdornment}
      <NotchedOutlineRoot
        shrink={fcs.adornedStart || fcs.focused}
        notched={fcs.adornedStart || fcs.focused}
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
    </SectionsWrapper>
  );
});

export default FakeInput;
