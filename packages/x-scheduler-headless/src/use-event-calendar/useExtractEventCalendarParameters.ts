import * as React from 'react';
import { EventCalendarParameters } from './EventCalendarStore.types';

export function useExtractEventCalendarParameters<P extends EventCalendarParameters>(
  props: P,
): UseExtractEventCalendarParametersReturnValue<P> {
  const {
    events,
    onEventsChange,
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
    readonly,
    ...forwardedProps
  } = props;

  const parameters: EventCalendarParameters = React.useMemo(
    () => ({
      events,
      onEventsChange,
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
      readonly,
    }),
    [
      events,
      onEventsChange,
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
      readonly,
    ],
  );

  return { parameters, forwardedProps: forwardedProps as Omit<P, keyof EventCalendarParameters> };
}

interface UseExtractEventCalendarParametersReturnValue<P extends EventCalendarParameters> {
  parameters: EventCalendarParameters;
  forwardedProps: Omit<P, keyof EventCalendarParameters>;
}
