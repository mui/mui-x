import * as React from 'react';
import { DefaultizedProps } from '@mui/x-internals/types';
import { useThemeProps } from '@mui/material/styles';
import { LocalizedComponent } from '@mui/x-date-pickers/locales';
import {
  useDefaultDates,
  useUtils,
  applyDefaultDate,
  BasePickerInputProps,
  PickerViewRendererLookup,
  BaseClockProps,
  DesktopOnlyTimePickerProps,
  applyDefaultViewProps,
  TimeViewWithMeridiem,
  resolveTimeViewsResponse,
  UseViewsOptions,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { TimeViewRendererProps } from '@mui/x-date-pickers/timeViewRenderers';
import { DigitalClockSlots, DigitalClockSlotProps } from '@mui/x-date-pickers/DigitalClock';
import {
  MultiSectionDigitalClockSlots,
  MultiSectionDigitalClockSlotProps,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { DateTimeRangeValidationError } from '../models';
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
import {
  ExportedValidateDateTimeRangeProps,
  ValidateDateTimeRangePropsToDefault,
} from '../validation/validateDateTimeRange';

export interface BaseDateTimeRangePickerSlots
  extends DateRangeCalendarSlots,
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
  toolbar?: React.JSXElementConstructor<DateTimeRangePickerToolbarProps>;
}

export interface BaseDateTimeRangePickerSlotProps
  extends DateRangeCalendarSlotProps,
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
  TView extends DateOrTimeViewWithMeridiem,
  TAdditionalProps extends {} = {},
> = PickerViewRendererLookup<
  PickerRangeValue,
  TView,
  Omit<DateRangeViewRendererProps<'day'>, 'view' | 'slots' | 'slotProps'> &
    Omit<
      TimeViewRendererProps<TimeViewWithMeridiem, BaseClockProps<TimeViewWithMeridiem>>,
      'view' | 'slots' | 'slotProps'
    > & { view: TView },
  TAdditionalProps
>;

export interface BaseDateTimeRangePickerProps
  extends Omit<
      BasePickerInputProps<PickerRangeValue, DateTimeRangePickerView, DateTimeRangeValidationError>,
      'orientation' | 'views' | 'openTo'
    >,
    ExportedDateRangeCalendarProps,
    ExportedValidateDateTimeRangeProps,
    DesktopOnlyTimePickerProps,
    Partial<
      Pick<UseViewsOptions<PickerRangeValue, DateTimeRangePickerViewExternal>, 'openTo' | 'views'>
    > {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseDateTimeRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseDateTimeRangePickerSlotProps;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers?: Partial<DateTimeRangePickerRenderers<DateTimeRangePickerView>>;
}

type UseDateTimeRangePickerDefaultizedProps<Props extends BaseDateTimeRangePickerProps> =
  LocalizedComponent<
    Omit<DefaultizedProps<Props, 'openTo' | 'ampm' | ValidateDateTimeRangePropsToDefault>, 'views'>
  > & {
    shouldRenderTimeInASingleColumn: boolean;
    views: readonly DateTimeRangePickerView[];
  };

export function useDateTimeRangePickerDefaultizedProps<Props extends BaseDateTimeRangePickerProps>(
  props: Props,
  name: string,
): UseDateTimeRangePickerDefaultizedProps<Props> {
  const utils = useUtils();
  const defaultDates = useDefaultDates();
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
  } = resolveTimeViewsResponse<DateTimeRangePickerViewExternal, DateTimeRangePickerView>({
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
