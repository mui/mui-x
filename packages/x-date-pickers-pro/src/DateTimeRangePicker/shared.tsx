import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { LocalizedComponent } from '@mui/x-date-pickers/locales';
import {
  DefaultizedProps,
  useDefaultDates,
  useUtils,
  applyDefaultDate,
  BaseDateValidationProps,
  BasePickerInputProps,
  PickerViewRendererLookup,
  BaseClockProps,
  DesktopOnlyTimePickerProps,
  applyDefaultViewProps,
  TimeViewWithMeridiem,
  resolveTimeViewsResponse,
  UseViewsOptions,
  DateTimeValidationProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { TimeViewRendererProps } from '@mui/x-date-pickers/timeViewRenderers';
import { DigitalClockSlots, DigitalClockSlotProps } from '@mui/x-date-pickers/DigitalClock';
import {
  MultiSectionDigitalClockSlots,
  MultiSectionDigitalClockSlotProps,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { DateRange, DateTimeRangeValidationError } from '../models';
import { DateTimeRangePickerView, DateTimeRangePickerViewExternal } from '../internals/models';
import {
  DateRangeCalendarSlots,
  DateRangeCalendarSlotProps,
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

export interface BaseDateTimeRangePickerSlots<TDate extends PickerValidDate>
  extends DateRangeCalendarSlots<TDate>,
    DigitalClockSlots,
    MultiSectionDigitalClockSlots {
  /**
   * Tabs enabling toggling between date and time pickers.
   * @default DateTimeRangePickerTabs
   */
  tabs?: React.ElementType<DateTimeRangePickerTabsProps>;
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimeRangePickerToolbar
   */
  toolbar?: React.JSXElementConstructor<DateTimeRangePickerToolbarProps<TDate>>;
}

export interface BaseDateTimeRangePickerSlotProps<TDate extends PickerValidDate>
  extends DateRangeCalendarSlotProps<TDate>,
    DigitalClockSlotProps,
    MultiSectionDigitalClockSlotProps {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedDateTimeRangePickerTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedDateTimeRangePickerToolbarProps;
}

export type DateTimeRangePickerRenderers<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  TAdditionalProps extends {} = {},
> = PickerViewRendererLookup<
  DateRange<TDate>,
  TView,
  Omit<DateRangeViewRendererProps<TDate, 'day'>, 'view' | 'slots' | 'slotProps'> &
    Omit<
      TimeViewRendererProps<TimeViewWithMeridiem, BaseClockProps<TDate, TimeViewWithMeridiem>>,
      'view' | 'slots' | 'slotProps'
    > & { view: TView },
  TAdditionalProps
>;

export interface BaseDateTimeRangePickerProps<TDate extends PickerValidDate>
  extends Omit<
      BasePickerInputProps<
        DateRange<TDate>,
        TDate,
        DateTimeRangePickerView,
        DateTimeRangeValidationError
      >,
      'orientation' | 'views' | 'openTo'
    >,
    ExportedDateRangeCalendarProps<TDate>,
    BaseDateValidationProps<TDate>,
    DesktopOnlyTimePickerProps<TDate>,
    Partial<
      Pick<UseViewsOptions<DateRange<TDate>, DateTimeRangePickerViewExternal>, 'openTo' | 'views'>
    >,
    DateTimeValidationProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseDateTimeRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseDateTimeRangePickerSlotProps<TDate>;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers?: Partial<DateTimeRangePickerRenderers<TDate, DateTimeRangePickerView>>;
}

type UseDateTimeRangePickerDefaultizedProps<
  TDate extends PickerValidDate,
  Props extends BaseDateTimeRangePickerProps<TDate>,
> = LocalizedComponent<
  TDate,
  Omit<DefaultizedProps<Props, 'openTo' | 'ampm' | keyof BaseDateValidationProps<TDate>>, 'views'>
> & {
  shouldRenderTimeInASingleColumn: boolean;
  views: readonly DateTimeRangePickerView[];
};

export function useDateTimeRangePickerDefaultizedProps<
  TDate extends PickerValidDate,
  Props extends BaseDateTimeRangePickerProps<TDate>,
>(props: Props, name: string): UseDateTimeRangePickerDefaultizedProps<TDate, Props> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();
  const { openTo, views: defaultViews } = applyDefaultViewProps<DateTimeRangePickerViewExternal>({
    views: themeProps.views,
    openTo: themeProps.openTo,
    defaultViews: ['day', 'hours', 'minutes'],
    defaultOpenTo: 'day',
  });
  const {
    shouldRenderTimeInASingleColumn,
    thresholdToRenderTimeInASingleColumn,
    views,
    timeSteps,
  } = resolveTimeViewsResponse<TDate, DateTimeRangePickerViewExternal, DateTimeRangePickerView>({
    thresholdToRenderTimeInASingleColumn: themeProps.thresholdToRenderTimeInASingleColumn,
    ampm,
    timeSteps: themeProps.timeSteps,
    views: defaultViews,
  });

  return {
    ...themeProps,
    timeSteps,
    openTo,
    shouldRenderTimeInASingleColumn,
    thresholdToRenderTimeInASingleColumn,
    views,
    ampm,
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
    disableIgnoringDatePartForTimeValidation:
      themeProps.disableIgnoringDatePartForTimeValidation ??
      Boolean(
        themeProps.minDateTime ||
          themeProps.maxDateTime ||
          // allow digital clocks to correctly check time validity: https://github.com/mui/mui-x/issues/12048
          themeProps.disablePast ||
          themeProps.disableFuture,
      ),
    slots: {
      tabs: DateTimeRangePickerTabs,
      toolbar: DateTimeRangePickerToolbar,
      ...themeProps.slots,
    },
    slotProps: {
      ...themeProps.slotProps,
      toolbar: {
        ...themeProps.slotProps?.toolbar,
        ampm,
      },
    },
  };
}
