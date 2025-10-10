import * as React from 'react';
import { TimelineParameters } from './TimelineStore.types';

export function useExtractTimelineParameters<
  EventModel extends {},
  P extends TimelineParameters<EventModel>,
>(props: P): UseExtractTimelineParametersReturnValue<EventModel, P> {
  const {
    events,
    onEventsChange,
    eventModelStructure,
    resources,
    visibleDate,
    defaultVisibleDate,
    onVisibleDateChange,
    areEventsDraggable,
    areEventsResizable,
    eventColor,
    showCurrentTimeIndicator,
    view,
    views,
    defaultView,
    onViewChange,
    preferences,
    ...forwardedProps
  } = props;

  const parameters: TimelineParameters<EventModel> = React.useMemo(
    () => ({
      events,
      onEventsChange,
      eventModelStructure,
      resources,
      visibleDate,
      defaultVisibleDate,
      onVisibleDateChange,
      areEventsDraggable,
      areEventsResizable,
      eventColor,
      showCurrentTimeIndicator,
      view,
      views,
      defaultView,
      onViewChange,
      preferences,
    }),
    [
      events,
      onEventsChange,
      eventModelStructure,
      resources,
      visibleDate,
      defaultVisibleDate,
      onVisibleDateChange,
      areEventsDraggable,
      areEventsResizable,
      eventColor,
      showCurrentTimeIndicator,
      view,
      views,
      defaultView,
      onViewChange,
      preferences,
    ],
  );

  return {
    parameters,
    forwardedProps: forwardedProps as Omit<P, keyof TimelineParameters<EventModel>>,
  };
}

interface UseExtractTimelineParametersReturnValue<
  EventModel extends {},
  P extends TimelineParameters<EventModel>,
> {
  parameters: TimelineParameters<EventModel>;
  forwardedProps: Omit<P, keyof TimelineParameters<EventModel>>;
}
