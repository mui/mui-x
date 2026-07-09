import { spy } from 'sinon';
import { adapter, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const TEST_RESOURCES = [ResourceBuilder.new().id('r1').title('Resource 1').build()];
const eventA = EventBuilder.new().id('event-a').build();
const eventB = EventBuilder.new().id('event-b').build();
const recurringEvent = EventBuilder.new().id('event-r').recurrent('DAILY').build();

const DEP_AB: SchedulerDependency = {
  id: 'dep-1',
  source: 'event-a',
  target: 'event-b',
  type: 'FinishToStart',
};

const DEFAULT_PARAMS = { events: [eventA, eventB], resources: TEST_RESOURCES };

const noopPersistEvents = async () => ({ success: true });

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

  describe('method: addDependency', () => {
    it('should emit onDependenciesChange with the new dependency appended', () => {
      const onDependenciesChange = spy();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB], onDependenciesChange },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-b',
        target: 'event-a',
        type: 'FinishToStart',
      });

      expect(result.status).to.equal('added');
      expect(onDependenciesChange.calledOnce).to.equal(true);
      const newDependencies = onDependenciesChange.lastCall.firstArg;
      expect(newDependencies).to.have.length(2);
      expect(newDependencies[1]).to.deep.include({
        source: 'event-b',
        target: 'event-a',
        type: 'FinishToStart',
      });
      expect(newDependencies[1].id).to.equal(result.status === 'added' ? result.id : undefined);
      // controlled prop: state is not written directly
      expect(store.state.dependencyModelList).to.deep.equal([DEP_AB]);
    });

    it('should reject a dependency referencing a recurring event', () => {
      const onDependenciesChange = spy();
      const store = new EventTimelinePremiumStore(
        { events: [eventA, recurringEvent], resources: TEST_RESOURCES, onDependenciesChange },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-a',
        target: 'event-r',
        type: 'FinishToStart',
      });

      expect(result).to.deep.equal({
        status: 'rejected',
        reason: 'recurringEvent',
        eventId: 'event-r',
      });
      expect(onDependenciesChange.called).to.equal(false);
    });

    it('should reject a dependency referencing an unknown event', () => {
      const store = new EventTimelinePremiumStore(DEFAULT_PARAMS, adapter);

      const result = store.addDependency({
        source: 'event-a',
        target: 'nope',
        type: 'FinishToStart',
      });

      expect(result).to.deep.equal({ status: 'rejected', reason: 'unknownEvent', eventId: 'nope' });
    });
  });

  describe('method: deleteDependency', () => {
    it('should emit onDependenciesChange without the deleted dependency', () => {
      const onDependenciesChange = spy();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB], onDependenciesChange },
        adapter,
      );

      store.deleteDependency('dep-1');

      expect(onDependenciesChange.calledOnce).to.equal(true);
      expect(onDependenciesChange.lastCall.firstArg).to.deep.equal([]);
    });

    it('should not emit onDependenciesChange when the dependency does not exist', () => {
      const onDependenciesChange = spy();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB], onDependenciesChange },
        adapter,
      );

      store.deleteDependency('nope');

      expect(onDependenciesChange.called).to.equal(false);
    });
  });

  describe('referential integrity', () => {
    it('should remove the dependencies of a deleted event in the same update', () => {
      const onDependenciesChange = spy();
      const onEventsChange = spy();
      const eventC = EventBuilder.new().id('event-c').build();
      const DEP_BC: SchedulerDependency = {
        id: 'dep-2',
        source: 'event-b',
        target: 'event-c',
        type: 'FinishToStart',
      };
      const store = new EventTimelinePremiumStore(
        {
          events: [eventA, eventB, eventC],
          resources: TEST_RESOURCES,
          dependencies: [DEP_AB, DEP_BC],
          onDependenciesChange,
          onEventsChange,
        },
        adapter,
      );

      store.deleteEvent('event-a');

      // dep-1 references event-a (as source) and is dropped; dep-2 survives
      expect(onDependenciesChange.calledOnce).to.equal(true);
      expect(onDependenciesChange.lastCall.firstArg).to.deep.equal([DEP_BC]);
      expect(onEventsChange.calledOnce).to.equal(true);
      // both callbacks fired synchronously in the same mutation
      expect(onDependenciesChange.calledBefore(onEventsChange)).to.equal(true);
    });

    it('should not emit onDependenciesChange when the deleted event has no dependencies', () => {
      const onDependenciesChange = spy();
      const eventC = EventBuilder.new().id('event-c').build();
      const store = new EventTimelinePremiumStore(
        {
          events: [eventA, eventB, eventC],
          resources: TEST_RESOURCES,
          dependencies: [DEP_AB],
          onDependenciesChange,
        },
        adapter,
      );

      store.deleteEvent('event-c');

      expect(onDependenciesChange.called).to.equal(false);
    });
  });

  describe('dev warnings', () => {
    it('should warn when a dependency from props references an unknown event and there is no dataSource', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new EventTimelinePremiumStore(
          {
            ...DEFAULT_PARAMS,
            dependencies: [
              { id: 'dep-x', source: 'event-a', target: 'nope', type: 'FinishToStart' },
            ],
          },
          adapter,
        );
      }).toWarnDev([
        'MUI X Scheduler: The dependency "dep-x" references the unknown event "nope".',
      ]);
    });

    it('should not warn about unknown events when a dataSource is provided', () => {
      const dataSource = {
        getEvents: spy(async () => []),
        persistEvents: noopPersistEvents,
      };

      expect(() => {
        // eslint-disable-next-line no-new
        new EventTimelinePremiumStore(
          {
            ...DEFAULT_PARAMS,
            dataSource,
            dependencies: [
              { id: 'dep-x', source: 'event-a', target: 'nope', type: 'FinishToStart' },
            ],
          },
          adapter,
        );
      }).not.toWarnDev();
    });

    it('should warn when a dependency from props references a recurring event', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new EventTimelinePremiumStore(
          {
            events: [eventA, recurringEvent],
            resources: TEST_RESOURCES,
            dependencies: [
              { id: 'dep-r', source: 'event-a', target: 'event-r', type: 'FinishToStart' },
            ],
          },
          adapter,
        );
      }).toWarnDev([
        'MUI X Scheduler: The dependency "dep-r" references the recurring event "event-r".',
      ]);
    });
  });
});
