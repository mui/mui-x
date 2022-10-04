import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  BasePickerProps2,
  DefaultizedProps,
  useDefaultDates,
  useUtils,
  applyDefaultDate,
  BaseDateValidationProps,
  ValidationCommonPropsOptionalValue,
} from '@mui/x-date-pickers/internals';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';
import { DateRange } from '../internal/models';
import {
  DateRangeCalendar,
  DateRangeCalendarProps,
  ExportedDateRangeCalendarProps,
} from '../DateRangeCalendar';

export interface BaseDateRangePicker2Props<TDate>
  extends Omit<
      BasePickerProps2<DateRange<TDate>, TDate, any>,
      'views' | 'openTo' | 'onViewChange' | 'orientation'
    >,
    ExportedDateRangeCalendarProps<TDate>,
    BaseDateValidationProps<TDate>,
    ValidationCommonPropsOptionalValue<DateRangeValidationError, DateRange<TDate>> {}

export function useDatePicker2DefaultizedProps<
  TDate,
  Props extends BaseDateRangePicker2Props<TDate>,
>(props: Props, name: string): DefaultizedProps<Props, keyof BaseDateValidationProps<TDate>> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  return {
    ...themeProps,
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    inputFormat: themeProps.inputFormat ?? utils.formats.keyboardDate,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

export const renderDateRangeViews = <TDate extends unknown>(
  props: DateRangeCalendarProps<TDate>,
) => <DateRangeCalendar {...props} />;
