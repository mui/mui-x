import * as React from 'react';
import { EventCalendarParameters } from './EventCalendarStore.types';

export function useExtractEventCalendarParameters<
  TEvent extends object,
  TResource extends object,
  P extends EventCalendarParameters<TEvent, TResource>,
>(props: P): UseExtractEventCalendarParametersReturnValue<TEvent, TResource, P> {
  const {
    events,
    onEventsChange,
    eventModelStructure,
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
    canDragEventsFromTheOutside,
    canDropEventsToTheOutside,
    preferences,
    preferencesMenuConfig,
    eventColor,
    showCurrentTimeIndicator,
    ...forwardedProps
  } = props;

  const parameters: EventCalendarParameters<TEvent, TResource> = React.useMemo(
    () => ({
      events,
      onEventsChange,
      eventModelStructure,
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
      canDragEventsFromTheOutside,
      canDropEventsToTheOutside,
      preferences,
      preferencesMenuConfig,
      eventColor,
      showCurrentTimeIndicator,
    }),
    [
      events,
      onEventsChange,
      eventModelStructure,
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
      canDragEventsFromTheOutside,
      canDropEventsToTheOutside,
      preferences,
      preferencesMenuConfig,
      eventColor,
      showCurrentTimeIndicator,
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
