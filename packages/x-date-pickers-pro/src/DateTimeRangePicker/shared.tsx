import type * as React from 'react';
import { type DefaultizedProps } from '@mui/x-internals/types';
import { useThemeProps } from '@mui/material/styles';
import { type LocalizedComponent } from '@mui/x-date-pickers/locales';
import {
  type BasePickerInputProps,
  type PickerViewRendererLookup,
  type BaseClockProps,
  type DigitalTimePickerProps,
  applyDefaultViewProps,
  type TimeViewWithMeridiem,
  resolveTimeViewsResponse,
  type UseViewsOptions,
  type DateOrTimeViewWithMeridiem,
  type PickerRangeValue,
  useApplyDefaultValuesToDateTimeValidationProps,
} from '@mui/x-date-pickers/internals';
import { type TimeViewRendererProps } from '@mui/x-date-pickers/timeViewRenderers';
import {
  type DigitalClockSlots,
  type DigitalClockSlotProps,
} from '@mui/x-date-pickers/DigitalClock';
import {
  type MultiSectionDigitalClockSlots,
  type MultiSectionDigitalClockSlotProps,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { usePickerAdapter } from '@mui/x-date-pickers/hooks';
import { type DateTimeRangeValidationError } from '../models';
import {
  type DateTimeRangePickerView,
  type DateTimeRangePickerViewExternal,
} from '../internals/models';
import {
  type DateRangeCalendarSlots,
  type DateRangeCalendarSlotProps,
  type ExportedDateRangeCalendarProps,
} from '../DateRangeCalendar';
import {
  DateTimeRangePickerToolbar,
  type DateTimeRangePickerToolbarProps,
  type ExportedDateTimeRangePickerToolbarProps,
} from './DateTimeRangePickerToolbar';
import { type DateRangeViewRendererProps } from '../dateRangeViewRenderers';
import {
  DateTimeRangePickerTabs,
  type DateTimeRangePickerTabsProps,
  type ExportedDateTimeRangePickerTabsProps,
} from './DateTimeRangePickerTabs';
import {
  type ExportedValidateDateTimeRangeProps,
  type ValidateDateTimeRangePropsToDefault,
} from '../validation/validateDateTimeRange';

export interface BaseDateTimeRangePickerSlots
  extends DateRangeCalendarSlots, DigitalClockSlots, MultiSectionDigitalClockSlots {
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
  extends DateRangeCalendarSlotProps, DigitalClockSlotProps, MultiSectionDigitalClockSlotProps {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedDateTimeRangePickerTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedDateTimeRangePickerToolbarProps;
}

type DateTimeRangePickerRenderers<TView extends DateOrTimeViewWithMeridiem> =
  PickerViewRendererLookup<
    PickerRangeValue,
    TView,
    Omit<DateRangeViewRendererProps<'day'>, 'view' | 'slots' | 'slotProps'> &
      Omit<
        TimeViewRendererProps<TimeViewWithMeridiem, BaseClockProps<TimeViewWithMeridiem>>,
        'view' | 'slots' | 'slotProps'
      > & { view: TView }
  >;

export interface BaseDateTimeRangePickerProps
  extends
    Omit<
      BasePickerInputProps<PickerRangeValue, DateTimeRangePickerView, DateTimeRangeValidationError>,
      'orientation' | 'views' | 'openTo'
    >,
    ExportedDateRangeCalendarProps,
    ExportedValidateDateTimeRangeProps,
    DigitalTimePickerProps,
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
    viewsForFormatting: readonly DateOrTimeViewWithMeridiem[];
  };

export function useDateTimeRangePickerDefaultizedProps<Props extends BaseDateTimeRangePickerProps>(
  props: Props,
  name: string,
): UseDateTimeRangePickerDefaultizedProps<Props> {
  const adapter = usePickerAdapter();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const validationProps = useApplyDefaultValuesToDateTimeValidationProps(themeProps);
  const ampm = themeProps.ampm ?? adapter.is12HourCycleInCurrentLocale();

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

  // Keep the original views for format calculation (before filtering)
  const viewsForFormatting: readonly DateOrTimeViewWithMeridiem[] = ampm
    ? [...defaultViews, 'meridiem']
    : defaultViews;

  return {
    ...themeProps,
    ...validationProps,
    timeSteps,
    openTo,
    shouldRenderTimeInASingleColumn,
    thresholdToRenderTimeInASingleColumn,
    views,
    viewsForFormatting,
    ampm,
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
