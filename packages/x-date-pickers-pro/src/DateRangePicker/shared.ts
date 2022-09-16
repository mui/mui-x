import * as React from 'react';
import {
  buildDeprecatedPropsWarning,
  BasePickerProps,
  PickerStateValueManager,
  useDefaultDates,
  useLocaleText,
  useUtils,
  ValidationProps,
  DefaultizedProps,
  applyDefaultDate,
  BaseDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { useThemeProps } from '@mui/material/styles';
import { ExportedDateRangePickerViewProps } from './DateRangePickerView';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';
import { DateRange } from '../internal/models';
import { ExportedDateRangePickerInputProps } from './DateRangePickerInput';
import { replaceInvalidDatesByNull } from '../internal/utils/date-utils';

export interface BaseDateRangePickerProps<TDate>
  extends Omit<BasePickerProps<DateRange<TDate>>, 'orientation'>,
    ExportedDateRangePickerViewProps<TDate>,
    BaseDateValidationProps<TDate>,
    ValidationProps<DateRangeValidationError, DateRange<TDate>>,
    ExportedDateRangePickerInputProps<TDate> {
  /**
   * Text for end input label and toolbar placeholder.
   * @default 'End'
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  endText?: React.ReactNode;
  /**
   * Custom mask. Can be used to override generate from format. (e.g. `__/__/____ __:__` or `__/__/____ __:__ _M`).
   * @default '__/__/____'
   */
  mask?: ExportedDateRangePickerInputProps<TDate>['mask'];
  /**
   * Callback fired when the value (the selected date range) changes @DateIOType.
   * @template TDate
   * @param {DateRange<TDate>} date The new date range.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: (date: DateRange<TDate>, keyboardInputValue?: string) => void;
  /**
   * Text for start input label and toolbar placeholder.
   * @default 'Start'
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  startText?: React.ReactNode;
}

const deprecatedPropsWarning = buildDeprecatedPropsWarning(
  'Props for translation are deprecated. See https://mui.com/x/react-date-pickers/localization for more information.',
);

export function useDateRangePickerDefaultizedProps<
  TDate,
  Props extends BaseDateRangePickerProps<TDate>,
>(
  props: Props,
  name: string,
): DefaultizedProps<
  Props,
  'calendars' | 'startText' | 'endText' | keyof BaseDateValidationProps<TDate>,
  { inputFormat: string }
> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({
    props,
    name,
  });

  deprecatedPropsWarning({
    startText: themeProps.startText,
    endText: themeProps.endText,
  });

  const localeText = useLocaleText();

  const startText = themeProps.startText ?? localeText.start;
  const endText = themeProps.endText ?? localeText.end;

  return {
    disableFuture: false,
    disablePast: false,
    calendars: 2,
    inputFormat: utils.formats.keyboardDate,
    ...themeProps,
    endText,
    startText,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

export const dateRangePickerValueManager: PickerStateValueManager<[any, any], any> = {
  emptyValue: [null, null],
  getTodayValue: (utils) => [utils.date()!, utils.date()!],
  parseInput: replaceInvalidDatesByNull,
  areValuesEqual: (utils, a, b) => utils.isEqual(a[0], b[0]) && utils.isEqual(a[1], b[1]),
};
