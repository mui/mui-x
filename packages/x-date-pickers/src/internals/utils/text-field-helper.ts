import { MuiPickersAdapter } from '../models';

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

export function getMaskFromCurrentFormat(
  mask: string | undefined,
  format: string,
  acceptRegex: RegExp,
  utils: MuiPickersAdapter<any>,
) {
  if (mask) {
    return mask;
  }

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

  if (inferredFormatPatternWith1Digits === inferredFormatPatternWith2Digits) {
    return inferredFormatPatternWith1Digits;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      [
        `Mask does not support numbers with variable length such as 'M'.`,
        `Either use numbers with fix length or disable mask feature with 'disableMaskedInput' prop`,
        `Falling down to uncontrolled no-mask input.`,
      ].join('\n'),
    );
  }
  return '';
}

export function checkMaskIsValidForCurrentFormat(
  mask: string,
  format: string,
  acceptRegex: RegExp,
  utils: MuiPickersAdapter<any>,
) {
  if (!mask) {
    return false;
  }

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
    inferredFormatPatternWith2Digits === inferredFormatPatternWith1Digits &&
    mask === inferredFormatPatternWith2Digits;

  if (!isMaskValid && utils.lib !== 'luxon' && process.env.NODE_ENV !== 'production') {
    if (format.includes('MMM')) {
      console.warn(
        [
          `Mask does not support literals such as 'MMM'.`,
          `Either use numbers with fix length or disable mask feature with 'disableMaskedInput' prop`,
          `Falling down to uncontrolled no-mask input.`,
        ].join('\n'),
      );
    } else if (
      inferredFormatPatternWith2Digits &&
      inferredFormatPatternWith2Digits !== inferredFormatPatternWith1Digits
    ) {
      console.warn(
        [
          `Mask does not support numbers with variable length such as 'M'.`,
          `Either use numbers with fix length or disable mask feature with 'disableMaskedInput' prop`,
          `Falling down to uncontrolled no-mask input.`,
        ].join('\n'),
      );
    } else if (mask) {
      console.warn(
        [
          `The mask "${mask}" you passed is not valid for the format used ${format}.`,
          `Falling down to uncontrolled no-mask input.`,
        ].join('\n'),
      );
    }
  }

  return isMaskValid;
}

export const maskedDateFormatter = (mask: string, acceptRegexp: RegExp) => (value: string) => {
  let outputCharIndex = 0;
  return value
    .split('')
    .map((char, inputCharIndex) => {
      acceptRegexp.lastIndex = 0;

      if (outputCharIndex > mask.length - 1) {
        return '';
      }

      const maskChar = mask[outputCharIndex];
      const nextMaskChar = mask[outputCharIndex + 1];

      const acceptedChar = acceptRegexp.test(char) ? char : '';
      const formattedChar =
        maskChar === MASK_USER_INPUT_SYMBOL ? acceptedChar : maskChar + acceptedChar;

      outputCharIndex += formattedChar.length;

      const isLastCharacter = inputCharIndex === value.length - 1;
      if (isLastCharacter && nextMaskChar && nextMaskChar !== MASK_USER_INPUT_SYMBOL) {
        // when cursor at the end of mask part (e.g. month) prerender next symbol "21" -> "21/"
        return formattedChar ? formattedChar + nextMaskChar : '';
      }

      return formattedChar;
    })
    .join('');
};
