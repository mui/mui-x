import * as React from 'react';
import { DefaultizedProps } from '../internals/models/helpers';
import { DateTimeValidationError, PickerValidDate } from '../models';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import {
  DateCalendarSlots,
  DateCalendarSlotProps,
  ExportedDateCalendarProps,
} from '../DateCalendar/DateCalendar.types';
import { TimeClockSlots, TimeClockSlotProps } from '../TimeClock/TimeClock.types';
import { BasePickerInputProps } from '../internals/models/props/basePickerProps';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  DateTimePickerTabs,
  DateTimePickerTabsProps,
  ExportedDateTimePickerTabsProps,
} from './DateTimePickerTabs';
import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  DateTimeValidationProps,
} from '../internals/models/validation';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';
import {
  DateTimePickerToolbar,
  DateTimePickerToolbarProps,
  ExportedDateTimePickerToolbarProps,
} from './DateTimePickerToolbar';
import { PickerViewRendererLookup } from '../internals/hooks/usePicker/usePickerViews';
import { DateViewRendererProps } from '../dateViewRenderers';
import { TimeViewRendererProps } from '../timeViewRenderers';
import { applyDefaultViewProps } from '../internals/utils/views';
import { BaseClockProps, ExportedBaseClockProps } from '../internals/models/props/clock';
import { DateOrTimeViewWithMeridiem, TimeViewWithMeridiem } from '../internals/models';

export interface BaseDateTimePickerSlots<TDate extends PickerValidDate>
  extends DateCalendarSlots<TDate>,
    TimeClockSlots {
  /**
   * Tabs enabling toggling between date and time pickers.
   * @default DateTimePickerTabs
   */
  tabs?: React.ElementType<DateTimePickerTabsProps>;
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimePickerToolbar
   */
  toolbar?: React.JSXElementConstructor<DateTimePickerToolbarProps<TDate>>;
}

export interface BaseDateTimePickerSlotProps<TDate extends PickerValidDate>
  extends DateCalendarSlotProps<TDate>,
    TimeClockSlotProps {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedDateTimePickerTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedDateTimePickerToolbarProps;
}

export type DateTimePickerViewRenderers<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  TAdditionalProps extends {} = {},
> = PickerViewRendererLookup<
  TDate | null,
  TView,
  Omit<DateViewRendererProps<TDate, TView>, 'slots' | 'slotProps'> &
    Omit<
      TimeViewRendererProps<TimeViewWithMeridiem, BaseClockProps<TDate, TimeViewWithMeridiem>>,
      'slots' | 'slotProps'
    >,
  TAdditionalProps
>;

export interface BaseDateTimePickerProps<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends BasePickerInputProps<TDate | null, TDate, TView, DateTimeValidationError>,
    Omit<ExportedDateCalendarProps<TDate>, 'onViewChange'>,
    ExportedBaseClockProps<TDate>,
    DateTimeValidationProps<TDate> {
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default true on desktop, false on mobile
   */
  ampmInClock?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseDateTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseDateTimePickerSlotProps<TDate>;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers?: Partial<DateTimePickerViewRenderers<TDate, TView>>;
}

type UseDateTimePickerDefaultizedProps<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  Props extends BaseDateTimePickerProps<TDate, TView>,
> = LocalizedComponent<
  TDate,
  DefaultizedProps<
    Props,
    | 'views'
    | 'openTo'
    | 'orientation'
    | 'ampm'
    | keyof BaseDateValidationProps<TDate>
    | keyof BaseTimeValidationProps
  >
>;

export function useDateTimePickerDefaultizedProps<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  Props extends BaseDateTimePickerProps<TDate, TView>,
>(props: Props): UseDateTimePickerDefaultizedProps<TDate, TView, Props> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (props.localeText?.toolbarTitle == null) {
      return props.localeText;
    }

    return {
      ...props.localeText,
      dateTimePickerToolbarTitle: props.localeText.toolbarTitle,
    };
  }, [props.localeText]);

  return {
    ...props,
    ...applyDefaultViewProps({
      views: props.views,
      openTo: props.openTo,
      defaultViews: ['year', 'day', 'hours', 'minutes'] as TView[],
      defaultOpenTo: 'day' as TView,
    }),
    ampm,
    localeText,
    orientation: props.orientation ?? 'portrait',
    // TODO: Remove from public API
    disableIgnoringDatePartForTimeValidation:
      props.disableIgnoringDatePartForTimeValidation ??
      Boolean(
        props.minDateTime ||
          props.maxDateTime ||
          // allow time clock to correctly check time validity: https://github.com/mui/mui-x/issues/8520
          props.disablePast ||
          props.disableFuture,
      ),
    disableFuture: props.disableFuture ?? false,
    disablePast: props.disablePast ?? false,
    minDate: applyDefaultDate(utils, props.minDateTime ?? props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDateTime ?? props.maxDate, defaultDates.maxDate),
    minTime: props.minDateTime ?? props.minTime,
    maxTime: props.maxDateTime ?? props.maxTime,
    slots: {
      toolbar: DateTimePickerToolbar,
      tabs: DateTimePickerTabs,
      ...props.slots,
    },
    slotProps: {
      ...props.slotProps,
      toolbar: {
        ampm,
        ...props.slotProps?.toolbar,
      },
    },
  };
}
