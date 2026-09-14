import { renderHook } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { useExtractEventCalendarPremiumParameters } from '../useExtractEventCalendarPremiumParameters';
import type { EventCalendarPremiumParameters } from '../EventCalendarPremiumStore.types';

// One entry per parameter. TypeScript fails if a key is added to the type but not here.
// The values are irrelevant, the hooks only route keys.
const allParameters: Record<keyof EventCalendarPremiumParameters<any, any>, unknown> = {
  areEventsDraggable: 'areEventsDraggable',
  areEventsResizable: 'areEventsResizable',
  canDragEventsFromTheOutside: 'canDragEventsFromTheOutside',
  canDropEventsToTheOutside: 'canDropEventsToTheOutside',
  collapsedResources: 'collapsedResources',
  dataSource: 'dataSource',
  dateLocale: 'dateLocale',
  defaultCollapsedResources: 'defaultCollapsedResources',
  defaultPreferences: 'defaultPreferences',
  defaultView: 'defaultView',
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
  onPreferencesChange: 'onPreferencesChange',
  onViewChange: 'onViewChange',
  onVisibleDateChange: 'onVisibleDateChange',
  onVisibleResourcesChange: 'onVisibleResourcesChange',
  preferences: 'preferences',
  preferencesMenuConfig: 'preferencesMenuConfig',
  readOnly: 'readOnly',
  resourceModelStructure: 'resourceModelStructure',
  resources: 'resources',
  shouldEventRequireResource: 'shouldEventRequireResource',
  showCurrentTimeIndicator: 'showCurrentTimeIndicator',
  view: 'view',
  viewConfig: 'viewConfig',
  views: 'views',
  visibleDate: 'visibleDate',
  visibleResources: 'visibleResources',
};

describe('useExtractEventCalendarPremiumParameters', () => {
  it('should forward `dataSource` to the parameters object instead of the forwarded props', () => {
    const dataSource = {
      getEvents: async () => [],
      persistEvents: async () => ({ success: true }),
    };
    const { result } = renderHook(() =>
      useExtractEventCalendarPremiumParameters({ events: [], dataSource }),
    );

    expect(result.current.parameters.dataSource).to.equal(dataSource);
    expect(result.current.forwardedProps).to.not.have.property('dataSource');
  });

  it('should not forward any parameter to the forwarded props', () => {
    const { result } = renderHook(() =>
      useExtractEventCalendarPremiumParameters({
        ...(allParameters as EventCalendarPremiumParameters<any, any>),
        'data-testid': 'forwarded',
      }),
    );

    expect(result.current.forwardedProps).to.deep.equal({ 'data-testid': 'forwarded' });
  });
});
