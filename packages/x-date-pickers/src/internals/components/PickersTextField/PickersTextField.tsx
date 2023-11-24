import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import { unstable_composeClasses as composeClasses, unstable_useId as useId } from '@mui/utils';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { getPickersTextFieldUtilityClass } from './pickersTextFieldClasses';
import PickersInput from './PickersInput';
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
    elements,
    className,
    color = 'primary',
    disabled = false,
    error = false,
    label,
    variant = 'outlined',
    fullWidth = false,
    valueStr,
    helperText,
    valueType,
    id: idOverride,
    FormHelperTextProps,
    InputLabelProps,
    inputProps,
    InputProps,
    required = false,
    focused: focusedProp,
    ownerState: ownerStateProp,
    ...other
  } = props;

  const [focused, setFocused] = React.useState(focusedProp);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const handleRootRef = useForkRef(ref, rootRef);

  const inputRef = React.useRef<HTMLDivElement>(null);
  const handleInputRef = useForkRef(inputRef, InputProps?.ref);

  const id = useId(idOverride);
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;

  const ownerState = {
    ...props,
    color,
    disabled,
    error,
    focused,
    variant,
  };

  const classes = useUtilityClasses(ownerState);

  // TODO: delete after behavior implementation
  const onWrapperClick = () => {
    if (!focused) {
      setFocused(true);
      const container = rootRef.current;

      // Find the first input element within the container
      const firstInput = container?.querySelector<HTMLElement>('.content');

      // Check if the input element exists before focusing it
      if (firstInput) {
        firstInput.focus();
      }

      inputRef.current?.focus();
    }
  };

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
    >
      <InputLabel htmlFor={id} id={inputLabelId} {...InputLabelProps}>
        {label}
      </InputLabel>
      <PickersInput
        {...{ elements, valueStr, valueType, onWrapperClick, inputProps, label }}
        {...other}
        {...InputProps}
        ref={handleInputRef}
      />
      {helperText && (
        <FormHelperText id={helperTextId} {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </PickersTextFieldRoot>
  );
});
