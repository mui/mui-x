import * as React from 'react';
import type {
  CalendarOrClockPickerView,
  CalendarPickerView,
  ClockPickerView,
} from '../models/views';
import type { WrapperVariant } from '../components/wrappers/WrapperVariantContext';
import { ClockPicker, ClockPickerProps } from '../../ClockPicker';
import { DateCalendar, DateCalendarProps } from '../../DateCalendar';

const isDatePickerView = (view: CalendarOrClockPickerView): view is CalendarPickerView =>
  view === 'year' || view === 'month' || view === 'day';

const isTimePickerView = (view: CalendarOrClockPickerView): view is ClockPickerView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

interface DateViewRendererProps<TDate>
  extends Omit<DateCalendarProps<TDate>, 'views' | 'openTo' | 'view' | 'focusedView'> {
  view: CalendarOrClockPickerView;
  views: readonly CalendarOrClockPickerView[];
  wrapperVariant: WrapperVariant;
  focusedView: CalendarOrClockPickerView | null;
}

export const renderDateView = <TDate extends unknown>(props: DateViewRendererProps<TDate>) => (
  <DateCalendar
    {...props}
    autoFocus
    view={props.view as CalendarPickerView}
    views={props.views.filter(isDatePickerView)}
    focusedView={props.focusedView as CalendarPickerView | null}
  />
);

interface TimeViewRendererProps<TDate>
  extends Omit<ClockPickerProps<TDate>, 'views' | 'openTo' | 'view'> {
  view: CalendarOrClockPickerView;
  views: readonly CalendarOrClockPickerView[];
  wrapperVariant: WrapperVariant;
}

export const renderTimeView = <TDate extends unknown>(props: TimeViewRendererProps<TDate>) => (
  <ClockPicker<TDate>
    {...props}
    autoFocus
    views={props.views.filter(isTimePickerView)}
    view={props.view as ClockPickerView}
    // We don't want to pass this prop to the views because it can cause proptypes warnings
    openTo={undefined}
  />
);
