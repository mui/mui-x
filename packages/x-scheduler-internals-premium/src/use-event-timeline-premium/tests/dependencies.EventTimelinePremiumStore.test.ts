import { adapter, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const TEST_RESOURCES = [ResourceBuilder.new().id('r1').title('Resource 1').build()];
const eventA = EventBuilder.new().id('event-a').build();
const eventB = EventBuilder.new().id('event-b').build();

const DEP_AB: SchedulerDependency = {
  id: 'dep-1',
  source: 'event-a',
  target: 'event-b',
  type: 'FinishToStart',
};

const DEFAULT_PARAMS = { events: [eventA, eventB], resources: TEST_RESOURCES };

describe('Dependencies - EventTimelinePremiumStore', () => {
  describe('prop: dependencies', () => {
    it('should initialize the dependencies state from the parameter', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB] },
        adapter,
      );

      expect(store.state.dependencyModelList).to.deep.equal([DEP_AB]);
      expect(store.state.dependencyModelLookup.get('dep-1')).to.equal(DEP_AB);
    });

    it('should default to an empty collection when the parameter is not provided', () => {
      const store = new EventTimelinePremiumStore(DEFAULT_PARAMS, adapter);

      expect(store.state.dependencyModelList).to.deep.equal([]);
      expect(store.state.dependencyModelLookup.size).to.equal(0);
    });

    it('should update the dependencies state when the parameter changes', () => {
      const store = new EventTimelinePremiumStore(DEFAULT_PARAMS, adapter);
      store.updateStateFromParameters({ ...DEFAULT_PARAMS, dependencies: [DEP_AB] }, adapter);

      expect(store.state.dependencyModelList).to.deep.equal([DEP_AB]);
    });

    it('should keep the same lookup instance when the parameter reference is unchanged', () => {
      const dependencies = [DEP_AB];
      const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, dependencies }, adapter);
      const initialLookup = store.state.dependencyModelLookup;

      store.updateStateFromParameters({ ...DEFAULT_PARAMS, dependencies }, adapter);

      expect(store.state.dependencyModelLookup).to.equal(initialLookup);
    });

    it('should warn when two dependencies share the same id', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new EventTimelinePremiumStore(
          { ...DEFAULT_PARAMS, dependencies: [DEP_AB, { ...DEP_AB }] },
          adapter,
        );
      }).toWarnDev(['MUI X Scheduler: Two or more dependencies share the same id "dep-1".']);
    });
  });
});
