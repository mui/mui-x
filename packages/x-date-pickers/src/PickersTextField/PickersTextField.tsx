'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { warnOnce } from '@mui/x-internals/warning';
import { styled, useThemeProps } from '@mui/material/styles';
import refType from '@mui/utils/refType';
import useForkRef from '@mui/utils/useForkRef';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import useId from '@mui/utils/useId';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import {
  getPickersTextFieldUtilityClass,
  PickersTextFieldClasses,
} from './pickersTextFieldClasses';
import { PickersTextFieldProps } from './PickersTextField.types';
import { PickersOutlinedInput } from './PickersOutlinedInput';
import { PickersFilledInput } from './PickersFilledInput';
import { PickersInput } from './PickersInput';
import { useFieldOwnerState } from '../internals/hooks/useFieldOwnerState';
import { PickerTextFieldOwnerStateContext } from './usePickerTextFieldOwnerState';
import { PickerTextFieldOwnerState } from '../models/fields';

const VARIANT_COMPONENT = {
  standard: PickersInput,
  filled: PickersFilledInput,
  outlined: PickersOutlinedInput,
};

const PickersTextFieldRoot = styled(FormControl, {
  name: 'MuiPickersTextField',
  slot: 'Root',
})<{ ownerState: PickerTextFieldOwnerState }>({
  maxWidth: '100%',
});

const useUtilityClasses = (
  classes: Partial<PickersTextFieldClasses> | undefined,
  ownerState: PickerTextFieldOwnerState,
) => {
  const { isFieldFocused, isFieldDisabled, isFieldRequired } = ownerState;

  const slots = {
    root: [
      'root',
      isFieldFocused && !isFieldDisabled && 'focused',
      isFieldDisabled && 'disabled',
      isFieldRequired && 'required',
    ],
  };

  return composeClasses(slots, getPickersTextFieldUtilityClass, classes);
};

const PickersTextField = React.forwardRef(function PickersTextField(
  inProps: PickersTextFieldProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersTextField',
  });

  // TODO v10: remove
  if (process.env.NODE_ENV !== 'production') {
    const legacyProps = inProps as {
      InputProps?: unknown;
      inputProps?: unknown;
      InputLabelProps?: unknown;
      FormHelperTextProps?: unknown;
    };
    if (
      legacyProps.InputProps ||
      legacyProps.inputProps ||
      legacyProps.InputLabelProps ||
      legacyProps.FormHelperTextProps
    ) {
      warnOnce([
        'MUI X: `PickersTextField` no longer supports the `InputProps`, `inputProps`, `InputLabelProps` and `FormHelperTextProps` props.',
        'They are silently dropped, which can hide configuration bugs in JavaScript codebases that do not benefit from TypeScript checks.',
        'Use `slotProps.input`, `slotProps.htmlInput`, `slotProps.inputLabel` and `slotProps.formHelperText` instead.',
        'You can run the `migrate-text-field-props` codemod to migrate automatically.',
      ]);
    }
  }

  const {
    // Props used by FormControl
    onFocus,
    onBlur,
    className,
    classes: classesProp,
    color = 'primary',
    disabled = false,
    error = false,
    variant = 'outlined',
    required = false,
    hiddenLabel = false,
    // Props used by PickersInput
    inputRef,
    sectionListRef,
    elements,
    areAllSectionsEmpty,
    onClick,
    onKeyDown,
    onKeyUp,
    onPaste,
    onInput,
    endAdornment,
    startAdornment,
    tabIndex,
    contentEditable,
    focused,
    value,
    onChange,
    fullWidth,
    id: idProp,
    name,
    // Props used by FormHelperText
    helperText,
    // Props used by InputLabel
    label,
    // Slot system
    slots,
    slotProps,
    // @ts-ignore
    'data-active-range-position': dataActiveRangePosition,
    ...other
  } = props;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const handleRootRef = useForkRef(ref, rootRef);

  const id = useId(idProp);
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;

  const inputSlotProps = slotProps?.input;
  const inputLabelSlotProps = slotProps?.inputLabel;

  const fieldOwnerState = useFieldOwnerState({
    disabled: props.disabled,
    required: props.required,
    readOnly: inputSlotProps?.readOnly,
  });
  const ownerState = React.useMemo<PickerTextFieldOwnerState>(
    () => ({
      ...fieldOwnerState,
      isFieldValueEmpty: areAllSectionsEmpty,
      isFieldFocused: focused ?? false,
      hasFieldError: error ?? false,
      inputSize: props.size ?? 'medium',
      inputColor: color ?? 'primary',
      isInputInFullWidth: fullWidth ?? false,
      hasStartAdornment: Boolean(startAdornment ?? inputSlotProps?.startAdornment),
      hasEndAdornment: Boolean(endAdornment ?? inputSlotProps?.endAdornment),
      inputHasLabel: !!label,
      isLabelShrunk: Boolean(inputLabelSlotProps?.shrink),
    }),
    [
      fieldOwnerState,
      areAllSectionsEmpty,
      focused,
      error,
      props.size,
      color,
      fullWidth,
      startAdornment,
      endAdornment,
      inputSlotProps?.startAdornment,
      inputSlotProps?.endAdornment,
      label,
      inputLabelSlotProps?.shrink,
    ],
  );
  const classes = useUtilityClasses(classesProp, ownerState);

  const PickersInputComponent = slots?.input ?? VARIANT_COMPONENT[variant];
  const RootComponent = slots?.root ?? PickersTextFieldRoot;
  const InputLabelComponent = slots?.inputLabel ?? InputLabel;
  const FormHelperTextComponent = slots?.formHelperText ?? FormHelperText;

  const inputAdditionalProps: Record<string, any> = {};
  if (variant === 'outlined') {
    if (inputLabelSlotProps && typeof inputLabelSlotProps.shrink !== 'undefined') {
      inputAdditionalProps.notched = inputLabelSlotProps.shrink;
    }
    inputAdditionalProps.label = label;
  } else if (variant === 'filled') {
    inputAdditionalProps.hiddenLabel = hiddenLabel;
  }

  const rootSlotProps = useSlotProps({
    elementType: RootComponent,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: { ...other, className },
    additionalProps: {
      ref: handleRootRef,
      focused,
      disabled,
      variant,
      error,
      color,
      fullWidth,
      required,
    },
    className: classes.root,
    ownerState,
  });

  return (
    <PickerTextFieldOwnerStateContext.Provider value={ownerState}>
      <RootComponent {...rootSlotProps}>
        {label != null && label !== '' && (
          <InputLabelComponent htmlFor={id} id={inputLabelId} {...inputLabelSlotProps}>
            {label}
          </InputLabelComponent>
        )}
        <PickersInputComponent
          elements={elements}
          areAllSectionsEmpty={areAllSectionsEmpty}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onInput={onInput}
          onPaste={onPaste}
          onFocus={onFocus}
          onBlur={onBlur}
          endAdornment={endAdornment}
          startAdornment={startAdornment}
          tabIndex={tabIndex}
          contentEditable={contentEditable}
          value={value}
          onChange={onChange}
          id={id}
          fullWidth={fullWidth}
          inputRef={inputRef}
          sectionListRef={sectionListRef}
          label={label}
          name={name}
          role="group"
          aria-labelledby={inputLabelId}
          aria-describedby={helperTextId}
          aria-live={helperTextId ? 'polite' : undefined}
          data-active-range-position={dataActiveRangePosition}
          {...inputAdditionalProps}
          {...inputSlotProps}
          slots={{
            ...inputSlotProps?.slots,
            ...(slots?.htmlInput !== undefined && { htmlInput: slots.htmlInput }),
          }}
          slotProps={{
            ...inputSlotProps?.slotProps,
            ...(slotProps?.htmlInput !== undefined && { htmlInput: slotProps.htmlInput }),
          }}
        />
        {helperText && (
          <FormHelperTextComponent id={helperTextId} {...slotProps?.formHelperText}>
            {helperText}
          </FormHelperTextComponent>
        )}
      </RootComponent>
    </PickerTextFieldOwnerStateContext.Provider>
  );
});

