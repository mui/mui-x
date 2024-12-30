import * as React from 'react';
import PropTypes from 'prop-types';
import { useFormControl } from '@mui/material/FormControl';
import { styled, useThemeProps } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import { refType } from '@mui/utils';
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '@mui/utils/capitalize';
import useSlotProps from '@mui/utils/useSlotProps';
import visuallyHidden from '@mui/utils/visuallyHidden';
import {
  pickersInputBaseClasses,
  getPickersInputBaseUtilityClass,
  PickersInputBaseClasses,
} from './pickersInputBaseClasses';
import { PickersInputBaseProps } from './PickersInputBase.types';
import {
  Unstable_PickersSectionList as PickersSectionList,
  Unstable_PickersSectionListRoot as PickersSectionListRoot,
  Unstable_PickersSectionListSection as PickersSectionListSection,
  Unstable_PickersSectionListSectionSeparator as PickersSectionListSectionSeparator,
  Unstable_PickersSectionListSectionContent as PickersSectionListSectionContent,
} from '../../PickersSectionList';
import { usePickerTextFieldOwnerState } from '../usePickerTextFieldOwnerState';
import { PickerTextFieldOwnerState } from '../PickersTextField.types';

const round = (value: number) => Math.round(value * 1e5) / 1e5;

export const PickersInputBaseRoot = styled('div', {
  name: 'MuiPickersInputBase',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: PickerTextFieldOwnerState }>(({ theme }) => ({
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
  variants: [
    {
      props: { isInputInFullWidth: true },
      style: { width: '100%' },
    },
  ],
}));

export const PickersInputBaseSectionsContainer = styled(PickersSectionListRoot, {
  name: 'MuiPickersInputBase',
  slot: 'SectionsContainer',
  overridesResolver: (props, styles) => styles.sectionsContainer,
})<{ ownerState: PickerTextFieldOwnerState }>(({ theme }) => ({
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
  variants: [
    {
      props: { fieldDirection: 'rtl' },
      style: {
        textAlign: 'right /*! @noflip */' as any,
      },
    },
    {
      props: { inputSize: 'small' },
      style: {
        paddingTop: 1,
      },
    },
    {
      props: { hasStartAdornment: false, isFieldFocused: false, isFieldValueEmpty: true },
      style: {
        color: 'currentColor',
        opacity: 0,
      },
    },
    {
      props: {
        hasStartAdornment: false,
        isFieldFocused: false,
        isFieldValueEmpty: true,
        inputHasLabel: false,
      },
      style: theme.vars
        ? {
            opacity: theme.vars.opacity.inputPlaceholder,
          }
        : {
            opacity: theme.palette.mode === 'light' ? 0.42 : 0.5,
          },
    },
  ],
}));

const PickersInputBaseSection = styled(PickersSectionListSection, {
  name: 'MuiPickersInputBase',
  slot: 'Section',
  overridesResolver: (props, styles) => styles.section,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  letterSpacing: 'inherit',
  lineHeight: '1.4375em', // 23px
  display: 'flex',
}));

const PickersInputBaseSectionContent = styled(PickersSectionListSectionContent, {
  name: 'MuiPickersInputBase',
  slot: 'SectionContent',
  overridesResolver: (props, styles) => styles.content,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  lineHeight: '1.4375em', // 23px
  letterSpacing: 'inherit',
  width: 'fit-content',
  outline: 'none',
}));

const PickersInputBaseSectionSeparator = styled(PickersSectionListSectionSeparator, {
  name: 'MuiPickersInputBase',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})(() => ({
  whiteSpace: 'pre',
  letterSpacing: 'inherit',
}));

const PickersInputBaseInput = styled('input', {
  name: 'MuiPickersInputBase',
  slot: 'Input',
  overridesResolver: (props, styles) => styles.hiddenInput,
})({
  ...visuallyHidden,
});

const useUtilityClasses = (
  classes: Partial<PickersInputBaseClasses> | undefined,
  ownerState: PickerTextFieldOwnerState,
) => {
  const {
    isFieldFocused,
    isFieldDisabled,
    isFieldReadOnly,
    hasFieldError,
    inputSize,
    isInputInFullWidth,
    inputColor,
    hasStartAdornment,
    hasEndAdornment,
  } = ownerState;

  const slots = {
    root: [
      'root',
      isFieldFocused && !isFieldDisabled && 'focused',
      isFieldDisabled && 'disabled',
      isFieldReadOnly && 'readOnly',
      hasFieldError && 'error',
      isInputInFullWidth && 'fullWidth',
      `color${capitalize(inputColor!)}`,
      inputSize === 'small' && 'inputSizeSmall',
      hasStartAdornment && 'adornedStart',
      hasEndAdornment && 'adornedEnd',
    ],
    notchedOutline: ['notchedOutline'],
    input: ['input'],
    sectionsContainer: ['sectionsContainer'],
    sectionContent: ['sectionContent'],
    sectionBefore: ['sectionBefore'],
    sectionAfter: ['sectionAfter'],
  };

  return composeClasses(slots, getPickersInputBaseUtilityClass, classes);
};

