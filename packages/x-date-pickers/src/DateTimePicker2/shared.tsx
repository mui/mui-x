import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import {
  CalendarOrClockPickerView,
  CalendarPickerView,
  ClockPickerView,
} from '../internals/models';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { ValidationCommonPropsOptionalValue } from '../internals/hooks/validation/useValidation';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import {
  CalendarPicker,
  CalendarPickerProps,
  CalendarPickerSlotsComponent,
  CalendarPickerSlotsComponentsProps,
  ExportedCalendarPickerProps,
} from '../CalendarPicker/CalendarPicker';
import {
  ClockPicker,
  ClockPickerProps,
  ClockPickerSlotsComponent,
  ClockPickerSlotsComponentsProps,
  ExportedClockPickerProps,
} from '../ClockPicker/ClockPicker';
import { BasePickerProps2 } from '../internals/models/props/basePickerProps';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { PickerViewContainer } from '../internals/components/PickerViewContainer';
import { PickerViewsRendererProps } from '../internals/hooks/usePicker/usePickerViews';
import { UsePickerProps } from '../internals/hooks/usePicker';
import { PickerViewLayout, PickerViewLayoutProps } from '../internals/components/PickerViewLayout';
import { DateTimePickerTabsProps } from '../DateTimePicker/DateTimePickerTabs';

export interface BaseDateTimePicker2SlotsComponent<TDate>
  extends Partial<CalendarPickerSlotsComponent<TDate>>,
    Partial<ClockPickerSlotsComponent> {
  /**
   * Tabs enabling toggling between date and time pickers.
   * @default DateTimePickerTabs
   */
  Tabs?: React.ElementType<unknown>;
}

export interface BaseDateTimePicker2SlotsComponentsProps<TDate>
  extends Partial<CalendarPickerSlotsComponentsProps<TDate>>,
    Partial<ClockPickerSlotsComponentsProps> {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: Omit<DateTimePickerTabsProps, 'onViewChange' | 'view'>;
}

export interface BaseDateTimePicker2Props<TDate>
  extends MakeOptional<
      BasePickerProps2<TDate | null, TDate, CalendarOrClockPickerView>,
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

  // TODO: Move logic inside `DateTimeField` if it supports the `ampm` prop.
  let inputFormat: string;
  if (themeProps.inputFormat != null) {
    inputFormat = themeProps.inputFormat;
  } else if (ampm) {
    inputFormat = utils.formats.keyboardDateTime12h;
  } else {
    inputFormat = utils.formats.keyboardDateTime24h;
  }

  return {
    ...themeProps,
    inputFormat,
    views,
    ampm,
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
  };
}

interface DateTimePickerViewsProps<TDate>
  extends Omit<BaseDateTimePicker2Props<TDate>, keyof UsePickerProps<any, any>>,
    PickerViewsRendererProps<TDate | null, CalendarOrClockPickerView, {}> {
  openTo?: CalendarOrClockPickerView;
  components?: CalendarPickerProps<TDate>['components'] &
    ClockPickerProps<TDate>['components'] &
    PickerViewLayoutProps<CalendarOrClockPickerView>['components'];
  componentsProps?: CalendarPickerProps<TDate>['componentsProps'] &
    ClockPickerProps<TDate>['componentsProps'] &
    PickerViewLayoutProps<CalendarOrClockPickerView>['componentsProps'];
}

const isDatePickerView = (view: CalendarOrClockPickerView): view is CalendarPickerView =>
  view === 'year' || view === 'month' || view === 'day';

const isTimePickerView = (view: CalendarOrClockPickerView): view is ClockPickerView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

export const renderDateTimeViews = <TDate extends unknown>(
  props: DateTimePickerViewsProps<TDate>,
) => {
  const {
    isLandscape,
    views,
    view,
    onViewChange,
    // We don't want to pass this prop to the views because it can cause proptypes warnings
    openTo,
    wrapperVariant,
    onAccept,
    onClear,
    onCancel,
    onSetToday,
    onOpen,
    onClose,
    onDismiss,
    components,
    componentsProps,
    ...other
  } = props;

  return (
    <PickerViewContainer isLandscape={isLandscape}>
      <PickerViewLayout
        wrapperVariant={wrapperVariant}
        onOpen={onOpen}
        onClose={onClose}
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
        onDismiss={onDismiss}
        components={components}
        componentsProps={componentsProps}
        view={view}
        onViewChange={onViewChange}
      >
        {isDatePickerView(view) && (
          <CalendarPicker
            views={views.filter(isDatePickerView)}
            onViewChange={onViewChange as (view: CalendarPickerView) => void}
            view={view}
            components={components}
            componentsProps={componentsProps}
            // focusedView={focusedView}
            // onFocusedViewChange={setFocusedView}
            {...other}
          />
        )}
        {isTimePickerView(view) && (
          <ClockPicker
            {...other}
            views={views.filter(isTimePickerView)}
            onViewChange={onViewChange as (view: ClockPickerView) => void}
            view={view}
            components={components}
            componentsProps={componentsProps}
            // showViewSwitcher={wrapperVariant === 'desktop'}
          />
        )}
      </PickerViewLayout>
    </PickerViewContainer>
  );
};
