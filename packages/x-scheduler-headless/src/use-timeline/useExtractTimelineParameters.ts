import * as React from 'react';
import { TimelineParameters } from './TimelineStore.types';

export function useExtractTimelineParameters<
  TEvent extends object,
  TResource extends object,
  P extends TimelineParameters<TEvent, TResource>,
>(props: P): UseExtractTimelineParametersReturnValue<TEvent, TResource, P> {
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
    readOnly,
    ...forwardedProps
  } = props;

  const parameters: TimelineParameters<TEvent, TResource> = React.useMemo(
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
      readOnly,
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
      readOnly,
    ],
  );

  return {
    parameters,
    forwardedProps: forwardedProps as Omit<P, keyof TimelineParameters<TEvent, TResource>>,
  };
}

interface UseExtractTimelineParametersReturnValue<
  TEvent extends object,
  TResource extends object,
  P extends TimelineParameters<TEvent, TResource>,
> {
  parameters: TimelineParameters<TEvent, TResource>;
  forwardedProps: Omit<P, keyof TimelineParameters<TEvent, TResource>>;
}
