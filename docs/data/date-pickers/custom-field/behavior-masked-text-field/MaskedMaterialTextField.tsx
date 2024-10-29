import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useRifm } from 'rifm';
import TextField from '@mui/material/TextField';
import useControlled from '@mui/utils/useControlled';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePicker,
  DatePickerProps,
  DatePickerFieldProps,
} from '@mui/x-date-pickers/DatePicker';
import { useSplitFieldProps, useParsedFormat } from '@mui/x-date-pickers/hooks';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';

const MASK_USER_INPUT_SYMBOL = '_';
const ACCEPT_REGEX = /[\d]/gi;

const staticDateWith2DigitTokens = dayjs('2019-11-21T11:30:00.000');
const staticDateWith1DigitTokens = dayjs('2019-01-01T09:00:00.000');

function getValueStrFromValue(value: Dayjs | null, format: string) {
  if (value == null) {
    return '';
  }

  return value.isValid() ? value.format(format) : '';
}

function MaskedField(props: DatePickerFieldProps<Dayjs>) {
  const { slots, slotProps, ...other } = props;

  const { forwardedProps, internalProps } = useSplitFieldProps(other, 'date');

  const {
    format,
    value: valueProp,
    defaultValue,
    onChange,
    timezone,
    onError,
  } = internalProps;

  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue ?? null,
    name: 'MaskedField',
    state: 'value',
  });

  // Control the input text
  const [inputValue, setInputValue] = React.useState<string>(() =>
    getValueStrFromValue(value, format),
  );

  React.useEffect(() => {
    if (value && value.isValid()) {
      const newDisplayDate = getValueStrFromValue(value, format);
      setInputValue(newDisplayDate);
    }
  }, [format, value]);

  const parsedFormat = useParsedFormat(internalProps);

  const { hasValidationError, getValidationErrorForNewValue } = useValidation({
    value,
    timezone,
    onError,
    props: internalProps,
    validator: validateDate,
  });

  const handleValueStrChange = (newValueStr: string) => {
    setInputValue(newValueStr);

    const newValue = dayjs(newValueStr, format);
    setValue(newValue);

    if (onChange) {
      onChange(newValue, {
        validationError: getValidationErrorForNewValue(newValue),
      });
    }
  };

  const rifmFormat = React.useMemo(() => {
    const formattedDateWith1Digit = staticDateWith1DigitTokens.format(format);
    const inferredFormatPatternWith1Digits = formattedDateWith1Digit.replace(
      ACCEPT_REGEX,
      MASK_USER_INPUT_SYMBOL,
    );
    const inferredFormatPatternWith2Digits = staticDateWith2DigitTokens
      .format(format)
      .replace(ACCEPT_REGEX, '_');

    if (inferredFormatPatternWith1Digits !== inferredFormatPatternWith2Digits) {
      throw new Error(
        `Mask does not support numbers with variable length such as 'M'.`,
      );
    }

    const maskToUse = inferredFormatPatternWith1Digits;

    return function formatMaskedDate(valueToFormat: string) {
      let outputCharIndex = 0;
      return valueToFormat
        .split('')
        .map((character, characterIndex) => {
          ACCEPT_REGEX.lastIndex = 0;

          if (outputCharIndex > maskToUse.length - 1) {
            return '';
          }

          const maskChar = maskToUse[outputCharIndex];
          const nextMaskChar = maskToUse[outputCharIndex + 1];

          const acceptedChar = ACCEPT_REGEX.test(character) ? character : '';
          const formattedChar =
            maskChar === MASK_USER_INPUT_SYMBOL
              ? acceptedChar
              : maskChar + acceptedChar;

          outputCharIndex += formattedChar.length;

          const isLastCharacter = characterIndex === valueToFormat.length - 1;
          if (
            isLastCharacter &&
            nextMaskChar &&
            nextMaskChar !== MASK_USER_INPUT_SYMBOL
          ) {
            // when cursor at the end of mask part (e.g. month) prerender next symbol "21" -> "21/"
            return formattedChar ? formattedChar + nextMaskChar : '';
          }

          return formattedChar;
        })
        .join('');
    };
  }, [format]);

  const rifmProps = useRifm({
    value: inputValue,
    onChange: handleValueStrChange,
    format: rifmFormat,
  });

  return (
    <TextField
      placeholder={parsedFormat}
      error={!!hasValidationError}
      {...rifmProps}
      {...forwardedProps}
    />
  );
}

function MaskedFieldDatePicker(props: DatePickerProps<Dayjs>) {
  return <DatePicker slots={{ ...props.slots, field: MaskedField }} {...props} />;
}

export default function MaskedMaterialTextField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaskedFieldDatePicker />
    </LocalizationProvider>
  );
}
