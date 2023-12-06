import * as React from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import { FormControlState, useFormControl } from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '@mui/utils/capitalize';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { pickersInputClasses, getPickersInputUtilityClass } from './pickersInputClasses';
import { PickersInputProps } from './PickersInput.types';

export const PickersInputRoot = styled(Box, {
  name: 'MuiPickersInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ ownerState }) => ({
  letterSpacing: 'inherit',
  cursor: 'text',
  padding: 0,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'relative',
  ...(ownerState.fullWidth && {
    width: '100%',
    background: 'red',
  }),
}));

export const PickersInputSectionsContainer = styled('div', {
  name: 'MuiPickersInput',
  slot: 'SectionsContainer',
  overridesResolver: (props, styles) => styles.sectionsContainer,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => ({
  padding: '4px 0 5px',
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  lineHeight: '1.4375em', // 23px
  minWidth: '20ch',
  flexGrow: 1,
  outline: 'none',
  ...(ownerState.size === 'small' && {
    paddingTop: 1,
  }),
  ...(!(ownerState.adornedStart || ownerState.focused || ownerState.filled) && {
    color: 'currentColor',
    ...(ownerState.label == null &&
      (theme.vars
        ? {
            opacity: theme.vars.opacity.inputPlaceholder,
          }
        : {
            opacity: theme.palette.mode === 'light' ? 0.42 : 0.5,
          })),
    ...(ownerState.label != null && { opacity: 0 }),
  }),
}));

const PickersInputSection = styled('span', {
  name: 'MuiPickersInput',
  slot: 'Section',
  overridesResolver: (props, styles) => styles.section,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  lineHeight: '1.4375em', // 23px
  flexGrow: 1,
}));

const PickersInputContent = styled('span', {
  name: 'MuiPickersInput',
  slot: 'SectionContent',
  overridesResolver: (props, styles) => styles.content,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  lineHeight: '1.4375em', // 23px
  letterSpacing: 'inherit',
  width: 'fit-content',
}));

const PickersInputSeparator = styled('span', {
  name: 'MuiPickersInput',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})(() => ({
  whiteSpace: 'pre',
}));

const PickersInputInput = styled('input', {
  name: 'MuiPickersInput',
  slot: 'Input',
  overridesResolver: (props, styles) => styles.hiddenInput,
})({
  ...visuallyHidden,
});

const useUtilityClasses = (ownerState: OwnerStateType) => {
  const {
    focused,
    disabled,
    error,
    classes,
    fullWidth,
    readOnly,
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
      readOnly && 'readOnly',
      error && 'error',
      fullWidth && 'fullWidth',
      `color${capitalize(color!)}`,
      size === 'small' && 'inputSizeSmall',
      Boolean(startAdornment) && 'adornedStart',
      Boolean(endAdornment) && 'adornedEnd',
    ],
    notchedOutline: ['notchedOutline'],
    input: ['input'],
    sectionsContainer: ['sectionsContainer'],
    sectionContent: ['sectionContent'],
    sectionBefore: ['sectionBefore'],
    sectionAfter: ['sectionAfter'],
  };

  return composeClasses(slots, getPickersInputUtilityClass, classes);
};

interface OwnerStateType
  extends FormControlState,
    Omit<PickersInputProps, keyof FormControlState> {}

export const PickersInput = React.forwardRef(function PickersInput(
  props: PickersInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    elements,
    areAllSectionsEmpty,
    defaultValue,
    label,
    value,
    onChange,
    id,
    autoFocus,
    endAdornment,
    startAdornment,
    renderSuffix,
    slots,
    contentEditable,
    tabIndex,
    fullWidth,
    inputProps,
    inputRef,
    sectionsContainerRef,
    ...other
  } = props;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const handleRootRef = useForkRef(ref, rootRef);
  const handleInputRef = useForkRef(inputProps?.ref, inputRef);

  const muiFormControl = useFormControl();
  if (!muiFormControl) {
    throw new Error('MUI: PickersInput should always be used inside a PickersTextField component');
  }

  const handleInputFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    // Fix a bug with IE11 where the focus/blur events are triggered
    // while the component is disabled.
    if (muiFormControl.disabled) {
      event.stopPropagation();
      return;
    }

    muiFormControl.onFocus?.(event);
  };

  React.useEffect(() => {
    if (muiFormControl) {
      muiFormControl.setAdornedStart(Boolean(startAdornment));
    }
  }, [muiFormControl, startAdornment]);

  React.useEffect(() => {
    if (!muiFormControl) {
      return;
    }

    if (areAllSectionsEmpty) {
      muiFormControl.onEmpty();
    } else {
      muiFormControl.onFilled();
    }
  }, [muiFormControl, areAllSectionsEmpty]);

  const ownerState: OwnerStateType = {
    ...(props as Omit<PickersInputProps, keyof FormControlState>),
    ...muiFormControl,
  };

  const classes = useUtilityClasses(ownerState);

  const InputRoot = slots?.root || PickersInputRoot;
  const InputSectionsContainer = slots?.input || PickersInputSectionsContainer;

  return (
    <InputRoot
      {...other}
      className={classes.root}
      ownerState={ownerState}
      aria-invalid={muiFormControl.error}
      ref={handleRootRef}
    >
      {startAdornment}
      <InputSectionsContainer
        ownerState={ownerState}
        className={classes.sectionsContainer}
        contentEditable={contentEditable}
        suppressContentEditableWarning
        onFocus={handleInputFocus}
        onBlur={muiFormControl.onBlur}
        tabIndex={tabIndex}
        ref={sectionsContainerRef}
      >
        {contentEditable ? (
          elements
            .map(
              ({ content, before, after }) =>
                `${before.children}${content.children}${after.children}`,
            )
            .join('')
        ) : (
          <React.Fragment>
            {elements.map(({ container, content, before, after }, elementIndex) => (
              <PickersInputSection key={elementIndex} {...container}>
                <PickersInputSeparator
                  {...before}
                  className={clsx(pickersInputClasses.sectionBefore, before?.className)}
                />
                <PickersInputContent
                  {...content}
                  suppressContentEditableWarning
                  className={clsx(pickersInputClasses.sectionContent, content?.className)}
                  {...{ ownerState }}
                />
                <PickersInputSeparator
                  {...after}
                  className={clsx(pickersInputClasses.sectionAfter, after?.className)}
                />
              </PickersInputSection>
            ))}
          </React.Fragment>
        )}
      </InputSectionsContainer>
      {endAdornment}
      {renderSuffix
        ? renderSuffix({
            ...muiFormControl,
          })
        : null}
      <PickersInputInput
        className={classes.input}
        value={value}
        onChange={onChange}
        id={id}
        aria-hidden="true"
        tabIndex={-1}
        {...inputProps}
        ref={handleInputRef}
      />
    </InputRoot>
  );
});

(PickersInput as any).muiName = 'Input';
