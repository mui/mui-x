/* eslint-disable react-compiler/react-compiler -- intentional `react-hooks/exhaustive-deps` disable below */
import * as React from 'react';
import type { EventTimelinePremiumParameters } from './EventTimelinePremiumStore.types';

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
    collapsedResources,
    dataSource,
    dateLocale,
    defaultCollapsedResources,
    defaultPreferences,
    defaultPreset,
    defaultVisibleDate,
    defaultVisibleResources,
    displayTimezone,
    eventColor,
    eventCreation,
    eventModelStructure,
    events,
    onCollapsedResourcesChange,
    onEventsChange,
    onPresetChange,
    onVisibleDateChange,
    onVisibleResourcesChange,
    preferences,
    preset,
    presetConfig,
    presets,
    readOnly,
    shouldEventRequireResource,
    resourceModelStructure,
    resources,
    showCurrentTimeIndicator,
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
      collapsedResources,
      dataSource,
      dateLocale,
      defaultCollapsedResources,
      defaultPreferences,
      defaultPreset,
      defaultVisibleDate,
      defaultVisibleResources,
      displayTimezone,
      eventColor,
      eventCreation,
      eventModelStructure,
      events,
      onCollapsedResourcesChange,
      onEventsChange,
      onPresetChange,
      onVisibleDateChange,
      onVisibleResourcesChange,
      preferences,
      preset,
      presetConfig,
      presets,
      readOnly,
      shouldEventRequireResource,
      resourceModelStructure,
      resources,
      showCurrentTimeIndicator,
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
      defaultPreset,
      defaultVisibleDate,
      defaultVisibleResources,
      displayTimezone,
      eventColor,
      eventCreation,
      eventModelStructure,
      events,
      onCollapsedResourcesChange,
      onEventsChange,
      onPresetChange,
      onVisibleDateChange,
      onVisibleResourcesChange,
      preferences,
      preset,
      presetConfig,
      presets,
      readOnly,
      shouldEventRequireResource,
      resourceModelStructure,
      resources,
      showCurrentTimeIndicator,
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
