import * as React from 'react';
import dayjs from 'dayjs';
import { useRifm } from 'rifm';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import { CalendarIcon } from '@mui/x-date-pickers/icons';

const MASK_USER_INPUT_SYMBOL = '_';
const ACCEPT_REGEX = /[\d]/gi;

const staticDateWith2DigitTokens = dayjs('2019-11-21T11:30:00.000');
const staticDateWith1DigitTokens = dayjs('2019-01-01T09:00:00.000');

function getInputValueFromValue(value, format) {
  if (value == null) {
    return '';
  }

  return value.isValid() ? value.format(format) : '';
}

function MaskedDateField(props) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const pickerContext = usePickerContext();
  const parsedFormat = useParsedFormat();

  // Control the input text
  const [inputValue, setInputValue] = React.useState(() =>
    getInputValueFromValue(pickerContext.value, pickerContext.fieldFormat),
  );

  React.useEffect(() => {
    if (pickerContext.value && pickerContext.value.isValid()) {
      const newDisplayDate = getInputValueFromValue(
        pickerContext.value,
        pickerContext.fieldFormat,
      );
      setInputValue(newDisplayDate);
    }
  }, [pickerContext.fieldFormat, pickerContext.value]);

  const { hasValidationError, getValidationErrorForNewValue } = useValidation({
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
    validator: validateDate,
  });

  const handleInputValueChange = (newInputValue) => {
    setInputValue(newInputValue);

    const newValue = dayjs(newInputValue, pickerContext.fieldFormat);
    pickerContext.setValue(newValue, {
      validationError: getValidationErrorForNewValue(newValue),
    });
  };

  const rifmFormat = React.useMemo(() => {
    const formattedDateWith1Digit = staticDateWith1DigitTokens.format(
      pickerContext.fieldFormat,
    );
    const inferredFormatPatternWith1Digits = formattedDateWith1Digit.replace(
      ACCEPT_REGEX,
      MASK_USER_INPUT_SYMBOL,
    );
    const inferredFormatPatternWith2Digits = staticDateWith2DigitTokens
      .format(pickerContext.fieldFormat)
      .replace(ACCEPT_REGEX, '_');

    if (inferredFormatPatternWith1Digits !== inferredFormatPatternWith2Digits) {
      throw new Error(
        `Mask does not support numbers with variable length such as 'M'.`,
      );
    }

    const maskToUse = inferredFormatPatternWith1Digits;

    return function formatMaskedDate(valueToFormat) {
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
  }, [pickerContext.fieldFormat]);

  const rifmProps = useRifm({
    value: inputValue,
    onChange: handleInputValueChange,
    format: rifmFormat,
  });

  return (
    <TextField
      placeholder={parsedFormat}
      error={hasValidationError}
      focused={pickerContext.open}
      name={pickerContext.name}
      label={pickerContext.label}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      ref={pickerContext.rootRef}
      {...rifmProps}
      {...forwardedProps}
      InputProps={{
        ref: pickerContext.triggerRef,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => pickerContext.setOpen((prev) => !prev)}
              edge="end"
            >
              <CalendarIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

function MaskedFieldDatePicker(props) {
  return (
    <DatePicker slots={{ ...props.slots, field: MaskedDateField }} {...props} />
  );
}

export default function MaskedMaterialTextField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaskedFieldDatePicker />
    </LocalizationProvider>
  );
}
