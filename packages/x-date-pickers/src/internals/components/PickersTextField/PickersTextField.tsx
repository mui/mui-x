import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import { unstable_composeClasses as composeClasses, unstable_useId as useId } from '@mui/utils';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { getPickersTextFieldUtilityClass } from './pickersTextFieldClasses';
import { PickersInput } from './PickersInput';
import { PickersTextFieldProps } from './PickersTextField.types';

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

export const PickersTextField = React.forwardRef(function PickersTextField(
  props: PickersTextFieldProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    // Props used by FormControl
    onFocus,
    onBlur,
    className,
    color = 'primary',
    disabled = false,
    error = false,
    required = false,
    variant = 'outlined',

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

  return (
    <PickersTextFieldRoot
      className={clsx(classes.root, className)}
      ref={handleRootRef}
      focused={focused}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      variant={variant}
      error={error}
      color={color}
      required={required}
      ownerState={ownerState}
      fullWidth={fullWidth}
      {...other}
    >
      <InputLabel htmlFor={id} id={inputLabelId} {...InputLabelProps}>
        {label}
      </InputLabel>
      <PickersInput
        elements={elements}
        areAllSectionsEmpty={areAllSectionsEmpty}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onInput={onInput}
        onPaste={onPaste}
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
