import { adapter } from 'test/utils/scheduler';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { DEFAULT_IS_MULTI_DAY_EVENT, DEFAULT_RESOURCES } from '../../utils/SchedulerStore';
import { DEFAULT_PREFERENCES, TimelineStore } from '../TimelineStore';

const DEFAULT_PARAMS = { events: [] };

describe('Core - TimelineStore', () => {
  describe('create', () => {
    createRenderer({ clockConfig: new Date(2012, 4, 3, 14, 30, 15, 743) });

    it('should initialize default state', () => {
      const store = new TimelineStore(DEFAULT_PARAMS, adapter);

      const expectedState = {
        adapter,
        resources: DEFAULT_RESOURCES,
        visibleResources: new Map(),
        events: [],
        nowUpdatedEveryMinute: adapter.date(),
        isMultiDayEvent: DEFAULT_IS_MULTI_DAY_EVENT,
        areEventsDraggable: false,
        areEventsResizable: false,
        canDragEventsFromTheOutside: false,
        canDropEventsToTheOutside: false,
        eventColor: 'jade',
        showCurrentTimeIndicator: true,
        occurrencePlaceholder: null,
        visibleDate: adapter.startOfDay(adapter.date()),
        preferences: DEFAULT_PREFERENCES,
        view: 'time',
        views: ['time', 'days', 'weeks', 'months', 'years'],
        readonly: false,
      };

      expect(store.state).to.deep.equal(expectedState);
    });
  });
});
