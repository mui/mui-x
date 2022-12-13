import * as React from 'react';
import { TimeClock, TimeClockProps, TimeView } from '../TimeClock';
import { DateOrTimeView } from '../internals';

const isTimePickerView = (view: unknown): view is TimeView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

export interface TimeViewRendererProps<TDate, TView extends DateOrTimeView>
  extends Omit<TimeClockProps<TDate>, 'views' | 'openTo' | 'view' | 'onViewChange'> {
  view: TView;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
}

export const renderTimeViewClock = <TDate extends unknown>(
  props: TimeViewRendererProps<TDate, any>,
) => (
  <TimeClock<TDate>
    {...props}
    views={props.views.filter(isTimePickerView)}
    view={props.view as TimeView}
    // We don't want to pass this prop to the views because it can cause proptypes warnings
    openTo={undefined}
  />
);
