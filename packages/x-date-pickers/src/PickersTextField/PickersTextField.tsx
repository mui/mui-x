'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { refType } from '@mui/utils';
import useForkRef from '@mui/utils/useForkRef';
import composeClasses from '@mui/utils/composeClasses';
import useId from '@mui/utils/useId';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { getPickersTextFieldUtilityClass } from './pickersTextFieldClasses';
import { PickersTextFieldProps } from './PickersTextField.types';
import { PickersOutlinedInput } from './PickersOutlinedInput';
import { PickersFilledInput } from './PickersFilledInput';
import { PickersInput } from './PickersInput';

const VARIANT_COMPONENT = {
  standard: PickersInput,
  filled: PickersFilledInput,
  outlined: PickersOutlinedInput,
};

const PickersTextFieldRoot = styled(FormControl, {
  name: 'MuiPickersTextField',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>({});

const useUtilityClasses = (ownerState: PickersTextFieldProps) => {
  const { focused, disabled, classes, required } = ownerState;

  const slots = {
    root: [
      'root',
      focused && !disabled && 'focused',
      disabled && 'disabled',
      required && 'required',
    ],
  };

  return composeClasses(slots, getPickersTextFieldUtilityClass, classes);
};

type OwnerStateType = Partial<PickersTextFieldProps>;

const PickersTextField = React.forwardRef(function PickersTextField(
  inProps: PickersTextFieldProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersTextField',
  });

  const {
    // Props used by FormControl
    onFocus,
    onBlur,
    className,
    color = 'primary',
    disabled = false,
    error = false,
    variant = 'outlined',
    required = false,
    // Props used by PickersInput
    InputProps,
    inputProps,
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
    FormHelperTextProps,
    // Props used by InputLabel
    label,
    InputLabelProps,
    ...other
  } = props;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const handleRootRef = useForkRef(ref, rootRef);

  const id = useId(idProp);
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;

  const ownerState = {
    ...props,
    color,
    disabled,
    error,
    focused,
    required,
    variant,
  };

  const classes = useUtilityClasses(ownerState);

  const PickersInputComponent = VARIANT_COMPONENT[variant];

  return (
    <PickersTextFieldRoot
      className={clsx(classes.root, className)}
      ref={handleRootRef}
      focused={focused}
      disabled={disabled}
      variant={variant}
      error={error}
      color={color}
      fullWidth={fullWidth}
      required={required}
      ownerState={ownerState}
      {...other}
    >
      <InputLabel htmlFor={id} id={inputLabelId} {...InputLabelProps}>
        {label}
      </InputLabel>
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
        inputProps={inputProps}
        inputRef={inputRef}
        sectionListRef={sectionListRef}
        label={label}
        name={name}
        role="group"
        aria-labelledby={inputLabelId}
        {...InputProps}
      />
      {helperText && (
        <FormHelperText id={helperTextId} {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </PickersTextFieldRoot>
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
  endAdornment: PropTypes.node,
  error: PropTypes.bool.isRequired,
  /**
   * If `true`, the component is displayed in focused state.
   */
  focused: PropTypes.bool,
  FormHelperTextProps: PropTypes.object,
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
  id: PropTypes.string,
  InputLabelProps: PropTypes.object,
  inputProps: PropTypes.object,
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/material-ui/api/filled-input/),
   * [`OutlinedInput`](/material-ui/api/outlined-input/) or [`Input`](/material-ui/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps: PropTypes.object,
  inputRef: refType,
  label: PropTypes.node,
  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   * @default 'none'
   */
  margin: PropTypes.oneOf(['dense', 'none', 'normal']),
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
