import { adapter } from 'test/utils/scheduler';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const DEFAULT_PARAMS = { events: [] };

describe('Core - EventTimelinePremiumStore', () => {
  describe('create', () => {
    createRenderer({ clockConfig: new Date(2012, 4, 3, 14, 30, 15, 743) });

    it('should initialize default state', () => {
      const store = new EventTimelinePremiumStore(DEFAULT_PARAMS, adapter);

      const expectedState = {
        adapter,
        areEventsDraggable: false,
        areEventsResizable: false,
        canDragEventsFromTheOutside: false,
        canDropEventsToTheOutside: false,
        copiedEvent: null,
        eventColor: 'teal',
        eventCreation: true,
        eventIdList: [],
        eventModelList: [],
        eventModelLookup: new Map(),
        eventModelStructure: undefined,
        displayTimezone: 'default',
        nowUpdatedEveryMinute: adapter.now('default'),
        occurrencePlaceholder: null,
        pendingUpdateRecurringEventParameters: null,
        plan: 'premium',
        preferences: EMPTY_OBJECT,
        processedEventLookup: new Map(),
        processedResourceLookup: new Map(),
        readOnly: false,
        resourceChildrenIdLookup: new Map(),
        resourceIdList: [],
        resourceModelStructure: undefined,
        showCurrentTimeIndicator: true,
        view: 'time',
        views: ['time', 'days', 'weeks', 'months', 'years'],
        visibleDate: adapter.startOfDay(adapter.now('default')),
        visibleResources: {},
        isLoading: false,
        errors: [],
      };

      expect(store.state).to.deep.equal(expectedState);
    });
  });
});
