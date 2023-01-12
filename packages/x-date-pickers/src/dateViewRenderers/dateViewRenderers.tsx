import * as React from 'react';
import { DateCalendar, DateCalendarProps } from '../DateCalendar';
import { DateOrTimeView, DateView } from '../internals';

const isDatePickerView = (view: unknown): view is DateView =>
  view === 'year' || view === 'month' || view === 'day';

export interface DateViewRendererProps<TDate, TView extends DateOrTimeView>
  extends Omit<
    DateCalendarProps<TDate>,
    'views' | 'openTo' | 'view' | 'onViewChange' | 'focusedView'
  > {
  view: TView;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
  focusedView: TView | null;
}

export const renderDateViewCalendar = <TDate extends unknown>(
  props: DateViewRendererProps<TDate, any>,
) => (
  <DateCalendar
    {...props}
    view={props.view as DateView}
    views={props.views.filter(isDatePickerView)}
    focusedView={props.focusedView as DateView | null}
  />
);
