/* eslint-disable react-compiler/react-compiler -- intentional `react-hooks/exhaustive-deps` disable below */
import * as React from 'react';
import type { EventCalendarParameters } from './EventCalendarStore.types';

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
    collapsedResources,
    dateLocale,
    defaultCollapsedResources,
    defaultPreferences,
    defaultView,
    defaultVisibleDate,
    defaultVisibleResources,
    displayTimezone,
    eventColor,
    eventCreation,
    eventModelStructure,
    events,
    onCollapsedResourcesChange,
    onEventsChange,
    onViewChange,
    onVisibleDateChange,
    onVisibleResourcesChange,
    preferences,
    preferencesMenuConfig,
    readOnly,
    dataSource,
    shouldEventRequireResource,
    resourceModelStructure,
    resources,
    showCurrentTimeIndicator,
    view,
    viewConfig,
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
      collapsedResources,
      dateLocale,
      defaultCollapsedResources,
      defaultPreferences,
      defaultView,
      defaultVisibleDate,
      defaultVisibleResources,
      displayTimezone,
      eventColor,
      eventCreation,
      eventModelStructure,
      events,
      onCollapsedResourcesChange,
      onEventsChange,
      onViewChange,
      onVisibleDateChange,
      onVisibleResourcesChange,
      preferences,
      preferencesMenuConfig,
      readOnly,
      dataSource,
      shouldEventRequireResource,
      resourceModelStructure,
      resources,
      showCurrentTimeIndicator,
      view,
      viewConfig,
      views,
      visibleDate,
      visibleResources,
    }),
    // `dataSource` is intentionally excluded. It's re-read on every fetch, but the
    // cache + dataManager are pinned to the original instance, so runtime swaps are
    // only partially reactive — consumers should remount to swap. Including it in
    // deps would invalidate the memo every render for inline `{ getEvents, persistEvents }`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      areEventsDraggable,
      areEventsResizable,
      canDragEventsFromTheOutside,
      canDropEventsToTheOutside,
      collapsedResources,
      dateLocale,
      defaultCollapsedResources,
      defaultPreferences,
      defaultView,
      defaultVisibleDate,
      defaultVisibleResources,
      displayTimezone,
      eventColor,
      eventCreation,
      eventModelStructure,
      events,
      onCollapsedResourcesChange,
      onEventsChange,
      onViewChange,
      onVisibleDateChange,
      onVisibleResourcesChange,
      preferences,
      preferencesMenuConfig,
      readOnly,
      shouldEventRequireResource,
      resourceModelStructure,
      resources,
      showCurrentTimeIndicator,
      view,
      viewConfig,
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
