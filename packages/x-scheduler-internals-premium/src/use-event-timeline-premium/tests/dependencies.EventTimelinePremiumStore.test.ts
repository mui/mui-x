import { spy } from 'sinon';
import { vi } from 'vitest';
import { adapter, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { DEBOUNCE_MS } from '../../internals/utils/queue';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors/eventTimelinePremiumDependencySelectors';
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

const flushEffect = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const flushDebounce = () => vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

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

    it('should reset the dependencies state to an empty collection when the parameter is removed', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB] },
        adapter,
      );
      store.updateStateFromParameters(DEFAULT_PARAMS, adapter);

      expect(store.state.dependencyModelList).to.deep.equal([]);
      expect(store.state.dependencyModelLookup.size).to.equal(0);
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
      // controlled prop: state is not written directly
      expect(store.state.dependencyModelList).to.deep.equal([DEP_AB]);
    });

    it('should generate a distinct id for each added dependency and echo it back to the caller', () => {
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

      // Two distinct new dependencies, neither duplicating `DEP_AB` (a→b) nor each other.
      const firstResult = store.addDependency({
        source: 'event-b',
        target: 'event-a',
        type: 'FinishToStart',
      });
      const secondResult = store.addDependency({
        source: 'event-a',
        target: 'event-c',
        type: 'FinishToStart',
      });

      if (firstResult.status !== 'added' || secondResult.status !== 'added') {
        throw new Error('Expected both dependencies to be added.');
      }

      expect(firstResult.id).not.to.equal(undefined);
      expect(secondResult.id).not.to.equal(undefined);
      expect(firstResult.id).not.to.equal(secondResult.id);

      // controlled prop: each call re-reads the same original `[DEP_AB]` list, so both
      // emissions append the new dependency at index 1.
      const firstEmitted = onDependenciesChange.firstCall.firstArg;
      expect(firstEmitted[1].id).to.equal(firstResult.id);

      const secondEmitted = onDependenciesChange.secondCall.firstArg;
      expect(secondEmitted[1].id).to.equal(secondResult.id);
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

    it('should reject a dependency referencing an event not yet loaded, even with a dataSource', () => {
      const dataSource = {
        getEvents: spy(async () => []),
        persistEvents: noopPersistEvents,
      };
      const store = new EventTimelinePremiumStore(
        { events: [], resources: TEST_RESOURCES, dataSource },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-a',
        target: 'event-b',
        type: 'FinishToStart',
      });

      expect(result).to.deep.equal({
        status: 'rejected',
        reason: 'unknownEvent',
        eventId: 'event-a',
      });
    });

    it('should reject a dependency that duplicates an existing one', () => {
      const onDependenciesChange = spy();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB], onDependenciesChange },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-a',
        target: 'event-b',
        type: 'FinishToStart',
      });

      expect(result).to.deep.equal({
        status: 'rejected',
        reason: 'duplicateDependency',
        dependencyId: 'dep-1',
      });
      expect(onDependenciesChange.called).to.equal(false);
    });

    it('should accept a self-referencing dependency until the cycle guard lands', () => {
      // A self-loop is the degenerate cycle; rejection belongs to the cycle guard (#22858).
      const onDependenciesChange = spy();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, onDependenciesChange },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-a',
        target: 'event-a',
        type: 'FinishToStart',
      });

      expect(result.status).to.equal('added');
      expect(onDependenciesChange.calledOnce).to.equal(true);
    });

    it('should not detect a duplicate added earlier in the same update cycle', () => {
      // The guard reads the controlled `dependencyModelList`, which only updates when the
      // consumer round-trips the prop — same known limitation as consecutive adds.
      const onDependenciesChange = spy();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, onDependenciesChange },
        adapter,
      );

      const firstResult = store.addDependency({
        source: 'event-a',
        target: 'event-b',
        type: 'FinishToStart',
      });
      const secondResult = store.addDependency({
        source: 'event-a',
        target: 'event-b',
        type: 'FinishToStart',
      });

      expect(firstResult.status).to.equal('added');
      expect(secondResult.status).to.equal('added');
      expect(onDependenciesChange.calledTwice).to.equal(true);
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

    it('should emit onDependenciesChange with only the other dependency when one of two is deleted', () => {
      const onDependenciesChange = spy();
      const DEP_BA: SchedulerDependency = {
        id: 'dep-2',
        source: 'event-b',
        target: 'event-a',
        type: 'FinishToStart',
      };
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB, DEP_BA], onDependenciesChange },
        adapter,
      );

      store.deleteDependency('dep-1');

      expect(onDependenciesChange.calledOnce).to.equal(true);
      expect(onDependenciesChange.lastCall.firstArg).to.deep.equal([DEP_BA]);
    });

    it('should remove every dependency sharing the deleted id', () => {
      // Duplicate ids are a consumer data error (dev-warned at ingestion); the id is the
      // identity, so deleting it removes all of its entries.
      const onDependenciesChange = spy();
      const createStore = () =>
        new EventTimelinePremiumStore(
          {
            ...DEFAULT_PARAMS,
            dependencies: [
              { id: 'dup', source: 'event-a', target: 'event-b', type: 'FinishToStart' },
              { id: 'dup', source: 'event-b', target: 'event-a', type: 'FinishToStart' },
            ],
            onDependenciesChange,
          },
          adapter,
        );

      let store: ReturnType<typeof createStore>;
      expect(() => {
        store = createStore();
      }).toWarnDev(['MUI X Scheduler: Two or more dependencies share the same id "dup".']);

      store!.deleteDependency('dup');

      expect(onDependenciesChange.calledOnce).to.equal(true);
      expect(onDependenciesChange.lastCall.firstArg).to.deep.equal([]);
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

    it('should drop every dependency touching the deleted event in a single emission', () => {
      const onDependenciesChange = spy();
      const eventC = EventBuilder.new().id('event-c').build();
      const DEP_AC: SchedulerDependency = {
        id: 'dep-2',
        source: 'event-a',
        target: 'event-c',
        type: 'FinishToStart',
      };
      const DEP_BC: SchedulerDependency = {
        id: 'dep-3',
        source: 'event-b',
        target: 'event-c',
        type: 'FinishToStart',
      };
      const store = new EventTimelinePremiumStore(
        {
          events: [eventA, eventB, eventC],
          resources: TEST_RESOURCES,
          dependencies: [DEP_AB, DEP_AC, DEP_BC],
          onDependenciesChange,
        },
        adapter,
      );

      store.deleteEvent('event-a');

      // dep-1 (a→b) and dep-2 (a→c) both touch event-a and are dropped in the same pass;
      // dep-3 (b→c) survives.
      expect(onDependenciesChange.calledOnce).to.equal(true);
      expect(onDependenciesChange.lastCall.firstArg).to.deep.equal([DEP_BC]);
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

    it('should remove a dependency when the deleted event is only referenced as its target', () => {
      const onDependenciesChange = spy();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB], onDependenciesChange },
        adapter,
      );

      store.deleteEvent('event-b');

      expect(onDependenciesChange.calledOnce).to.equal(true);
      expect(onDependenciesChange.lastCall.firstArg).to.deep.equal([]);
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

    it('should still warn about recurring events once loaded, even when a dataSource is provided', async () => {
      // With a `dataSource`, `events` is never read directly (only the fetch result
      // populates `processedEventLookup`), so the recurring event must actually be
      // loaded before its dependency can be classified as `recurringEvent` rather
      // than the suppressed `unknownEvent`.
      vi.useFakeTimers();
      try {
        const dataSource = {
          getEvents: spy(async () => [eventA, recurringEvent]),
          persistEvents: noopPersistEvents,
        };
        const params = { events: [], resources: TEST_RESOURCES, dataSource };
        const store = new EventTimelinePremiumStore(params, adapter);
        store.updateStateFromParameters(params, adapter);

        await flushEffect();
        await flushDebounce();

        expect(() => {
          store.updateStateFromParameters(
            {
              ...params,
              dependencies: [
                { id: 'dep-r', source: 'event-a', target: 'event-r', type: 'FinishToStart' },
              ],
            },
            adapter,
          );
        }).toWarnDev([
          'MUI X Scheduler: The dependency "dep-r" references the recurring event "event-r".',
        ]);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should re-validate the dependencies when the parameter changes after mount', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB] },
        adapter,
      );

      expect(() => {
        store.updateStateFromParameters(
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

    it('should re-validate the dependencies when the events parameter changes after mount', () => {
      // The same array instance is passed to both calls so the dependencies slice keeps its
      // reference and only the `processedEventLookup` effect can trigger the re-validation.
      const dependencies = [DEP_AB];
      const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, dependencies }, adapter);

      const recurringEventB = EventBuilder.new().id('event-b').recurrent('DAILY').build();

      expect(() => {
        store.updateStateFromParameters(
          { ...DEFAULT_PARAMS, events: [eventA, recurringEventB], dependencies },
          adapter,
        );
      }).toWarnDev([
        'MUI X Scheduler: The dependency "dep-1" references the recurring event "event-b".',
      ]);
    });
  });

  describe('selector: activeModelListByTarget', () => {
    it('should keep the same reference across unrelated updates and recompute when dependencies actually change', () => {
      const events = [eventA, eventB];
      const dependencies = [DEP_AB];
      const params = { events, resources: TEST_RESOURCES, dependencies };
      const store = new EventTimelinePremiumStore(params, adapter);

      const first = eventTimelinePremiumDependencySelectors.activeModelListByTarget(store.state);

      // `events`, `resources` and `dependencies` keep the same references; only an
      // unrelated parameter changes.
      store.updateStateFromParameters({ ...params, readOnly: true }, adapter);
      const second = eventTimelinePremiumDependencySelectors.activeModelListByTarget(store.state);

      expect(second).to.equal(first);

      const DEP_BA: SchedulerDependency = {
        id: 'dep-2',
        source: 'event-b',
        target: 'event-a',
        type: 'FinishToStart',
      };
      store.updateStateFromParameters(
        { ...params, dependencies: [...dependencies, DEP_BA] },
        adapter,
      );
      const third = eventTimelinePremiumDependencySelectors.activeModelListByTarget(store.state);

      expect(third).not.to.equal(second);
    });
  });
});
