import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import { CalendarOrClockPickerView } from '../internals/models';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { ValidationCommonPropsOptionalValue } from '../internals/hooks/validation/useValidation';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import { ExportedCalendarPickerProps } from '../CalendarPicker/CalendarPicker';
import { ExportedClockPickerProps } from '../ClockPicker/ClockPicker';
import { BasePickerProps2 } from '../internals/models/props/basePickerProps';
import { applyDefaultDate } from '../internals/utils/date-utils';

export interface BaseDateTimePicker2Props<TDate>
  extends MakeOptional<
      BasePickerProps2<TDate | null, CalendarOrClockPickerView>,
      'views' | 'openTo'
    >,
    Omit<ExportedCalendarPickerProps<TDate>, 'onViewChange'>,
    ExportedClockPickerProps<TDate>,
    ValidationCommonPropsOptionalValue<DateValidationError, TDate | null> {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
  /**
   * The label content.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime?: TDate;
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime?: TDate;
}

export function useDateTimePicker2DefaultizedProps<
  TDate,
  Props extends BaseDateTimePicker2Props<TDate>,
>(props: Props, name: string): DefaultizedProps<Props, 'views' | 'openTo'> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['year', 'day', 'hours', 'minutes'];

  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  return {
    ampm,
    orientation: 'portrait',
    openTo: 'day',
    ampmInClock: true,
    disableMaskedInput: false,
    inputFormat: ampm ? utils.formats.keyboardDateTime12h : utils.formats.keyboardDateTime24h,
    disableIgnoringDatePartForTimeValidation: Boolean(
      themeProps.minDateTime || themeProps.maxDateTime,
    ),
    disablePast: false,
    disableFuture: false,
    ...themeProps,
    views,
    minDate: applyDefaultDate(
      utils,
      themeProps.minDateTime ?? themeProps.minDate,
      defaultDates.minDate,
    ),
    maxDate: applyDefaultDate(
      utils,
      themeProps.maxDateTime ?? themeProps.maxDate,
      defaultDates.maxDate,
    ),
    minTime: themeProps.minDateTime ?? themeProps.minTime,
    maxTime: themeProps.maxDateTime ?? themeProps.maxTime,
  };
}
