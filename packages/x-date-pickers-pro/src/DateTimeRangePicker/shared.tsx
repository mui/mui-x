import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import {
  DefaultizedProps,
  useDefaultDates,
  useUtils,
  applyDefaultDate,
  BaseDateValidationProps,
  BasePickerInputProps,
  PickerViewRendererLookup,
  UncapitalizeObjectKeys,
  uncapitalizeObjectKeys,
} from '@mui/x-date-pickers/internals';
import { DesktopOnlyTimePickerProps } from '@mui/x-date-pickers/internals/models/props/clock';
import { applyDefaultViewProps } from '@mui/x-date-pickers/internals/utils/views';
import { DateTimeRangeValidationError } from '../models';
import { DateRange, DateTimeRangePickerViews } from '../internals/models';
import {
  DateRangeCalendarSlotsComponent,
  DateRangeCalendarSlotsComponentsProps,
  ExportedDateRangeCalendarProps,
} from '../DateRangeCalendar';
import {
  DateTimeRangePickerToolbar,
  DateTimeRangePickerToolbarProps,
  ExportedDateTimeRangePickerToolbarProps,
} from './DateTimeRangePickerToolbar';
import { DateRangeViewRendererProps } from '../dateRangeViewRenderers';
import {
  DateTimeRangePickerTabs,
  DateTimeRangePickerTabsProps,
  ExportedDateTimeRangePickerTabsProps,
} from './DateTimeRangePickerTabs';

export interface BaseDateTimeRangePickerSlotsComponent<TDate>
  extends DateRangeCalendarSlotsComponent<TDate> {
  /**
   * Tabs enabling toggling between date and time pickers.
   * @default DateTimeRangePickerTabs
   */
  Tabs?: React.ElementType<DateTimeRangePickerTabsProps>;
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimeRangePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<DateTimeRangePickerToolbarProps<TDate>>;
}

export interface BaseDateTimeRangePickerSlotsComponentsProps<TDate>
  extends DateRangeCalendarSlotsComponentsProps<TDate> {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedDateTimeRangePickerTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedDateTimeRangePickerToolbarProps;
}

export interface BaseDateTimeRangePickerProps<TDate>
  extends Omit<
      BasePickerInputProps<
        DateRange<TDate>,
        TDate,
        DateTimeRangePickerViews,
        DateTimeRangeValidationError
      >,
      'orientation'
    >,
    ExportedDateRangeCalendarProps<TDate>,
    BaseDateValidationProps<TDate>,
    DesktopOnlyTimePickerProps<TDate> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: BaseDateTimeRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: BaseDateTimeRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<BaseDateTimeRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseDateTimeRangePickerSlotsComponentsProps<TDate>;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<
      DateRange<TDate>,
      DateTimeRangePickerViews,
      DateRangeViewRendererProps<TDate, 'day'>,
      {}
    >
  >;
}

type UseDateTimeRangePickerDefaultizedProps<
  TDate,
  Props extends BaseDateTimeRangePickerProps<TDate>,
> = LocalizedComponent<
  TDate,
  DefaultizedProps<Props, 'views' | 'openTo' | 'ampm' | keyof BaseDateValidationProps<TDate>>
>;

export function useDateTimeRangePickerDefaultizedProps<
  TDate,
  Props extends BaseDateTimeRangePickerProps<TDate>,
>(
  props: Props,
  name: string,
): UseDateTimeRangePickerDefaultizedProps<TDate, Omit<Props, 'components' | 'componentsProps'>> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const { components, componentsProps, ...themeProps } = useThemeProps({
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

  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();
  const slotProps = themeProps.slotProps ?? componentsProps;

  return {
    ...themeProps,
    ...applyDefaultViewProps({
      views: themeProps.views,
      openTo: themeProps.openTo,
      defaultViews: ampm ? ['day', 'hours', 'minutes', 'meridiem'] : ['day', 'hours', 'minutes'],
      defaultOpenTo: 'day',
    }),
    timeSteps: { hours: 1, minutes: 5, seconds: 5, ...themeProps.timeSteps },
    localeText,
    ampm,
    calendars: themeProps.calendars ?? 1,
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    slots: {
      tabs: DateTimeRangePickerTabs,
      toolbar: DateTimeRangePickerToolbar,
      ...(themeProps.slots ?? uncapitalizeObjectKeys(components)),
    },
    slotProps: {
      ...slotProps,
      toolbar: {
        ...slotProps?.toolbar,
        ampm,
      },
    },
  };
}
