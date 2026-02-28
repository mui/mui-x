import * as React from 'react';
import { EventTimelinePremiumParameters } from './EventTimelinePremiumStore.types';

export function useExtractEventTimelinePremiumParameters<
  TEvent extends object,
  TResource extends object,
  P extends EventTimelinePremiumParameters<TEvent, TResource>,
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

  const parameters: EventTimelinePremiumParameters<TEvent, TResource> = React.useMemo(
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
    forwardedProps: forwardedProps as Omit<
      P,
      keyof EventTimelinePremiumParameters<TEvent, TResource>
    >,
  };
}

interface UseExtractTimelineParametersReturnValue<
  TEvent extends object,
  TResource extends object,
  P extends EventTimelinePremiumParameters<TEvent, TResource>,
> {
  parameters: EventTimelinePremiumParameters<TEvent, TResource>;
  forwardedProps: Omit<P, keyof EventTimelinePremiumParameters<TEvent, TResource>>;
}
