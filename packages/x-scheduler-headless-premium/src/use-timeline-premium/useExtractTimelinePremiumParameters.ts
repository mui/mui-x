import * as React from 'react';
import { TimelinePremiumParameters } from './TimelinePremiumStore.types';

export function useExtractTimelinePremiumParameters<
  TEvent extends object,
  TResource extends object,
  P extends TimelinePremiumParameters<TEvent, TResource>,
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

  const parameters: TimelinePremiumParameters<TEvent, TResource> = React.useMemo(
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
    forwardedProps: forwardedProps as Omit<P, keyof TimelinePremiumParameters<TEvent, TResource>>,
  };
}

interface UseExtractTimelineParametersReturnValue<
  TEvent extends object,
  TResource extends object,
  P extends TimelinePremiumParameters<TEvent, TResource>,
> {
  parameters: TimelinePremiumParameters<TEvent, TResource>;
  forwardedProps: Omit<P, keyof TimelinePremiumParameters<TEvent, TResource>>;
}
