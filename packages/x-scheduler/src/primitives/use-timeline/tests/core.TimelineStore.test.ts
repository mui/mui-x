import { getAdapter } from '../../utils/adapter/getAdapter';
import { DEFAULT_RESOURCES } from '../../utils/SchedulerStore';
import { DEFAULT_PREFERENCES, TimelineStore } from '../TimelineStore';

const adapter = getAdapter();
const DEFAULT_PARAMS = { events: [] };

describe('Core - TimelineStore', () => {
  describe('create', () => {
    it('should initialize default state', () => {
      const store = new TimelineStore(DEFAULT_PARAMS, adapter);
      const { nowUpdatedEveryMinute, ...actualState } = store.state;

      const expectedState = {
        adapter,
        resources: DEFAULT_RESOURCES,
        visibleResources: new Map(),
        events: [],
        areEventsDraggable: false,
        areEventsResizable: false,
        eventColor: 'jade',
        showCurrentTimeIndicator: true,
        occurrencePlaceholder: null,
        visibleDate: adapter.startOfDay(adapter.date()),
        preferences: DEFAULT_PREFERENCES,
      };

      expect(store.state.nowUpdatedEveryMinute).to.not.equal(undefined);
      expect(actualState).to.deep.equal(expectedState);
    });
  });
});
