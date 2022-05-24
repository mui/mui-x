import * as React from 'react';
import { useRifm } from 'rifm';
import { useUtils } from './useUtils';
import { createDelegatedEventHandler } from '../utils/utils';
import { DateInputProps, MuiTextFieldProps } from '../components/PureDateInput';
import {
  maskedDateFormatter,
  getDisplayDate,
  checkMaskIsValidForCurrentFormat,
} from '../utils/text-field-helper';

type MaskedInputProps<TInputDate, TDate> = Omit<
  DateInputProps<TInputDate, TDate>,
  | 'adornmentPosition'
  | 'disableOpenPicker'
  | 'getOpenDialogAriaText'
  | 'InputAdornmentProps'
  | 'InputProps'
  | 'open'
  | 'openPicker'
  | 'OpenPickerButtonProps'
  | 'renderInput'
> & { inputProps?: Partial<React.HTMLProps<HTMLInputElement>> };

export const useMaskedInput = <TInputDate, TDate>({
  acceptRegex = /[\d]/gi,
  disabled,
  disableMaskedInput,
  ignoreInvalidInputs,
  inputFormat,
  inputProps,
  label,
  mask,
  onChange,
  rawValue,
  readOnly,
  rifmFormatter,
  TextFieldProps,
  validationError,
}: MaskedInputProps<TInputDate, TDate>): MuiTextFieldProps => {
  const utils = useUtils<TDate>();
  const [isFocused, setIsFocused] = React.useState(false);

  const formatHelperText = utils.getFormatHelperText(inputFormat);

  const shouldUseMaskedInput = React.useMemo(() => {
    // formatting of dates is a quite slow thing, so do not make useless .format calls
    if (!mask || disableMaskedInput) {
      return false;
    }

    return checkMaskIsValidForCurrentFormat(mask, inputFormat, acceptRegex, utils);
  }, [acceptRegex, disableMaskedInput, inputFormat, mask, utils]);

  const formatter = React.useMemo(
    () =>
      shouldUseMaskedInput && mask ? maskedDateFormatter(mask, acceptRegex) : (st: string) => st,
    [acceptRegex, mask, shouldUseMaskedInput],
  );

  // TODO: Implement with controlled vs uncontrolled `rawValue`
  const currentInputValue = getDisplayDate(utils, rawValue, inputFormat);
  const [innerInputValue, setInnerInputValue] = React.useState(currentInputValue);
  const previousInputValueRef = React.useRef(currentInputValue);
  React.useEffect(() => {
    previousInputValueRef.current = currentInputValue;
  }, [currentInputValue]);
  const notTyping = !isFocused;
  const valueChanged = previousInputValueRef.current !== currentInputValue;
  // Update the input value only if the value changed outside of typing
  if (notTyping && valueChanged && (rawValue === null || utils.isValid(rawValue))) {
    if (currentInputValue !== innerInputValue) {
      setInnerInputValue(currentInputValue);
    }
  }

  const handleChange = (text: string) => {
    const finalString = text === '' || text === mask ? '' : text;
    setInnerInputValue(finalString);

    const date = finalString === null ? null : utils.parse(finalString, inputFormat);

    if (ignoreInvalidInputs && !utils.isValid(date)) {
      return;
    }

    onChange(date, finalString || undefined);
  };

  const rifmProps = useRifm({
    value: innerInputValue,
    onChange: handleChange,
    format: rifmFormatter || formatter,
  });

  const inputStateArgs = shouldUseMaskedInput
    ? rifmProps
    : {
        value: innerInputValue,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(event.currentTarget.value);
        },
      };

  return {
    label,
    disabled,
    error: validationError,
    inputProps: {
      ...inputStateArgs,
      disabled,
      placeholder: formatHelperText,
      readOnly,
      type: shouldUseMaskedInput ? 'tel' : 'text',
      ...inputProps,
      onFocus: createDelegatedEventHandler(() => {
        setIsFocused(true);
      }, inputProps?.onFocus),
      onBlur: createDelegatedEventHandler(() => {
        setIsFocused(false);
      }, inputProps?.onBlur),
    },
    ...TextFieldProps,
  };
};
