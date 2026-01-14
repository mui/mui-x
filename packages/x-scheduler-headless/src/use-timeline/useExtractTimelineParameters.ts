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
    defaultVisibleResources,
    displayTimezone,
    eventColor,
    eventCreation,
    eventModelStructure,
    events,
    onEventsChange,
    onPreferencesChange,
    onViewChange,
    onVisibleDateChange,
    onVisibleResourcesChange,
    preferences,
    readOnly,
    resourceModelStructure,
    resources,
    showCurrentTimeIndicator,
    view,
    views,
    visibleDate,
    visibleResources,
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
      defaultVisibleResources,
      displayTimezone,
      eventColor,
      eventCreation,
      eventModelStructure,
      events,
      onEventsChange,
      onPreferencesChange,
      onViewChange,
      onVisibleDateChange,
      onVisibleResourcesChange,
      preferences,
      readOnly,
      resourceModelStructure,
      resources,
      showCurrentTimeIndicator,
      view,
      views,
      visibleDate,
      visibleResources,
    }),
    [
      areEventsDraggable,
      areEventsResizable,
      canDragEventsFromTheOutside,
      canDropEventsToTheOutside,
      defaultPreferences,
      defaultView,
      defaultVisibleDate,
      defaultVisibleResources,
      displayTimezone,
      eventColor,
      eventCreation,
      eventModelStructure,
      events,
      onEventsChange,
      onPreferencesChange,
      onViewChange,
      onVisibleDateChange,
      onVisibleResourcesChange,
      preferences,
      readOnly,
      resourceModelStructure,
      resources,
      showCurrentTimeIndicator,
      view,
      views,
      visibleDate,
      visibleResources,
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
