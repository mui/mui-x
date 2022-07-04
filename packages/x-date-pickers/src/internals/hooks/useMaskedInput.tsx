import * as React from 'react';
import { useRifm } from 'rifm';
import { useUtils } from './useUtils';
import { DateInputProps, MuiTextFieldProps } from '../components/PureDateInput';
import {
  maskedDateFormatter,
  getDisplayDate,
  checkMaskIsValidForCurrentFormat,
  getMaskFromCurrentFormat,
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

  const formatHelperText = utils.getFormatHelperText(inputFormat);

  const { shouldUseMaskedInput, maskToUse } = React.useMemo(() => {
    // formatting of dates is a quite slow thing, so do not make useless .format calls
    if (disableMaskedInput) {
      return { shouldUseMaskedInput: false, maskToUse: '' };
    }
    const computedMaskToUse = getMaskFromCurrentFormat(mask, inputFormat, acceptRegex, utils);

    return {
      shouldUseMaskedInput: checkMaskIsValidForCurrentFormat(
        computedMaskToUse,
        inputFormat,
        acceptRegex,
        utils,
      ),
      maskToUse: computedMaskToUse,
    };
  }, [acceptRegex, disableMaskedInput, inputFormat, mask, utils]);

  const formatter = React.useMemo(
    () =>
      shouldUseMaskedInput && maskToUse
        ? maskedDateFormatter(maskToUse, acceptRegex)
        : (st: string) => st,
    [acceptRegex, maskToUse, shouldUseMaskedInput],
  );

  // TODO: Implement with controlled vs uncontrolled `rawValue`
  const parsedValue = rawValue === null ? null : utils.date(rawValue);

  // Track the value of the input
  const [innerInputValue, setInnerInputValue] = React.useState<TDate | null>(parsedValue);
  // control the input text
  const [innerDisplayedInputValue, setInnerDisplayedInputValue] = React.useState<string>(
    getDisplayDate(utils, rawValue, inputFormat),
  );

  // Inspired from autocomplete: https://github.com/mui/material-ui/blob/2c89d036dc2e16f100528f161600dffc83241768/packages/mui-base/src/AutocompleteUnstyled/useAutocomplete.js#L185:L201
  const prevRawValue = React.useRef<TInputDate>();

  React.useEffect(() => {
    const rawValueChange = rawValue !== prevRawValue.current;
    prevRawValue.current = rawValue;

    if (!rawValueChange) {
      return;
    }

    const newParsedValue = rawValue === null ? null : utils.date(rawValue);
    const isAcceptedValue = rawValue === null || utils.isValid(newParsedValue);

    if (!isAcceptedValue || utils.isEqual(innerInputValue, newParsedValue)) {
      return;
    }

    // When dev set a new valid value, we trust them
    const newDisplayDate = getDisplayDate(utils, rawValue, inputFormat);

    setInnerInputValue(newParsedValue);
    setInnerDisplayedInputValue(newDisplayDate);
  }, [utils, rawValue, inputFormat, innerInputValue]);

  const handleChange = (text: string) => {
    const finalString = text === '' || text === mask ? '' : text;
    setInnerDisplayedInputValue(finalString);

    const date = finalString === null ? null : utils.parse(finalString, inputFormat);
    if (ignoreInvalidInputs && !utils.isValid(date)) {
      return;
    }

    setInnerInputValue(date);
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
    error: validationError,
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
