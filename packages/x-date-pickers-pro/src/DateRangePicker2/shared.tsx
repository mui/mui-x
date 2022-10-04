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
import { ExportedDateRangePickerViewProps } from '../DateRangePicker/DateRangePickerView';
import { DateRange } from '../internal/models';
import { CalendarRangePicker, CalendarRangePickerProps } from '../CalendarRangePicker';

export interface BaseDateRangePicker2Props<TDate>
  extends Omit<
      BasePickerProps2<DateRange<TDate>, TDate, any>,
      'views' | 'openTo' | 'onViewChange' | 'orientation'
    >,
    ExportedDateRangePickerViewProps<TDate>,
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
  props: CalendarRangePickerProps<TDate>,
) => <CalendarRangePicker {...props} />;
