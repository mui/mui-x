import { vi, describe, it, expect } from 'vitest';
import { adapter, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { DEBOUNCE_MS } from '../../internals/utils/queue';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors/eventTimelinePremiumDependencySelectors';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const TEST_RESOURCES = [ResourceBuilder.new().id('r1').title('Resource 1').build()];
const eventA = EventBuilder.new().id('event-a').build();
const eventB = EventBuilder.new().id('event-b').build();
const eventC = EventBuilder.new().id('event-c').build();
const eventD = EventBuilder.new().id('event-d').build();
const eventE = EventBuilder.new().id('event-e').build();
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
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        {
          events: [eventA, eventB, eventC],
          resources: TEST_RESOURCES,
          dependencies: [DEP_AB],
          onDependenciesChange,
        },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-b',
        target: 'event-c',
        type: 'FinishToStart',
      });

      expect(result.status).to.equal('added');
      expect(onDependenciesChange.mock.calls.length).to.equal(1);
      const newDependencies = onDependenciesChange.mock.lastCall![0];
      expect(newDependencies).to.have.length(2);
      expect(newDependencies[1]).to.deep.include({
        source: 'event-b',
        target: 'event-c',
        type: 'FinishToStart',
      });
      // controlled prop: state is not written directly
      expect(store.state.dependencyModelList).to.deep.equal([DEP_AB]);
    });

    it('should generate a distinct id for each added dependency and echo it back to the caller', () => {
      const onDependenciesChange = vi.fn();
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
        target: 'event-c',
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
      const firstEmitted = onDependenciesChange.mock.calls[0][0];
      expect(firstEmitted[1].id).to.equal(firstResult.id);

      const secondEmitted = onDependenciesChange.mock.calls[1][0];
      expect(secondEmitted[1].id).to.equal(secondResult.id);
    });

    it('should reject a dependency referencing a recurring event', () => {
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        {
          events: [eventA, recurringEvent],
          resources: TEST_RESOURCES,
          dependencies: [],
          onDependenciesChange,
        },
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
      expect(onDependenciesChange.mock.calls.length).to.equal(0);
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
        getEvents: vi.fn(async () => []),
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
      const onDependenciesChange = vi.fn();
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
      expect(onDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should reject a self-referencing dependency', () => {
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [], onDependenciesChange },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-a',
        target: 'event-a',
        type: 'FinishToStart',
      });

      expect(result).to.deep.equal({ status: 'rejected', reason: 'cyclicDependency' });
      expect(onDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should reject a dependency closing a direct cycle', () => {
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB], onDependenciesChange },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-b',
        target: 'event-a',
        type: 'FinishToStart',
      });

      expect(result).to.deep.equal({ status: 'rejected', reason: 'cyclicDependency' });
      expect(onDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should reject a dependency closing a transitive cycle', () => {
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        {
          events: [eventA, eventB, eventC],
          resources: TEST_RESOURCES,
          dependencies: [
            DEP_AB,
            { id: 'dep-2', source: 'event-b', target: 'event-c', type: 'FinishToStart' },
          ],
          onDependenciesChange,
        },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-c',
        target: 'event-a',
        type: 'FinishToStart',
      });

      expect(result).to.deep.equal({ status: 'rejected', reason: 'cyclicDependency' });
      expect(onDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should reject a dependency whose cycle closes through a middle outgoing branch', () => {
      // `event-a` has three outgoing edges and only the middle one reaches the proposed
      // source: a grouping that retained a single branch per event — whether the first
      // or the last — would admit the cycle.
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        {
          events: [eventA, eventB, eventC, eventD, eventE],
          resources: TEST_RESOURCES,
          dependencies: [
            DEP_AB,
            { id: 'dep-2', source: 'event-a', target: 'event-c', type: 'FinishToStart' },
            { id: 'dep-3', source: 'event-c', target: 'event-d', type: 'FinishToStart' },
            { id: 'dep-4', source: 'event-a', target: 'event-e', type: 'FinishToStart' },
          ],
          onDependenciesChange,
        },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-d',
        target: 'event-a',
        type: 'FinishToStart',
      });

      expect(result).to.deep.equal({ status: 'rejected', reason: 'cyclicDependency' });
      expect(onDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should accept a dependency whose walk traverses a diamond', () => {
      // Reconvergence is not a cycle: the walk from `event-a` reaches `event-d` through
      // both branches (revisit, not cycle) and must still accept the new edge.
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        {
          events: [eventA, eventB, eventC, eventD, eventE],
          resources: TEST_RESOURCES,
          dependencies: [
            DEP_AB,
            { id: 'dep-2', source: 'event-a', target: 'event-c', type: 'FinishToStart' },
            { id: 'dep-3', source: 'event-b', target: 'event-d', type: 'FinishToStart' },
            { id: 'dep-4', source: 'event-c', target: 'event-d', type: 'FinishToStart' },
          ],
          onDependenciesChange,
        },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-e',
        target: 'event-a',
        type: 'FinishToStart',
      });

      expect(result.status).to.equal('added');
      expect(onDependenciesChange.mock.calls.length).to.equal(1);
    });

    it('should accept a dependency whose walk enters a pre-existing cycle', () => {
      // The `visited` set is what terminates the walk here: the data already contains
      // the cycle b→c→b, and the added edge never reaches it back.
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        {
          events: [eventA, eventB, eventC],
          resources: TEST_RESOURCES,
          dependencies: [
            { id: 'dep-1', source: 'event-b', target: 'event-c', type: 'FinishToStart' },
            { id: 'dep-2', source: 'event-c', target: 'event-b', type: 'FinishToStart' },
          ],
          onDependenciesChange,
        },
        adapter,
      );

      const result = store.addDependency({
        source: 'event-a',
        target: 'event-b',
        type: 'FinishToStart',
      });

      expect(result.status).to.equal('added');
      expect(onDependenciesChange.mock.calls.length).to.equal(1);
    });

    it('should report a duplicate before a cycle when the data already contains one', () => {
      // A controlled `dependencies` value can arrive already cyclic. Re-adding an
      // existing pair must report the duplicate (its arrow gets selected), not the cycle.
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        {
          ...DEFAULT_PARAMS,
          dependencies: [
            DEP_AB,
            { id: 'dep-2', source: 'event-b', target: 'event-a', type: 'FinishToStart' },
          ],
          onDependenciesChange,
        },
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
      expect(onDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should ignore a dependency shadowed by a duplicate id', () => {
      // With duplicate ids only the last entry per id exists for the feature (last
      // wins): a shadowed edge is invisible and undeletable, so it must not reject
      // an add as cyclic either.
      const onDependenciesChange = vi.fn();
      const createStore = () =>
        new EventTimelinePremiumStore(
          {
            events: [eventA, eventB, eventC, eventD],
            resources: TEST_RESOURCES,
            dependencies: [
              DEP_AB,
              { id: 'dep-1', source: 'event-c', target: 'event-d', type: 'FinishToStart' },
            ],
            onDependenciesChange,
          },
          adapter,
        );
      let store!: ReturnType<typeof createStore>;
      expect(() => {
        store = createStore();
      }).toWarnDev(['MUI X Scheduler: Two or more dependencies share the same id "dep-1".']);

      // The shadowed `a→b` edge would make this add cyclic; only `c→d` exists.
      const result = store.addDependency({
        source: 'event-b',
        target: 'event-a',
        type: 'FinishToStart',
      });

      expect(result.status).to.equal('added');
      expect(onDependenciesChange.mock.calls.length).to.equal(1);
    });

    it('should reject a cycle running through an inactive endpoint', () => {
      // The guard walks the full dependency list: this cycle is dormant (recurring
      // endpoint) but becomes live if the endpoint reactivates.
      const onDependenciesChange = vi.fn();
      const createStore = () =>
        new EventTimelinePremiumStore(
          {
            events: [eventA, eventC, recurringEvent],
            resources: TEST_RESOURCES,
            dependencies: [
              { id: 'dep-1', source: 'event-a', target: 'event-r', type: 'FinishToStart' },
              { id: 'dep-2', source: 'event-r', target: 'event-c', type: 'FinishToStart' },
            ],
            onDependenciesChange,
          },
          adapter,
        );
      let store!: ReturnType<typeof createStore>;
      expect(() => {
        store = createStore();
      }).toWarnDev([
        'MUI X Scheduler: The dependency "dep-1" references the recurring event "event-r".',
        'MUI X Scheduler: The dependency "dep-2" references the recurring event "event-r".',
      ]);

      const result = store.addDependency({
        source: 'event-c',
        target: 'event-a',
        type: 'FinishToStart',
      });

      expect(result).to.deep.equal({ status: 'rejected', reason: 'cyclicDependency' });
      expect(onDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should reject a cycle running through a not-yet-loaded endpoint', async () => {
      // Same full-list decision as the recurring leg: the dormant edges through the
      // unloaded event become live once its range is fetched.
      vi.useFakeTimers();
      try {
        const dataSource = {
          getEvents: async () => [eventA, eventC],
          persistEvents: noopPersistEvents,
        };
        const params = {
          events: [],
          resources: TEST_RESOURCES,
          dataSource,
          dependencies: [
            { id: 'dep-1', source: 'event-a', target: 'event-x', type: 'FinishToStart' },
            { id: 'dep-2', source: 'event-x', target: 'event-c', type: 'FinishToStart' },
          ] as SchedulerDependency[],
          onDependenciesChange: () => {},
        };
        const store = new EventTimelinePremiumStore(params, adapter);
        store.updateStateFromParameters(params, adapter);

        await flushEffect();
        await flushDebounce();

        const result = store.addDependency({
          source: 'event-c',
          target: 'event-a',
          type: 'FinishToStart',
        });

        expect(result).to.deep.equal({ status: 'rejected', reason: 'cyclicDependency' });
      } finally {
        vi.useRealTimers();
      }
    });

    it('should not detect a cycle closed by a dependency added earlier in the same update cycle', () => {
      // Same known limitation as the duplicate leg below: the guard reads the
      // controlled `dependencyModelList`, which has not round-tripped yet.
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [], onDependenciesChange },
        adapter,
      );

      const firstResult = store.addDependency({
        source: 'event-a',
        target: 'event-b',
        type: 'FinishToStart',
      });
      const secondResult = store.addDependency({
        source: 'event-b',
        target: 'event-a',
        type: 'FinishToStart',
      });

      expect(firstResult.status).to.equal('added');
      expect(secondResult.status).to.equal('added');
    });

    it('should not detect a duplicate added earlier in the same update cycle', () => {
      // The duplicate and cycle guards read the controlled `dependencyModelList`, which
      // only updates when the consumer round-trips the prop — same known limitation.
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [], onDependenciesChange },
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
      expect(onDependenciesChange.mock.calls.length).to.equal(2);
    });
  });

  describe('method: deleteDependency', () => {
    it('should emit onDependenciesChange without the deleted dependency', () => {
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB], onDependenciesChange },
        adapter,
      );

      store.deleteDependency('dep-1');

      expect(onDependenciesChange.mock.calls.length).to.equal(1);
      expect(onDependenciesChange.mock.lastCall?.[0]).to.deep.equal([]);
    });

    it('should not emit onDependenciesChange when the dependency does not exist', () => {
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB], onDependenciesChange },
        adapter,
      );

      // `false` — nothing was deleted: `true` would let the callers pairing the
      // deletion with a side effect (clearing the selection) act on a no-op.
      expect(store.deleteDependency('nope')).to.equal(false);

      expect(onDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should emit onDependenciesChange with only the other dependency when one of two is deleted', () => {
      const onDependenciesChange = vi.fn();
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

      expect(onDependenciesChange.mock.calls.length).to.equal(1);
      expect(onDependenciesChange.mock.lastCall?.[0]).to.deep.equal([DEP_BA]);
    });

    it('should remove every dependency sharing the deleted id', () => {
      // Duplicate ids are a consumer data error (dev-warned at ingestion); the id is the
      // identity, so deleting it removes all of its entries.
      const onDependenciesChange = vi.fn();
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

      expect(onDependenciesChange.mock.calls.length).to.equal(1);
      expect(onDependenciesChange.mock.lastCall?.[0]).to.deep.equal([]);
    });
  });

  describe('referential integrity', () => {
    it('should remove the dependencies of a deleted event in the same update', () => {
      const onDependenciesChange = vi.fn();
      const onEventsChange = vi.fn();
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
      expect(onDependenciesChange.mock.calls.length).to.equal(1);
      expect(onDependenciesChange.mock.lastCall?.[0]).to.deep.equal([DEP_BC]);
      expect(onEventsChange.mock.calls.length).to.equal(1);
      // both callbacks fired synchronously in the same mutation
      expect(onDependenciesChange.mock.invocationCallOrder[0]).to.be.lessThan(
        onEventsChange.mock.invocationCallOrder[0],
      );
    });

    it('should drop every dependency touching the deleted event in a single emission', () => {
      const onDependenciesChange = vi.fn();
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
          onEventsChange: () => {},
        },
        adapter,
      );

      store.deleteEvent('event-a');

      // dep-1 (a→b) and dep-2 (a→c) both touch event-a and are dropped in the same pass;
      // dep-3 (b→c) survives.
      expect(onDependenciesChange.mock.calls.length).to.equal(1);
      expect(onDependenciesChange.mock.lastCall?.[0]).to.deep.equal([DEP_BC]);
    });

    it('should not emit onDependenciesChange when the deleted event has no dependencies', () => {
      const onDependenciesChange = vi.fn();
      const eventC = EventBuilder.new().id('event-c').build();
      const store = new EventTimelinePremiumStore(
        {
          events: [eventA, eventB, eventC],
          resources: TEST_RESOURCES,
          dependencies: [DEP_AB],
          onDependenciesChange,
          onEventsChange: () => {},
        },
        adapter,
      );

      store.deleteEvent('event-c');

      expect(onDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should remove a dependency when the deleted event is only referenced as its target', () => {
      const onDependenciesChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        {
          ...DEFAULT_PARAMS,
          dependencies: [DEP_AB],
          onDependenciesChange,
          onEventsChange: () => {},
        },
        adapter,
      );

      store.deleteEvent('event-b');

      expect(onDependenciesChange.mock.calls.length).to.equal(1);
      expect(onDependenciesChange.mock.lastCall?.[0]).to.deep.equal([]);
    });
  });

  describe('method: setDependencyCreation', () => {
    it('should not write to the state when the gesture values did not change', () => {
      const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, dependencies: [] }, adapter);
      const creation = {
        sourceEventId: 'event-a',
        sourceOccurrenceKey: 'key-a',
        sourceResourceId: 'r1',
        sourceSide: 'end' as const,
        targetEventId: null,
        targetOccurrenceKey: null,
        targetResourceId: null,
      };
      store.setDependencyCreation(creation);
      const stateBefore = store.state;

      // A fresh but value-equal object: entering and leaving targets produces them.
      store.setDependencyCreation({ ...creation });
      expect(store.state).to.equal(stateBefore);

      store.setDependencyCreation({ ...creation, targetEventId: 'event-b' });
      expect(store.state).not.to.equal(stateBefore);
    });
  });

  describe('method: setSelectedDependencyId', () => {
    it('should not write to the state when the selection did not change', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB] },
        adapter,
      );
      store.setSelectedDependencyId('dep-1');
      const stateBefore = store.state;

      store.setSelectedDependencyId('dep-1');
      expect(store.state).to.equal(stateBefore);

      store.setSelectedDependencyId(null);
      expect(store.state).not.to.equal(stateBefore);
    });
  });

  describe('transient state resets', () => {
    it('should discard the creation gesture and the selection when the feature is disabled', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB] },
        adapter,
      );
      store.setDependencyCreation({
        sourceEventId: 'event-a',
        sourceOccurrenceKey: 'key-a',
        sourceResourceId: 'r1',
        sourceSide: 'end',
        targetEventId: null,
        targetOccurrenceKey: null,
        targetResourceId: null,
      });
      store.setSelectedDependencyId('dep-1');

      store.updateStateFromParameters(DEFAULT_PARAMS, adapter);

      expect(store.state.dependencyCreation).to.equal(null);
      expect(store.state.selection).to.equal(null);
    });

    it('should clear the selection of a removed dependency so a re-added id does not resurrect it', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, dependencies: [DEP_AB] },
        adapter,
      );
      store.setSelectedDependencyId('dep-1');

      store.updateStateFromParameters({ ...DEFAULT_PARAMS, dependencies: [] }, adapter);
      expect(store.state.selection).to.equal(null);

      store.updateStateFromParameters({ ...DEFAULT_PARAMS, dependencies: [DEP_AB] }, adapter);
      expect(eventTimelinePremiumDependencySelectors.selectedId(store.state)).to.equal(null);
    });
  });

  it('should clear the selection when an endpoint event of the selected dependency becomes recurring', () => {
    const store = new EventTimelinePremiumStore(
      { ...DEFAULT_PARAMS, dependencies: [DEP_AB] },
      adapter,
    );
    store.setSelectedDependencyId('dep-1');

    // The dependency deactivates (recurring endpoint) without being removed: the
    // raw selection must clear, or the arrow would come back already selected.
    const recurringB = EventBuilder.new().id('event-b').recurrent('DAILY').build();
    expect(() => {
      store.updateStateFromParameters(
        { ...DEFAULT_PARAMS, events: [eventA, recurringB], dependencies: [DEP_AB] },
        adapter,
      );
    }).toWarnDev([
      'MUI X Scheduler: The dependency "dep-1" references the recurring event "event-b".',
    ]);

    expect(store.state.selection).to.equal(null);
  });

  describe('dev warnings', () => {
    it('should warn and keep the feature disabled when onDependenciesChange is provided without dependencies', () => {
      let store!: EventTimelinePremiumStore<any, any>;
      expect(() => {
        store = new EventTimelinePremiumStore(
          { ...DEFAULT_PARAMS, onDependenciesChange: () => {} },
          adapter,
        );
      }).toWarnDev([
        'MUI X Scheduler: An `onDependenciesChange` handler was provided without a `dependencies` value.',
      ]);

      expect(store.state.areDependenciesEnabled).to.equal(false);
    });

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
        getEvents: vi.fn(async () => []),
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
          getEvents: vi.fn(async () => [eventA, recurringEvent]),
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

    it('should warn in dev when dependencies are updated without onDependenciesChange', () => {
      const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, dependencies: [] }, adapter);

      expect(() => {
        store.addDependency({ source: 'event-a', target: 'event-b', type: 'FinishToStart' });
      }).toWarnDev([
        'MUI X Scheduler: A dependency update was ignored because no `onDependenciesChange` handler is provided.',
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
