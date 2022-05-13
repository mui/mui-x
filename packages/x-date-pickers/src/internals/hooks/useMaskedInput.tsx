import * as React from 'react';
import { useRifm } from 'rifm';
import { useUtils } from './useUtils';
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
  acceptInconsistentFormat,
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
  // TODO: allows to control this value
  const [innerDisplayedInputValue, setInnerDisplayedInputValue] = React.useState(currentInputValue);

  const isAcceptedValue = rawValue === null || utils.isValid(rawValue)
  if (isAcceptedValue && currentInputValue !== innerInputValue) {
    setInnerInputValue(currentInputValue);
    setInnerDisplayedInputValue(currentInputValue);
  }

  const handleChange = (text: string) => {
    const finalString = text === '' || text === mask ? '' : text;
    setInnerDisplayedInputValue(finalString);

    const date = finalString === null ? null : utils.parse(finalString, inputFormat);
    if (ignoreInvalidInputs && !utils.isValid(date)) {
      return;
    }
    if (
      !acceptInconsistentFormat &&
      date !== null &&
      getDisplayDate(utils, date, inputFormat) !== finalString
    ) {
      // Update the input value only if the value changed outside of typing
      // Because library formatters can change inputs from 12/12/2 to 12/12/0002
      return;
    }
    onChange(date, finalString || undefined);
  };

  const rifmProps = useRifm({
    value: innerDisplayedInputValue,
    onChange: handleChange,
    format: rifmFormatter || formatter,
  });

  const inputStateArgs = shouldUseMaskedInput
    ? rifmProps
    : {
      value: innerDisplayedInputValue,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(event.currentTarget.value);
      },
    };

  return {
    label,
    disabled,
    error: validationError || innerInputValue !== innerDisplayedInputValue,
    inputProps: {
      ...inputStateArgs,
      disabled,
      placeholder: formatHelperText,
      readOnly,
      type: shouldUseMaskedInput ? 'tel' : 'text',
      ...inputProps,
    },
    ...TextFieldProps,
  };
};
