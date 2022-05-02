import { MuiPickersAdapter } from '../models';

export function getTextFieldAriaText<TInputDate, TDate>(
  rawValue: TInputDate,
  utils: MuiPickersAdapter<TDate>,
) {
  // TODO: should `isValid` narrow `TDate | null` to `NonNullable<TDate>`?
  // Either we allow `TDate | null` to be valid and guard against calling `formatByString` with `null`.
  // Or we ensure `formatByString` is callable with `null`.
  return rawValue && utils.isValid(utils.date(rawValue))
    ? `Choose date, selected date is ${utils.format(utils.date(rawValue)!, 'fullDate')}`
    : 'Choose date';
}

export const getDisplayDate = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  rawValue: any,
  inputFormat: string,
) => {
  const date = utils.date(rawValue);
  const isEmpty = rawValue === null;

  if (isEmpty) {
    return '';
  }

  return utils.isValid(date)
    ? utils.formatByString(
        // TODO: should `isValid` narrow `TDate | null` to `NonNullable<TDate>`?
        // Either we allow `TDate | null` to be valid and guard against calling `formatByString` with `null`.
        // Or we ensure `formatByString` is callable with `null`.
        date!,
        inputFormat,
      )
    : '';
};

const MASK_USER_INPUT_SYMBOL = '_';
const staticDateWith2DigitTokens = '2019-11-21T22:30:00.000';
const staticDateWith1DigitTokens = '2019-01-01T09:00:00.000';

export function checkMaskIsValidForCurrentFormat(
  mask: string,
  format: string,
  acceptRegex: RegExp,
  utils: MuiPickersAdapter<any>,
) {
  const formattedDateWith1Digit = utils.formatByString(
    utils.date(staticDateWith1DigitTokens)!,
    format,
  );
  const inferredFormatPatternWith1Digits = formattedDateWith1Digit.replace(
    acceptRegex,
    MASK_USER_INPUT_SYMBOL,
  );

  const inferredFormatPatternWith2Digits = utils
    .formatByString(utils.date(staticDateWith2DigitTokens)!, format)
    .replace(acceptRegex, '_');

  const isMaskValid =
    inferredFormatPatternWith2Digits === mask && inferredFormatPatternWith1Digits === mask;

  if (!isMaskValid && utils.lib !== 'luxon' && process.env.NODE_ENV !== 'production') {
    const defaultWarning = [
      `The mask "${mask}" you passed is not valid for the format used ${format}.`,
      `Falling down to uncontrolled no-mask input.`,
    ];

    if (format.includes('MMM')) {
      console.warn(
        [
          ...defaultWarning,
          `Mask does not support literals such as 'MMM'.`,
          `Either use numbers with fix length or disable mask feature with 'disableMaskedInput' prop`,
        ].join('\n'),
      );
    } else if (
      inferredFormatPatternWith2Digits !== mask &&
      inferredFormatPatternWith1Digits === mask
    ) {
      console.warn(
        [
          ...defaultWarning,
          `Mask does not support numbers with variable length such as 'M'.`,
          `Either use numbers with fix length or disable mask feature with 'disableMaskedInput' prop`,
        ].join('\n'),
      );
    } else {
      console.warn(defaultWarning.join('\n'));
    }
  }

  return isMaskValid;
}

export const maskedDateFormatter = (mask: string, acceptRegexp: RegExp) => (value: string) => {
  return value
    .split('')
    .map((char, i) => {
      acceptRegexp.lastIndex = 0;

      if (i > mask.length - 1) {
        return '';
      }

      const maskChar = mask[i];
      const nextMaskChar = mask[i + 1];

      const acceptedChar = acceptRegexp.test(char) ? char : '';
      const formattedChar =
        maskChar === MASK_USER_INPUT_SYMBOL ? acceptedChar : maskChar + acceptedChar;

      if (i === value.length - 1 && nextMaskChar && nextMaskChar !== MASK_USER_INPUT_SYMBOL) {
        // when cursor at the end of mask part (e.g. month) prerender next symbol "21" -> "21/"
        return formattedChar ? formattedChar + nextMaskChar : '';
      }

      return formattedChar;
    })
    .join('');
};