/**
 * @ignore - internal component.
 */
const PickersInputBase = React.forwardRef(function PickersInputBase(
  inProps: PickersInputBaseProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersInputBase',
  });

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
    slotProps,
    contentEditable,
    tabIndex,
    onInput,
    onPaste,
    onKeyDown,
    fullWidth,
    name,
    readOnly,
    inputProps,
    inputRef,
    sectionListRef,
    onFocus,
    onBlur,
    classes: classesProp,
    ownerState: ownerStateProp,
    ...other
  } = props;

  const ownerStateContext = usePickerTextFieldOwnerState();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const handleRootRef = useForkRef(ref, rootRef);
  const handleInputRef = useForkRef(inputProps?.ref, inputRef);
  const muiFormControl = useFormControl();
  if (!muiFormControl) {
    throw new Error(
      'MUI X: PickersInputBase should always be used inside a PickersTextField component',
    );
  }

  const ownerState = ownerStateProp ?? ownerStateContext;

  const handleInputFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    muiFormControl.onFocus?.(event);
    onFocus?.(event);
  };

  const handleHiddenInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    handleInputFocus(event);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    muiFormControl.onBlur?.(event);
    onBlur?.(event);
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

  const classes = useUtilityClasses(classesProp, ownerState);

  const InputRoot = slots?.root || PickersInputBaseRoot;
  const inputRootProps = useSlotProps({
    elementType: InputRoot,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    additionalProps: {
      'aria-invalid': muiFormControl.error,
      ref: handleRootRef,
    },
    className: classes.root,
    ownerState,
  });

  const InputSectionsContainer = slots?.input || PickersInputBaseSectionsContainer;

  return (
    <InputRoot {...inputRootProps}>
      {startAdornment}
      <PickersSectionList
        sectionListRef={sectionListRef}
        elements={elements}
        contentEditable={contentEditable}
        tabIndex={tabIndex}
        className={classes.sectionsContainer}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onInput={onInput}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        slots={{
          root: InputSectionsContainer,
          section: PickersInputBaseSection,
          sectionContent: PickersInputBaseSectionContent,
          sectionSeparator: PickersInputBaseSectionSeparator,
        }}
        slotProps={{
          root: {
            ...slotProps?.input,
            ownerState,
          } as any,
          sectionContent: { className: pickersInputBaseClasses.sectionContent },
          sectionSeparator: ({ separatorPosition }) => ({
            className:
              separatorPosition === 'before'
                ? pickersInputBaseClasses.sectionBefore
                : pickersInputBaseClasses.sectionAfter,
          }),
        }}
      />
      {endAdornment}
      {renderSuffix
        ? renderSuffix({
            ...muiFormControl,
          })
        : null}
      <PickersInputBaseInput
        name={name}
        className={classes.input}
        value={value}
        onChange={onChange}
        id={id}
        aria-hidden="true"
        tabIndex={-1}
        readOnly={readOnly}
        required={muiFormControl.required}
        disabled={muiFormControl.disabled}
        // Hidden input element cannot be focused, trigger the root focus instead
        // This allows to maintain the ability to do `inputRef.current.focus()` to focus the field
        onFocus={handleHiddenInputFocus}
        {...inputProps}
        ref={handleInputRef}
      />
    </InputRoot>
  );
});

PickersInputBase.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Is `true` if the current values equals the empty value.
   * For a single item value, it means that `value === null`
   * For a range value, it means that `value === [null, null]`
   */
  areAllSectionsEmpty: PropTypes.bool.isRequired,
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If true, the whole element is editable.
   * Useful when all the sections are selected.
   */
  contentEditable: PropTypes.bool.isRequired,
  /**
   * The elements to render.
   * Each element contains the prop to edit a section of the value.
   */
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      after: PropTypes.object.isRequired,
      before: PropTypes.object.isRequired,
      container: PropTypes.object.isRequired,
      content: PropTypes.object.isRequired,
    }),
  ).isRequired,
  endAdornment: PropTypes.node,
  fullWidth: PropTypes.bool,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  inputRef: refType,
  label: PropTypes.node,
  margin: PropTypes.oneOf(['dense', 'none', 'normal']),
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onPaste: PropTypes.func.isRequired,
  ownerState: PropTypes.any,
  readOnly: PropTypes.bool,
  renderSuffix: PropTypes.func,
  sectionListRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        getRoot: PropTypes.func.isRequired,
        getSectionContainer: PropTypes.func.isRequired,
        getSectionContent: PropTypes.func.isRequired,
        getSectionIndexFromDOMElement: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * The components used for each slot inside.
   *
   * @default {}
   */
  slots: PropTypes.object,
  startAdornment: PropTypes.node,
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  value: PropTypes.string.isRequired,
} as any;

export { PickersInputBase };
