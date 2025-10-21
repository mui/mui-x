import * as React from 'react';
import { TimelineParameters } from './TimelineStore.types';

export function useExtractTimelineParameters<P extends TimelineParameters>(
  props: P,
): UseExtractTimelineParametersReturnValue<P> {
  const {
    events,
    onEventsChange,
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

  const parameters: TimelineParameters = React.useMemo(
    () => ({
      events,
      onEventsChange,
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

  return { parameters, forwardedProps: forwardedProps as Omit<P, keyof TimelineParameters> };
}

interface UseExtractTimelineParametersReturnValue<P extends TimelineParameters> {
  parameters: TimelineParameters;
  forwardedProps: Omit<P, keyof TimelineParameters>;
}
