import { renderHook } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { useExtractEventCalendarParameters } from '../useExtractEventCalendarParameters';
import type { EventCalendarParameters } from '../EventCalendarStore.types';

// One entry per parameter. TypeScript fails if a key is added to the type but not here.
const allParameters: Record<keyof EventCalendarParameters<any, any>, unknown> = {
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

describe('useExtractEventCalendarParameters', () => {
  it('should forward `shouldEventRequireResource` to the parameters object', () => {
    const { result } = renderHook(() =>
      useExtractEventCalendarParameters({ events: [], shouldEventRequireResource: true }),
    );

    expect(result.current.parameters.shouldEventRequireResource).to.equal(true);
  });

  it('should forward `onEventEditingStart` to the parameters object instead of the forwarded props', () => {
    const onEventEditingStart = () => {};
    const { result } = renderHook(() =>
      useExtractEventCalendarParameters({ events: [], onEventEditingStart }),
    );

    expect(result.current.parameters.onEventEditingStart).to.equal(onEventEditingStart);
    expect(result.current.forwardedProps).to.not.have.property('onEventEditingStart');
  });

  it('should forward `onPreferencesChange` to the parameters object instead of the forwarded props', () => {
    const onPreferencesChange = () => {};
    const { result } = renderHook(() =>
      useExtractEventCalendarParameters({ events: [], onPreferencesChange }),
    );

    expect(result.current.parameters.onPreferencesChange).to.equal(onPreferencesChange);
    expect(result.current.forwardedProps).to.not.have.property('onPreferencesChange');
  });

  it('should not forward any parameter to the forwarded props', () => {
    const { result } = renderHook(() =>
      useExtractEventCalendarParameters({
        ...(allParameters as EventCalendarParameters<any, any>),
        'data-testid': 'forwarded',
      }),
    );

    expect(result.current.forwardedProps).to.deep.equal({ 'data-testid': 'forwarded' });
  });
});
