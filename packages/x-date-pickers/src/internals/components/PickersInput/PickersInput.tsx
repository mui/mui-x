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
import { pickersInputClasses, getPickersInputUtilityClass } from './pickersInputClasses';
import { PickersInputElement, PickersInputProps } from './PickersInput.types';

export const InputWrapper = styled(Box, {
  name: 'MuiPickersInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.input,
})<{ ownerState: OwnerStateType }>(({ ownerState }) => ({
  cursor: 'text',
  padding: 0,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: ownerState.fullWidth ? '100%' : '25ch',
}));

export const SectionsContainer = styled('div', {
  name: 'MuiPickersInput',
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
  name: 'MuiPickersInput',
  slot: 'Section',
  overridesResolver: (props, styles) => styles.section,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  lineHeight: '1.4375em', // 23px
  flexGrow: 1,
}));

const SectionInput = styled('span', {
  name: 'MuiPickersInput',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  lineHeight: '1.4375em', // 23px
  letterSpacing: 'inherit',
  width: 'fit-content',
}));

const SectionSeparator = styled('span', {
  name: 'MuiPickersInput',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})(() => ({
  whiteSpace: 'pre',
}));

const FakeHiddenInput = styled('input', {
  name: 'MuiPickersInput',
  slot: 'HiddenInput',
  overridesResolver: (props, styles) => styles.hiddenInput,
})({
  ...visuallyHidden,
});

function InputContent({
  elements,
  contentEditable,
  ownerState,
}: {
  elements: PickersInputElement[];
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
          <SectionSeparator
            {...before}
            className={clsx(pickersInputClasses.before, before?.className)}
          />
          <SectionInput
            {...content}
            className={clsx(pickersInputClasses.content, content?.className)}
            {...{ ownerState }}
          />
          <SectionSeparator
            {...after}
            className={clsx(pickersInputClasses.after, after?.className)}
          />
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

  return composeClasses(slots, getPickersInputUtilityClass, classes);
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
  variant?: 'filled' | 'outlined' | 'standard';
  size?: 'small' | 'medium';
  adornedStart?: boolean;
}

export const PickersInput = React.forwardRef(function PickersInput(
  props: PickersInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    elements,
    defaultValue,
    label,
    onFocus,
    onWrapperClick,
    onBlur,
    value,
    onChange,
    id,
    autoFocus,
    ownerState: ownerStateProp,
    endAdornment,
    startAdornment,
    renderSuffix,
    slots,
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

  const PickersInputRoot = slots?.root || InputWrapper;
  const PickersInputInput = slots?.input || SectionsContainer;

  return (
    // this needs to change based on the variant
    <PickersInputRoot
      ref={handleInputRef}
      {...other}
      className={classes.root}
      onClick={onWrapperClick}
      ownerState={ownerState}
      aria-invalid={fcs.error}
    >
      {startAdornment}
      <PickersInputInput ownerState={ownerState} className={classes.input}>
        <InputContent
          elements={elements}
          contentEditable={other.contentEditable}
          ownerState={ownerState}
        />
        <FakeHiddenInput
          value={value}
          onChange={onChange}
          id={id}
          aria-hidden="true"
          tabIndex={-1}
        />
      </PickersInputInput>
      {endAdornment}
      {/* render conditionally depending on variant -> consider renderSuffix or children */}
      {renderSuffix
        ? renderSuffix({
            ...fcs,
            startAdornment,
          })
        : null}
    </PickersInputRoot>
  );
});

(PickersInput as any).muiName = 'Input';
