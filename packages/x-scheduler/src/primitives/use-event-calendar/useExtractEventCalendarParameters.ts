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
    preferences,
    preferencesMenuConfig,
    ampm,
    eventColor,
    showCurrentTimeIndicator,
    isSidePanelOpen,
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
      preferences,
      preferencesMenuConfig,
      ampm,
      eventColor,
      showCurrentTimeIndicator,
      isSidePanelOpen,
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
      preferences,
      preferencesMenuConfig,
      ampm,
      eventColor,
      showCurrentTimeIndicator,
      isSidePanelOpen,
    ],
  );

  return { parameters, forwardedProps: forwardedProps as Omit<P, keyof EventCalendarParameters> };
}

interface UseExtractEventCalendarParametersReturnValue<P extends EventCalendarParameters> {
  parameters: EventCalendarParameters;
  forwardedProps: Omit<P, keyof EventCalendarParameters>;
}
