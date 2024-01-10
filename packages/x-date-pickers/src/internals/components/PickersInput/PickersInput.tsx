import * as React from 'react';
import { FormControlState, useFormControl } from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '@mui/utils/capitalize';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { pickersInputClasses, getPickersInputUtilityClass } from './pickersInputClasses';
import { PickersInputProps } from './PickersInput.types';
import {
  Unstable_PickersSectionList as PickersSectionList,
  Unstable_PickersSectionListRoot as PickersSectionListRoot,
  Unstable_PickersSectionListSection as PickersSectionListSection,
  Unstable_PickersSectionListSectionSeparator as PickersSectionListSectionSeparator,
  Unstable_PickersSectionListSectionContent as PickersSectionListSectionContent,
} from '../../../PickersSectionList';

const round = (value) => Math.round(value * 1e5) / 1e5;

export const PickersInputRoot = styled('div', {
  name: 'MuiPickersInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => ({
  ...theme.typography.body1,
  color: (theme.vars || theme).palette.text.primary,
  cursor: 'text',
  padding: 0,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'relative',
  boxSizing: 'border-box', // Prevent padding issue with fullWidth.
  letterSpacing: `${round(0.15 / 16)}em`,
  ...(ownerState.fullWidth && {
    width: '100%',
  }),
}));

export const PickersInputSectionsContainer = styled(PickersSectionListRoot, {
  name: 'MuiPickersInput',
  slot: 'SectionsContainer',
  overridesResolver: (props, styles) => styles.sectionsContainer,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => ({
  padding: '4px 0 5px',
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  lineHeight: '1.4375em', // 23px
  flexGrow: 1,
  outline: 'none',
  display: 'flex',
  flexWrap: 'nowrap',
  overflow: 'hidden',
  letterSpacing: 'inherit',
  // Baseline behavior
  width: '182px',

  ...(ownerState.size === 'small' && {
    paddingTop: 1,
  }),
  ...(theme.direction === 'rtl' && { textAlign: 'right /*! @noflip */' as any }),
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

const PickersInputSection = styled(PickersSectionListSection, {
  name: 'MuiPickersInput',
  slot: 'Section',
  overridesResolver: (props, styles) => styles.section,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  letterSpacing: 'inherit',
  lineHeight: '1.4375em', // 23px
  display: 'flex',
}));

const PickersInputSectionContent = styled(PickersSectionListSectionContent, {
  name: 'MuiPickersInput',
  slot: 'SectionContent',
  overridesResolver: (props, styles) => styles.content,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  lineHeight: '1.4375em', // 23px
  letterSpacing: 'inherit',
  width: 'fit-content',
  outline: 'none',
}));

const PickersInputSeparator = styled(PickersSectionListSectionSeparator, {
  name: 'MuiPickersInput',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})(() => ({
  whiteSpace: 'pre',
  letterSpacing: 'inherit',
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
    onInput,
    onPaste,
    onKeyDown,
    fullWidth,
    inputProps,
    inputRef,
    sectionListRef,
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
      <PickersSectionList
        sectionListRef={sectionListRef}
        elements={elements}
        contentEditable={contentEditable}
        tabIndex={tabIndex}
        className={classes.sectionsContainer}
        onFocus={handleInputFocus}
        onBlur={muiFormControl.onBlur}
        onInput={onInput}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        slots={{
          root: InputSectionsContainer,
          section: PickersInputSection,
          sectionContent: PickersInputSectionContent,
          sectionSeparator: PickersInputSeparator,
        }}
        slotProps={{
          root: {
            ownerState,
          } as any,
          sectionContent: { className: pickersInputClasses.sectionContent },
          sectionSeparator: ({ position }) => ({
            className:
              position === 'before'
                ? pickersInputClasses.sectionBefore
                : pickersInputClasses.sectionAfter,
          }),
        }}
      />
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
