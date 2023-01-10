import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { ExportedTimeClockProps } from '../TimeClock/TimeClock.types';
import { ExportedDateCalendarProps } from '../DateCalendar/DateCalendar.types';
import { DateTimeValidationError } from '../internals/hooks/validation/useDateTimeValidation';
import { ValidationCommonProps } from '../internals/hooks/validation/useValidation';
import { BasePickerProps } from '../internals/models/props/basePickerProps';
import { ExportedDateInputProps } from '../internals/components/PureDateInput';
import { DateOrTimeView } from '../internals/models';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { DefaultizedProps } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
} from '../internals/hooks/validation/models';
import {
  CalendarOrClockPickerSlotsComponent,
  CalendarOrClockPickerSlotsComponentsProps,
} from '../internals/components/CalendarOrClockPicker';
import {
  DateTimePickerToolbar,
  DateTimePickerToolbarProps,
  ExportedDateTimePickerToolbarProps,
} from './DateTimePickerToolbar';
import {
  DateTimePickerTabs,
  DateTimePickerTabsProps,
  ExportedDateTimePickerTabsProps,
} from './DateTimePickerTabs';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';

export interface BaseDateTimePickerSlotsComponent<TDate>
  extends CalendarOrClockPickerSlotsComponent<TDate, DateOrTimeView> {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<DateTimePickerToolbarProps<TDate>>;
  /**
   * Tabs enabling toggling between date and time pickers.
   * @default DateTimePickerTabs
   */
  Tabs?: React.JSXElementConstructor<DateTimePickerTabsProps>;
}

export interface BaseDateTimePickerSlotsComponentsProps<TDate>
  extends CalendarOrClockPickerSlotsComponentsProps<TDate> {
  toolbar?: ExportedDateTimePickerToolbarProps;
  tabs?: ExportedDateTimePickerTabsProps;
}

export interface BaseDateTimePickerProps<TDate>
  extends ExportedTimeClockProps<TDate>,
    ExportedDateCalendarProps<TDate>,
    BasePickerProps<TDate | null, TDate>,
    ValidationCommonProps<DateTimeValidationError, TDate | null>,
    ExportedDateInputProps<TDate> {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
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
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime?: TDate;
  /**
   * Callback fired on view change.
   * @param {DateOrTimeView} view The new view.
   */
  onViewChange?: (view: DateOrTimeView) => void;
  /**
   * First view to show.
   * Must be a valid option from `views` list
   * @default 'day'
   */
  openTo?: DateOrTimeView;
  /**
   * Array of views to show.
   * @default ['year', 'day', 'hours', 'minutes']
   */
  views?: readonly DateOrTimeView[];
  /**
   * Overrideable components.
   * @default {}
   */
  components?: BaseDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: BaseDateTimePickerSlotsComponentsProps<TDate>;
}

export function useDateTimePickerDefaultizedProps<
  TDate,
  Props extends BaseDateTimePickerProps<TDate>,
>(
  props: Props,
  name: string,
): LocalizedComponent<
  TDate,
  DefaultizedProps<
    Props,
    'openTo' | 'views' | keyof BaseDateValidationProps<TDate> | keyof BaseTimeValidationProps,
    { inputFormat: string }
  >
> {
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

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      dateTimePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  return {
    ampm,
    orientation: 'portrait',
    openTo: 'day',
    views: ['year', 'day', 'hours', 'minutes'],
    ampmInClock: true,
    acceptRegex: ampm ? /[\dap]/gi : /\d/gi,
    disableMaskedInput: false,
    inputFormat: ampm ? utils.formats.keyboardDateTime12h : utils.formats.keyboardDateTime24h,
    disableIgnoringDatePartForTimeValidation: Boolean(
      themeProps.minDateTime || themeProps.maxDateTime,
    ),
    disablePast: false,
    disableFuture: false,
    ...themeProps,
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
    localeText,
    components: {
      Toolbar: DateTimePickerToolbar,
      Tabs: DateTimePickerTabs,
      ...themeProps.components,
    },
    componentsProps: {
      ...themeProps.componentsProps,
      toolbar: {
        ampm,
        ampmInClock: themeProps.ampmInClock,
        ...themeProps.componentsProps?.toolbar,
      },
    },
  };
}
