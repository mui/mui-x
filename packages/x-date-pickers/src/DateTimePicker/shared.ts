import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { ExportedClockPickerProps } from '../ClockPicker/ClockPicker';
import { ExportedCalendarPickerProps } from '../CalendarPicker/CalendarPicker';
import { DateTimeValidationError } from '../internals/hooks/validation/useDateTimeValidation';
import { ValidationProps } from '../internals/hooks/validation/useValidation';
import { ParseableDate } from '../internals/models/parseableDate';
import { BasePickerProps } from '../internals/models/props/basePickerProps';
import { BaseToolbarProps } from '../internals/models/props/baseToolbarProps';
import { ExportedDateInputProps } from '../internals/components/PureDateInput';
import { CalendarOrClockPickerView } from '../internals/models';

export interface BaseDateTimePickerProps<TDate>
  extends ExportedClockPickerProps<TDate>,
    ExportedCalendarPickerProps<TDate>,
    BasePickerProps<ParseableDate<TDate>, TDate | null>,
    ValidationProps<DateTimeValidationError, ParseableDate<TDate>>,
    ExportedDateInputProps<ParseableDate<TDate>, TDate | null> {
  /**
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   * @default {}
   */
  components?: ExportedCalendarPickerProps<TDate>['components'] &
    ExportedDateInputProps<ParseableDate<TDate>, TDate | null>['components'];
  /**
   * To show tabs.
   */
  hideTabs?: boolean;
  /**
   * Date tab icon.
   */
  dateRangeIcon?: React.ReactNode;
  /**
   * Time tab icon.
   */
  timeIcon?: React.ReactNode;
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime?: TDate;
  /**
   * Minimal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime?: TDate;
  /**
   * Callback fired on view change.
   * @param {CalendarOrClockPickerView} view The new view.
   */
  onViewChange?: (view: CalendarOrClockPickerView) => void;
  /**
   * First view to show.
   */
  openTo?: CalendarOrClockPickerView;
  /**
   * Component that will replace default toolbar renderer.
   * @default DateTimePickerToolbar
   */
  ToolbarComponent?: React.JSXElementConstructor<BaseToolbarProps<TDate | null>>;
  /**
   * Mobile picker title, displaying in the toolbar.
   * @default 'Select date & time'
   */
  toolbarTitle?: React.ReactNode;
  /**
   * Date format, that is displaying in toolbar.
   */
  toolbarFormat?: string;
  /**
   * Array of views to show.
   */
  views?: readonly CalendarOrClockPickerView[];
}

type DefaultizedProps<Props> = Props & { inputFormat: string };

export function useDateTimePickerDefaultizedProps<
  TDate,
  Props extends BaseDateTimePickerProps<TDate>,
>(
  props: Props,
  name: string,
): DefaultizedProps<Props> & Required<Pick<BaseDateTimePickerProps<TDate>, 'openTo' | 'views'>> {
  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({
    props,
    name,
  });

  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  if (themeProps.orientation != null && themeProps.orientation !== 'portrait') {
    throw new Error('We are not supporting custom orientation for DateTimePicker yet :(');
  }

  return {
    ampm,
    orientation: 'portrait',
    openTo: 'day',
    views: ['year', 'day', 'hours', 'minutes'],
    ampmInClock: true,
    showToolbar: false,
    allowSameDateSelection: true,
    mask: '__/__/____ __:__',
    acceptRegex: ampm ? /[\dap]/gi : /\d/gi,
    disableMaskedInput: ampm,
    inputFormat: ampm ? utils.formats.keyboardDateTime12h : utils.formats.keyboardDateTime24h,
    disableIgnoringDatePartForTimeValidation: Boolean(
      themeProps.minDateTime || themeProps.maxDateTime,
    ),
    ...themeProps,
    minDate: themeProps.minDateTime ?? themeProps.minDate ?? defaultDates.minDate,
    maxDate: themeProps.maxDateTime ?? themeProps.maxDate ?? defaultDates.maxDate,
    minTime: themeProps.minDateTime ?? themeProps.minTime,
    maxTime: themeProps.maxDateTime ?? themeProps.maxTime,
  };
}
