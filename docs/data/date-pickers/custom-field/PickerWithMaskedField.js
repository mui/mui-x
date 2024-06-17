import * as React from 'react';
import dayjs from 'dayjs';
import { useRifm } from 'rifm';
import TextField from '@mui/material/TextField';
import useControlled from '@mui/utils/useControlled';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  splitFieldInternalAndForwardedProps,
  useValidation,
  validateDate,
} from '@mui/x-date-pickers/internals';

const MASK_USER_INPUT_SYMBOL = '_';
const ACCEPT_REGEX = /[\d]/gi;

const staticDateWith2DigitTokens = dayjs('2019-11-21T22:30:00.000');
const staticDateWith1DigitTokens = dayjs('2019-01-01T09:00:00.000');

function getFormatHelpTextFromFormat(format) {
  const localeFormats = dayjs.Ls.en?.formats;

  // @see https://github.com/iamkun/dayjs/blob/dev/src/plugin/localizedFormat/index.js
  const t = (formatBis) =>
    formatBis.replace(
      /(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,
      (_, a, b) => a || b.slice(1),
    );

  return format
    .replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (_, a, b) => {
      const B = b && b.toUpperCase();
      return a || localeFormats[b] || t(localeFormats[B]);
    })
    .replace(/a/gi, '(a|p)m')
    .toLocaleLowerCase();
}

function getMaskFromCurrentFormat(format) {
  const formattedDateWith1Digit = staticDateWith1DigitTokens.format(format);

  const inferredFormatPatternWith1Digits = formattedDateWith1Digit.replace(
    ACCEPT_REGEX,
    MASK_USER_INPUT_SYMBOL,
  );
  const inferredFormatPatternWith2Digits = staticDateWith2DigitTokens
    .format(format)
    .replace(ACCEPT_REGEX, '_');

  if (inferredFormatPatternWith1Digits === inferredFormatPatternWith2Digits) {
    return inferredFormatPatternWith1Digits;
  }

  throw new Error(`Mask does not support numbers with variable length such as 'M'.`);
}

function createMaskedDateFormatter(mask) {
  return function formatMaskedDate(value) {
    let outputCharIndex = 0;
    return value
      .split('')
      .map((char, inputCharIndex) => {
        ACCEPT_REGEX.lastIndex = 0;

        if (outputCharIndex > mask.length - 1) {
          return '';
        }

        const maskChar = mask[outputCharIndex];
        const nextMaskChar = mask[outputCharIndex + 1];

        const acceptedChar = ACCEPT_REGEX.test(char) ? char : '';
        const formattedChar =
          maskChar === MASK_USER_INPUT_SYMBOL
            ? acceptedChar
            : maskChar + acceptedChar;

        outputCharIndex += formattedChar.length;

        const isLastCharacter = inputCharIndex === value.length - 1;
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
}

function getDisplayDate(value, format) {
  if (value == null) {
    return '';
  }

  return value.isValid() ? value.format(format) : '';
}

function MaskedField(props) {
  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,
    // TODO: Add support for those props
    onError,
    format,
    value: valueProp,
    defaultValue,
    onChange,
    timezone,
    ...other
  } = props;

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps(
    props,
    'date',
  );

  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue ?? null,
    name: 'MaskedField',
    state: 'value',
  });

  const formatHelperText = getFormatHelpTextFromFormat(format);
  const maskToUse = React.useMemo(() => getMaskFromCurrentFormat(format), [format]);

  // Control the input text
  const [valueStr, setValueStr] = React.useState(getDisplayDate(value, format));

  React.useEffect(() => {
    if (value && value.isValid()) {
      const newDisplayDate = getDisplayDate(value, format);
      setValueStr(newDisplayDate);
    }
  }, [format, value]);

  const handleChange = (text) => {
    const cleanString = text === '' || text === maskToUse ? '' : text;
    setValueStr(cleanString);

    const date = dayjs(value, format);
    setValue(date);

    if (onChange) {
      onChange(date, { validationError: null });
    }
  };

  const validationError = useValidation(
    { ...internalProps, value, timezone: 'default' },
    validateDate,
    (a, b) => a === b,
    null,
  );

  const rifmProps = useRifm({
    value: valueStr,
    onChange: handleChange,
    format: createMaskedDateFormatter(maskToUse),
  });

  return (
    <TextField
      placeholder={formatHelperText}
      error={!!validationError}
      {...rifmProps}
      {...forwardedProps}
    />
  );
}

function MaskedDatePicker(props) {
  return <DatePicker slots={{ ...props.slots, field: MaskedField }} {...props} />;
}

export default function PickerWithMaskedField() {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaskedDatePicker />
    </LocalizationProvider>
  );
}
