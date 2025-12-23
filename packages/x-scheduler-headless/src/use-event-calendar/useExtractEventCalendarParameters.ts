import * as React from 'react';
import { EventCalendarParameters } from './EventCalendarStore.types';

export function useExtractEventCalendarParameters<
  TEvent extends object,
  TResource extends object,
  P extends EventCalendarParameters<TEvent, TResource>,
>(props: P): UseExtractEventCalendarParametersReturnValue<TEvent, TResource, P> {
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
    onViewChange,
    onVisibleDateChange,
    onVisibleResourcesChange,
    preferences,
    preferencesMenuConfig,
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

  const parameters: EventCalendarParameters<TEvent, TResource> = React.useMemo(
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
      onViewChange,
      onVisibleDateChange,
      onVisibleResourcesChange,
      preferences,
      preferencesMenuConfig,
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
      onViewChange,
      onVisibleDateChange,
      onVisibleResourcesChange,
      preferences,
      preferencesMenuConfig,
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
    forwardedProps: forwardedProps as Omit<P, keyof EventCalendarParameters<TEvent, TResource>>,
  };
}

interface UseExtractEventCalendarParametersReturnValue<
  TEvent extends object,
  TResource extends object,
  P extends EventCalendarParameters<TEvent, TResource>,
> {
  parameters: EventCalendarParameters<TEvent, TResource>;
  forwardedProps: Omit<P, keyof EventCalendarParameters<TEvent, TResource>>;
}