PickersTextField.propTypes = {
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
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * @default 'primary'
   */
  color: PropTypes.oneOf(['error', 'info', 'primary', 'secondary', 'success', 'warning']),
  component: PropTypes.elementType,
  /**
   * If true, the whole element is editable.
   * Useful when all the sections are selected.
   */
  contentEditable: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
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
  /**
   * End `InputAdornment` for this component.
   */
  endAdornment: PropTypes.node,
  /**
   * If `true`, the `input` will indicate an error.
   * @default false
   */
  error: PropTypes.bool.isRequired,
  /**
   * If `true`, the component is displayed in focused state.
   */
  focused: PropTypes.bool,
  /**
   * If `true`, the input will take up the full width of its container.
   * @default false
   */
  fullWidth: PropTypes.bool,
  /**
   * The helper text content.
   */
  helperText: PropTypes.node,
  /**
   * If `true`, the label is hidden.
   * This is used to increase density for a `FilledInput`.
   * Be sure to add `aria-label` to the `input` element.
   * @default false
   */
  hiddenLabel: PropTypes.bool,
  /**
   * The id of the `input` element.
   */
  id: PropTypes.string,
  /**
   * Pass a ref to the `input` element.
   */
  inputRef: refType,
  /**
   * The label content.
   */
  label: PropTypes.node,
  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   * @default 'none'
   */
  margin: PropTypes.oneOf(['dense', 'none', 'normal']),
  /**
   * Name attribute of the `input` element.
   */
  name: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onPaste: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  /**
   * If `true`, the label will indicate that the `input` is required.
   * @default false
   */
  required: PropTypes.bool,
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
   * The size of the component.
   * @default 'medium'
   */
  size: PropTypes.oneOf(['medium', 'small']),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * Start `InputAdornment` for this component.
   */
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
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant: PropTypes.oneOf(['filled', 'outlined', 'standard']),
} as any;

export { PickersTextField };
