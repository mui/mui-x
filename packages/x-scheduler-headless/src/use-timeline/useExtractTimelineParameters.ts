import * as React from 'react';
import { TimelineParameters } from './TimelineStore.types';

export function useExtractTimelineParameters<
  TEvent extends object,
  TResource extends object,
  P extends TimelineParameters<TEvent, TResource>,
>(props: P): UseExtractTimelineParametersReturnValue<TEvent, TResource, P> {
  const {
    areEventsDraggable,
    areEventsResizable,
    canDragEventsFromTheOutside,
    canDropEventsToTheOutside,
    defaultPreferences,
    defaultView,
    defaultVisibleDate,
    eventColor,
    eventModelStructure,
    events,
    onEventsChange,
    onPreferencesChange,
    onViewChange,
    onVisibleDateChange,
    preferences,
    readOnly,
    resources,
    showCurrentTimeIndicator,
    view,
    views,
    visibleDate,
    ...forwardedProps
  } = props;

  const parameters: TimelineParameters<TEvent, TResource> = React.useMemo(
    () => ({
      areEventsDraggable,
      areEventsResizable,
      canDragEventsFromTheOutside,
      canDropEventsToTheOutside,
      defaultPreferences,
      defaultView,
      defaultVisibleDate,
      eventColor,
      eventModelStructure,
      events,
      onEventsChange,
      onPreferencesChange,
      onViewChange,
      onVisibleDateChange,
      preferences,
      readOnly,
      resources,
      showCurrentTimeIndicator,
      view,
      views,
      visibleDate,
    }),
    [
      events,
      onEventsChange,
      eventModelStructure,
      resources,
      visibleDate,
      defaultPreferences,
      defaultVisibleDate,
      onVisibleDateChange,
      areEventsDraggable,
      areEventsResizable,
      canDragEventsFromTheOutside,
      canDropEventsToTheOutside,
      eventColor,
      showCurrentTimeIndicator,
      view,
      views,
      defaultView,
      onViewChange,
      preferences,
      onPreferencesChange,
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
