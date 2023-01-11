import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps } from '../internals/models/helpers';
import { DateOrTimeView } from '../internals/models';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import {
  DateCalendarSlotsComponent,
  DateCalendarSlotsComponentsProps,
  ExportedDateCalendarProps,
} from '../DateCalendar/DateCalendar.types';
import {
  TimeClockSlotsComponent,
  TimeClockSlotsComponentsProps,
  ExportedTimeClockProps,
} from '../TimeClock/TimeClock.types';
import { BaseNextPickerInputProps } from '../internals/models/props/basePickerProps';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  DateTimePickerTabs,
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
import { DateTimeValidationError } from '../internals/hooks/validation/useDateTimeValidation';
import { PickerViewRendererLookup } from '../internals/hooks/usePicker/usePickerViews';
import { DateViewRendererProps } from '../dateViewRenderers';
import { TimeViewRendererProps } from '../timeViewRenderers';
import { applyDefaultViewProps } from '../internals/utils/views';
import { uncapitalizeObjectKeys, UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface BaseNextDateTimePickerSlotsComponent<TDate>
  extends DateCalendarSlotsComponent<TDate>,
    TimeClockSlotsComponent {
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
    TimeClockSlotsComponentsProps {
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
  extends BaseNextPickerInputProps<TDate | null, TDate, DateOrTimeView, DateTimeValidationError>,
    Omit<ExportedDateCalendarProps<TDate>, 'onViewChange'>,
    ExportedTimeClockProps<TDate> {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime?: TDate;
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime?: TDate;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots` with uncapitalized properties.
   */
  components?: BaseNextDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotsProps`
   */
  componentsProps?: BaseNextDateTimePickerSlotsComponentsProps<TDate>;
  /**
  * Overrideable component slots.
  * @default {}
   */
  slots?: UncapitalizeObjectKeys<BaseNextDateTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: BaseNextDateTimePickerSlotsComponentsProps<TDate>;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<
      TDate | null,
      DateOrTimeView,
      DateViewRendererProps<TDate, DateOrTimeView> & TimeViewRendererProps<TDate, DateOrTimeView>,
      {}
    >
  >;
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
    | keyof BaseDateValidationProps<TDate>
    | keyof BaseTimeValidationProps
  >
>;

export function useNextDateTimePickerDefaultizedProps<
  TDate,
  Props extends BaseNextDateTimePickerProps<TDate>,
>(
  props: Props,
  name: string,
): Omit<UseNextDateTimePickerDefaultizedProps<TDate, Props>, 'components' | 'componentsProps'> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      dateTimePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  const slots = themeProps.slots ?? uncapitalizeObjectKeys(themeProps.components);
  const slotsProps = themeProps.slotsProps ?? themeProps.componentsProps;
  return {
    ...themeProps,
    ...applyDefaultViewProps({
      views: themeProps.views,
      openTo: themeProps.openTo,
      defaultViews: ['year', 'day', 'hours', 'minutes'],
      defaultOpenTo: 'day',
    }),
    ampm,
    localeText,
    orientation: themeProps.orientation ?? 'portrait',
    ampmInClock: themeProps.ampmInClock ?? true,
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
    slots: {
      toolbar: DateTimePickerToolbar,
      tabs: DateTimePickerTabs,
      ...slots,
    },
    slotsProps: {
      ...slotsProps,
      toolbar: {
        ampm,
        ampmInClock: themeProps.ampmInClock,
        ...slotsProps?.toolbar,
      },
    },
  };
}
