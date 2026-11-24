import { renderHook } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { useExtractEventTimelinePremiumParameters } from '../useExtractEventTimelinePremiumParameters';
import type { EventTimelinePremiumParameters } from '../EventTimelinePremiumStore.types';

// One entry per parameter. TypeScript fails if a key is added to the type but not here.
// The values are irrelevant, the hooks only route keys.
const allParameters: Record<keyof EventTimelinePremiumParameters<any, any>, unknown> = {
  areEventsDraggable: 'areEventsDraggable',
  areEventsResizable: 'areEventsResizable',
  canDragEventsFromTheOutside: 'canDragEventsFromTheOutside',
  canDropEventsToTheOutside: 'canDropEventsToTheOutside',
  collapsedResources: 'collapsedResources',
  dataSource: 'dataSource',
  dateLocale: 'dateLocale',
  defaultCollapsedResources: 'defaultCollapsedResources',
  defaultPreferences: 'defaultPreferences',
  defaultPreset: 'defaultPreset',
  defaultVisibleDate: 'defaultVisibleDate',
  defaultVisibleResources: 'defaultVisibleResources',
  dependencies: 'dependencies',
  displayTimezone: 'displayTimezone',
  eventColor: 'eventColor',
  eventCreation: 'eventCreation',
  eventDeletion: 'eventDeletion',
  eventModelStructure: 'eventModelStructure',
  events: 'events',
  onCollapsedResourcesChange: 'onCollapsedResourcesChange',
  onDependenciesChange: 'onDependenciesChange',
  onEventEditingStart: 'onEventEditingStart',
  onEventsChange: 'onEventsChange',
  onPresetChange: 'onPresetChange',
  onVisibleDateChange: 'onVisibleDateChange',
  onVisibleResourcesChange: 'onVisibleResourcesChange',
  preferences: 'preferences',
  preset: 'preset',
  presetConfig: 'presetConfig',
  presets: 'presets',
  readOnly: 'readOnly',
  resourceModelStructure: 'resourceModelStructure',
  resources: 'resources',
  shouldEventRequireResource: 'shouldEventRequireResource',
  showCurrentTimeIndicator: 'showCurrentTimeIndicator',
  visibleDate: 'visibleDate',
  visibleResources: 'visibleResources',
};

describe('useExtractEventTimelinePremiumParameters', () => {
  it('should route every parameter to the parameters object and none to the forwarded props', () => {
    const { result } = renderHook(() =>
      useExtractEventTimelinePremiumParameters({
        ...(allParameters as EventTimelinePremiumParameters<any, any>),
        'data-testid': 'forwarded',
      }),
    );

    expect(result.current.parameters).to.deep.equal(allParameters);
    expect(result.current.forwardedProps).to.deep.equal({ 'data-testid': 'forwarded' });
  });
});
