import * as React from 'react';
import type { DateOrTimeView, DateView, TimeView } from '../models/views';
import type { WrapperVariant } from '../components/wrappers/WrapperVariantContext';
import { TimeClock, TimeClockProps } from '../../TimeClock';
import { DateCalendar, DateCalendarProps } from '../../DateCalendar';

const isDatePickerView = (view: DateOrTimeView): view is DateView =>
  view === 'year' || view === 'month' || view === 'day';

const isTimePickerView = (view: DateOrTimeView): view is TimeView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

interface DateViewRendererProps<TDate>
  extends Omit<DateCalendarProps<TDate>, 'views' | 'openTo' | 'view' | 'focusedView'> {
  view: DateOrTimeView;
  views: readonly DateOrTimeView[];
  wrapperVariant: WrapperVariant;
  focusedView: DateOrTimeView | null;
}

export const renderDateView = <TDate extends unknown>(props: DateViewRendererProps<TDate>) => (
  <DateCalendar
    {...props}
    view={props.view as DateView}
    views={props.views.filter(isDatePickerView)}
    focusedView={props.focusedView as DateView | null}
  />
);

interface TimeViewRendererProps<TDate>
  extends Omit<TimeClockProps<TDate>, 'views' | 'openTo' | 'view'> {
  view: DateOrTimeView;
  views: readonly DateOrTimeView[];
  wrapperVariant: WrapperVariant;
}

export const renderTimeView = <TDate extends unknown>(props: TimeViewRendererProps<TDate>) => (
  <TimeClock<TDate>
    {...props}
    views={props.views.filter(isTimePickerView)}
    view={props.view as TimeView}
    // We don't want to pass this prop to the views because it can cause proptypes warnings
    openTo={undefined}
    // TODO: Remove when `TimeClock` will support `focusedView`
    autoFocus
  />
);
