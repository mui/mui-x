import * as React from 'react';
import { CalendarOrClockPickerView, CalendarPickerView, ClockPickerView } from '../models/views';
import { ClockPicker, ClockPickerProps } from '../../ClockPicker';
import { DateCalendar, DateCalendarProps } from '../../DateCalendar';
import { WrapperVariant } from '../components/wrappers/WrapperVariantContext';

export const isYearOnlyView = (
  views: readonly CalendarPickerView[],
): views is ReadonlyArray<'year'> => views.length === 1 && views[0] === 'year';

export const isYearAndMonthViews = (
  views: readonly CalendarPickerView[],
): views is ReadonlyArray<'month' | 'year'> =>
  views.length === 2 && views.indexOf('month') !== -1 && views.indexOf('year') !== -1;

const isDatePickerView = (view: CalendarOrClockPickerView): view is CalendarPickerView =>
  view === 'year' || view === 'month' || view === 'day';

const isTimePickerView = (view: CalendarOrClockPickerView): view is ClockPickerView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

interface DateViewRendererProps<TDate>
  extends Omit<DateCalendarProps<TDate>, 'views' | 'openTo' | 'view'> {
  view: CalendarOrClockPickerView;
  views: readonly CalendarOrClockPickerView[];
  wrapperVariant: WrapperVariant;
}

export const renderDateView = <TDate extends unknown>(props: DateViewRendererProps<TDate>) => (
  <DateCalendar
    {...props}
    autoFocus
    view={props.view as CalendarPickerView}
    views={props.views.filter(isDatePickerView)}
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
    showViewSwitcher={props.wrapperVariant === 'desktop'}
    views={props.views.filter(isTimePickerView)}
    view={props.view as ClockPickerView}
    // We don't want to pass this prop to the views because it can cause proptypes warnings
    openTo={undefined}
  />
);
