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
    eventColor,
    eventCreation,
    eventModelStructure,
    events,
    onEventsChange,
    onViewChange,
    onVisibleDateChange,
    preferences,
    preferencesMenuConfig,
    readOnly,
    resources,
    showCurrentTimeIndicator,
    view,
    views,
    visibleDate,
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
      eventColor,
      eventModelStructure,
      events,
      onEventsChange,
      onViewChange,
      onVisibleDateChange,
      preferences,
      preferencesMenuConfig,
      eventColor,
      eventCreation,
      showCurrentTimeIndicator,
      readOnly,
      resources,
      showCurrentTimeIndicator,
      view,
      views,
      visibleDate,
    }),
    [
      areEventsDraggable,
      areEventsResizable,
      canDragEventsFromTheOutside,
      canDropEventsToTheOutside,
      defaultPreferences,
      defaultView,
      defaultVisibleDate,
      eventColor,
      eventCreation,
      eventModelStructure,
      events,
      onEventsChange,
      onViewChange,
      onVisibleDateChange,
      preferences,
      preferencesMenuConfig,
      readOnly,
      resources,
      showCurrentTimeIndicator,
      view,
      views,
      visibleDate,
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
