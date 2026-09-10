import { renderHook } from '@mui/internal-test-utils';
import { ResourceBuilder } from 'test/utils/scheduler';
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
  displayTimezone: 'displayTimezone',
  eventColor: 'eventColor',
  eventCreation: 'eventCreation',
  eventModelStructure: 'eventModelStructure',
  events: 'events',
  onCollapsedResourcesChange: 'onCollapsedResourcesChange',
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
  it('should forward `shouldEventRequireResource` to the parameters object', () => {
    const { result } = renderHook(() =>
      useExtractEventTimelinePremiumParameters({
        events: [],
        resources: [ResourceBuilder.new().build()],
        shouldEventRequireResource: true,
      }),
    );

    expect(result.current.parameters.shouldEventRequireResource).to.equal(true);
  });

  it('should forward `presetConfig` to the parameters object instead of the forwarded props', () => {
    const presetConfig = { dayAndHour: { startTime: 8, endTime: 20 } };
    const { result } = renderHook(() =>
      useExtractEventTimelinePremiumParameters({
        events: [],
        resources: [ResourceBuilder.new().build()],
        presetConfig,
      }),
    );

    expect(result.current.parameters.presetConfig).to.equal(presetConfig);
    expect(result.current.forwardedProps).to.not.have.property('presetConfig');
  });

  it('should forward `onEventEditingStart` to the parameters object instead of the forwarded props', () => {
    const onEventEditingStart = () => {};
    const { result } = renderHook(() =>
      useExtractEventTimelinePremiumParameters({
        events: [],
        resources: [ResourceBuilder.new().build()],
        onEventEditingStart,
      }),
    );

    expect(result.current.parameters.onEventEditingStart).to.equal(onEventEditingStart);
    expect(result.current.forwardedProps).to.not.have.property('onEventEditingStart');
  });

  it('should not forward any parameter to the forwarded props', () => {
    const { result } = renderHook(() =>
      useExtractEventTimelinePremiumParameters({
        ...(allParameters as EventTimelinePremiumParameters<any, any>),
        'data-testid': 'forwarded',
      }),
    );

    expect(result.current.forwardedProps).to.deep.equal({ 'data-testid': 'forwarded' });
  });
});
