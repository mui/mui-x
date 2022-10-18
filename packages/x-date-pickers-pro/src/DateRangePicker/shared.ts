import * as React from 'react';
import { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers';
import {
  BasePickerProps,
  PickerStateValueManager,
  useDefaultDates,
  useUtils,
  ValidationCommonProps,
  DefaultizedProps,
  applyDefaultDate,
  BaseDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { useThemeProps } from '@mui/material/styles';
import {
  DateRangePickerViewSlotsComponent,
  DateRangePickerViewSlotsComponentsProps,
  ExportedDateRangePickerViewProps,
} from './DateRangePickerView';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';
import { DateRange } from '../internal/models';
import { ExportedDateRangePickerInputProps } from './DateRangePickerInput';
import { replaceInvalidDatesByNull } from '../internal/utils/date-utils';
import {
  DateRangePickerToolbar,
  DateRangePickerToolbarProps,
  ExportedDateRangePickerToolbarProps,
} from './DateRangePickerToolbar';

export interface BaseDateRangePickerSlotsComponent<TDate>
  extends DateRangePickerViewSlotsComponent<TDate> {
  Toolbar?: React.JSXElementConstructor<DateRangePickerToolbarProps<TDate>>;
}

export interface BaseDateRangePickerSlotsComponentsProps<TDate>
  extends DateRangePickerViewSlotsComponentsProps<TDate> {
  toolbar?: ExportedDateRangePickerToolbarProps;
}

export interface BaseDateRangePickerProps<TDate>
  extends Omit<BasePickerProps<DateRange<TDate>, TDate>, 'orientation'>,
    ExportedDateRangePickerViewProps<TDate>,
    BaseDateValidationProps<TDate>,
    ValidationCommonProps<DateRangeValidationError, DateRange<TDate>>,
    ExportedDateRangePickerInputProps<TDate> {
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
   * Overrideable components.
   * @default {}
   */
  components?: BaseDateRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: BaseDateRangePickerSlotsComponentsProps<TDate>;
}

export function useDateRangePickerDefaultizedProps<
  TDate,
  Props extends BaseDateRangePickerProps<TDate>,
>(
  props: Props,
  name: string,
): LocalizedComponent<
  TDate,
  DefaultizedProps<
    Props,
    'calendars' | keyof BaseDateValidationProps<TDate>,
    { inputFormat: string }
  >
> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({
    props,
    name,
  });

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      dateRangePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  return {
    disableFuture: false,
    disablePast: false,
    calendars: 2,
    inputFormat: utils.formats.keyboardDate,
    ...themeProps,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    localeText,
    components: { Toolbar: DateRangePickerToolbar, ...themeProps.components },
  };
}

// What about renaming it `rangePickerValueManager` such that it's clear this manager is common to date, time and dateTime?
export const dateRangePickerValueManager: PickerStateValueManager<[any, any], any> = {
  emptyValue: [null, null],
  getTodayValue: (utils) => [utils.date()!, utils.date()!],
  cleanValue: replaceInvalidDatesByNull,
  areValuesEqual: (utils, a, b) => utils.isEqual(a[0], b[0]) && utils.isEqual(a[1], b[1]),
};
