import * as React from 'react';
import { EventCalendarParameters } from './useEventCalendar.types';

export function useExtractEventCalendarParameters<P extends EventCalendarParameters>(
  props: P,
): UseExtractEventCalendarParametersReturnValue<P> {
  const {
    events,
    onEventsChange,
    resources,
    view,
    defaultView,
    onViewChange,
    views,
    visibleDate,
    defaultVisibleDate,
    onVisibleDateChange,
    areEventsDraggable,
    areEventsResizable,
    ampm,
    ...forwardedProps
  } = props;

  const parameters: EventCalendarParameters = React.useMemo(
    () => ({
      events,
      onEventsChange,
      resources,
      view,
      defaultView,
      onViewChange,
      views,
      visibleDate,
      defaultVisibleDate,
      onVisibleDateChange,
      areEventsDraggable,
      areEventsResizable,
      ampm,
    }),
    [
      events,
      onEventsChange,
      resources,
      view,
      defaultView,
      onViewChange,
      views,
      visibleDate,
      defaultVisibleDate,
      onVisibleDateChange,
      areEventsDraggable,
      areEventsResizable,
      ampm,
    ],
  );

  return { parameters, forwardedProps: forwardedProps as Omit<P, keyof EventCalendarParameters> };
}

interface UseExtractEventCalendarParametersReturnValue<P extends EventCalendarParameters> {
  parameters: EventCalendarParameters;
  forwardedProps: Omit<P, keyof EventCalendarParameters>;
}
