import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import { CalendarOrClockPickerView } from '../internals/models';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { ValidationCommonPropsOptionalValue } from '../internals/hooks/validation/useValidation';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import {
  DateCalendarSlotsComponent,
  DateCalendarSlotsComponentsProps,
  ExportedDateCalendarProps,
} from '../DateCalendar/DateCalendar';
import {
  ClockPickerSlotsComponent,
  ClockPickerSlotsComponentsProps,
  ExportedClockPickerProps,
} from '../ClockPicker/ClockPicker';
import { BaseNextPickerProps } from '../internals/models/props/basePickerProps';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  DateTimePickerTabsProps,
  ExportedDateTimePickerTabsProps,
} from '../DateTimePicker/DateTimePickerTabs';
import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
} from '../internals/hooks/validation/models';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';
import {
  DateTimePickerToolbar,
  DateTimePickerToolbarProps,
  ExportedDateTimePickerToolbarProps,
} from '../DateTimePicker/DateTimePickerToolbar';

export interface BaseNextDateTimePickerSlotsComponent<TDate>
  extends DateCalendarSlotsComponent<TDate>,
    ClockPickerSlotsComponent {
  /**
   * Tabs enabling toggling between date and time pickers.
   * @default DateTimePickerTabs
   */
  Tabs?: React.ElementType<DateTimePickerTabsProps>;
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<DateTimePickerToolbarProps<TDate>>;
}

export interface BaseNextDateTimePickerSlotsComponentsProps<TDate>
  extends DateCalendarSlotsComponentsProps<TDate>,
    ClockPickerSlotsComponentsProps {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedDateTimePickerTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedDateTimePickerToolbarProps;
}

export interface BaseNextDateTimePickerProps<TDate>
  extends MakeOptional<
      BaseNextPickerProps<TDate | null, TDate, CalendarOrClockPickerView>,
      'views' | 'openTo'
    >,
    Omit<ExportedDateCalendarProps<TDate>, 'onViewChange'>,
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
  /**
   * Toggles visibility of date time switching tabs
   * @default `false` for mobile, `true` for desktop
   */
  hideTabs?: boolean;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: BaseNextDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: BaseNextDateTimePickerSlotsComponentsProps<TDate>;
}

type UseNextDateTimePickerDefaultizedProps<
  TDate,
  Props extends BaseNextDateTimePickerProps<TDate>,
> = LocalizedComponent<
  TDate,
  DefaultizedProps<
    Props,
    | 'views'
    | 'openTo'
    | 'orientation'
    | 'ampmInClock'
    | 'ampm'
    | 'inputFormat'
    | keyof BaseDateValidationProps<TDate>
    | keyof BaseTimeValidationProps
  >
>;

export function useNextDateTimePickerDefaultizedProps<
  TDate,
  Props extends BaseNextDateTimePickerProps<TDate>,
>(props: Props, name: string): UseNextDateTimePickerDefaultizedProps<TDate, Props> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['year', 'day', 'hours', 'minutes'];
  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  // TODO: Move logic inside `DateTimeField` if it supports the `ampm` prop.
  let inputFormat: string;
  if (themeProps.inputFormat != null) {
    inputFormat = themeProps.inputFormat;
  } else if (ampm) {
    inputFormat = utils.formats.keyboardDateTime12h;
  } else {
    inputFormat = utils.formats.keyboardDateTime24h;
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
    ...themeProps,
    inputFormat,
    views,
    ampm,
    localeText,
    orientation: themeProps.orientation ?? 'portrait',
    ampmInClock: themeProps.ampmInClock ?? true,
    openTo: themeProps.openTo ?? 'day',
    // TODO: Remove from public API
    disableIgnoringDatePartForTimeValidation:
      themeProps.disableIgnoringDatePartForTimeValidation ??
      Boolean(themeProps.minDateTime || themeProps.maxDateTime),
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
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
    components: {
      Toolbar: DateTimePickerToolbar,
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
