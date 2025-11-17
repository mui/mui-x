import { adapter } from 'test/utils/scheduler';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { DEFAULT_PREFERENCES, TimelineStore } from '../TimelineStore';

const DEFAULT_PARAMS = { events: [] };

describe('Core - TimelineStore', () => {
  describe('create', () => {
    createRenderer({ clockConfig: new Date(2012, 4, 3, 14, 30, 15, 743) });

    it('should initialize default state', () => {
      const store = new TimelineStore(DEFAULT_PARAMS, adapter);

      const expectedState = {
        adapter,
        visibleResources: new Map(),
        eventIdList: [],
        eventModelList: [],
        eventModelLookup: new Map(),
        processedEventLookup: new Map(),
        eventModelStructure: undefined,
        resourceIdList: [],
        processedResourceLookup: new Map(),
        resourceModelStructure: undefined,
        resourceChildrenIdLookup: new Map(),
        nowUpdatedEveryMinute: adapter.date(),
        areEventsDraggable: false,
        areEventsResizable: false,
        canDragEventsFromTheOutside: false,
        canDropEventsToTheOutside: false,
        eventColor: 'jade',
        eventCreation: true,
        showCurrentTimeIndicator: true,
        occurrencePlaceholder: null,
        visibleDate: adapter.startOfDay(adapter.date()),
        pendingUpdateRecurringEventParameters: null,
        preferences: DEFAULT_PREFERENCES,
        view: 'time',
        views: ['time', 'days', 'weeks', 'months', 'years'],
        readOnly: false,
      };

      expect(store.state).to.deep.equal(expectedState);
    });
  });
});
