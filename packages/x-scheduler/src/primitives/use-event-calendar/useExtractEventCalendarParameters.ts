import * as React from 'react';
import { EventCalendarParameters } from './EventCalendarStore.types';

export function useExtractEventCalendarParameters<
  EventModel extends {},
  P extends EventCalendarParameters<EventModel>,
>(props: P): UseExtractEventCalendarParametersReturnValue<EventModel, P> {
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
    preferences,
    preferencesMenuConfig,
    ampm,
    eventColor,
    showCurrentTimeIndicator,
    ...forwardedProps
  } = props;

  const parameters: EventCalendarParameters<EventModel> = React.useMemo(
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
      preferences,
      preferencesMenuConfig,
      ampm,
      eventColor,
      showCurrentTimeIndicator,
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
      preferences,
      preferencesMenuConfig,
      ampm,
      eventColor,
      showCurrentTimeIndicator,
    ],
  );

  return {
    parameters,
    forwardedProps: forwardedProps as Omit<P, keyof EventCalendarParameters<EventModel>>,
  };
}

interface UseExtractEventCalendarParametersReturnValue<
  EventModel extends {},
  P extends EventCalendarParameters<EventModel>,
> {
  parameters: EventCalendarParameters<EventModel>;
  forwardedProps: Omit<P, keyof EventCalendarParameters<EventModel>>;
}
