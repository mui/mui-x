import { describe, expect, it, vi } from 'vitest';
import { adapter, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import {
  flushDebounce,
  flushEffect,
  noopPersistEvents,
} from '../../internals/tests/disposeTestHelpers';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const TEST_RESOURCES = [ResourceBuilder.new().id('r1').title('Resource 1').build()];
const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').build();
const eventB = EventBuilder.new()
  .id('b')
  .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
  .build();
const recurringEvent = EventBuilder.new().id('r').recurrent('DAILY').build();
const readOnlySuccessor = EventBuilder.new()
  .id('b')
  .title('Blocked successor')
  .readOnly()
  .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
  .build();

const DEP_AB: SchedulerDependency = {
  id: 'dep-1',
  source: 'a',
  target: 'b',
  type: 'FinishToStart',
};

const DEFAULT_PARAMS = {
  events: [eventA, eventB],
  resources: TEST_RESOURCES,
  dependencies: [DEP_AB],
  onDependenciesChange: () => {},
};

const date = (value: string) => adapter.date(value, 'default');
const timestampOf = (value: string | undefined) => new Date(value!).getTime();

describe('Auto-scheduling - EventTimelinePremiumStore', () => {
  it('should emit onEventsChange once with the cascaded events included', () => {
    const onEventsChange = vi.fn();
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onEventsChange }, adapter);

    store.updateEvent({
      id: 'a',
      start: date('2025-07-03T11:00:00Z'),
      end: date('2025-07-03T12:00:00Z'),
    });

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const newEvents: SchedulerEvent[] = onEventsChange.mock.lastCall![0];
    const emittedA = newEvents.find((event) => event.id === 'a')!;
    const emittedB = newEvents.find((event) => event.id === 'b')!;
    expect(timestampOf(emittedA.end)).to.equal(adapter.getTime(date('2025-07-03T12:00:00Z')));
    expect(timestampOf(emittedB.start)).to.equal(adapter.getTime(date('2025-07-03T12:00:00Z')));
    expect(timestampOf(emittedB.end)).to.equal(adapter.getTime(date('2025-07-03T13:00:00Z')));
  });

  it('should clamp a successor dropped before its predecessor within the same emission', () => {
    const onEventsChange = vi.fn();
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onEventsChange }, adapter);

    store.updateEvent({
      id: 'b',
      start: date('2025-07-03T09:30:00Z'),
      end: date('2025-07-03T10:30:00Z'),
      title: 'Moved b',
    });

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const newEvents: SchedulerEvent[] = onEventsChange.mock.lastCall![0];
    const emittedB = newEvents.find((event) => event.id === 'b')!;
    // Clamped to the predecessor's end, keeping the rest of the user's entry.
    expect(timestampOf(emittedB.start)).to.equal(adapter.getTime(date('2025-07-03T10:00:00Z')));
    expect(timestampOf(emittedB.end)).to.equal(adapter.getTime(date('2025-07-03T11:00:00Z')));
    expect(emittedB.title).to.equal('Moved b');
  });

  it('should reject the batch when the cascade would move a read-only event', () => {
    const onEventsChange = vi.fn();
    const store = new EventTimelinePremiumStore(
      { ...DEFAULT_PARAMS, events: [eventA, readOnlySuccessor], onEventsChange },
      adapter,
    );

    const result = store.updateEvent({
      id: 'a',
      start: date('2025-07-03T11:00:00Z'),
      end: date('2025-07-03T12:00:00Z'),
    });

    // Atomic veto: nothing applied, the rejection returned rather than pushed as a toast.
    expect(result.applied).to.equal(false);
    expect((result as { rejection: Error }).rejection.message).to.include('"Blocked successor"');
    expect(onEventsChange.mock.calls.length).to.equal(0);
    expect(store.state.errors).to.have.length(0);
  });

  it('should report an applied update', () => {
    const store = new EventTimelinePremiumStore(
      { ...DEFAULT_PARAMS, onEventsChange: () => {} },
      adapter,
    );

    const result = store.updateEvent({
      id: 'a',
      start: date('2025-07-03T08:00:00Z'),
      end: date('2025-07-03T09:00:00Z'),
    });

    expect(result.applied).to.equal(true);
  });

  it('should discard the whole batch when only one branch is blocked', () => {
    const onEventsChange = vi.fn();
    const movableSuccessor = EventBuilder.new()
      .id('c')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .build();
    const store = new EventTimelinePremiumStore(
      {
        ...DEFAULT_PARAMS,
        events: [eventA, readOnlySuccessor, movableSuccessor],
        dependencies: [DEP_AB, { id: 'dep-2', source: 'a', target: 'c', type: 'FinishToStart' }],
        onEventsChange,
      },
      adapter,
    );

    const result = store.updateEvent({
      id: 'a',
      start: date('2025-07-03T11:00:00Z'),
      end: date('2025-07-03T12:00:00Z'),
    });

    // c could have been pushed, but the blocked b vetoes everything.
    expect(result.applied).to.equal(false);
    expect(onEventsChange.mock.calls.length).to.equal(0);
  });

  it('should not persist a vetoed batch', async () => {
    vi.useFakeTimers();
    try {
      const dataSource = {
        getEvents: async () => [eventA, readOnlySuccessor],
        persistEvents: vi.fn(noopPersistEvents),
      };
      const params = {
        resources: TEST_RESOURCES,
        dependencies: [DEP_AB],
        onDependenciesChange: () => {},
        dataSource,
      };
      const store = new EventTimelinePremiumStore(params, adapter);
      store.updateStateFromParameters(params, adapter);
      await flushEffect();
      await flushDebounce();

      store.updateEvent({
        id: 'a',
        start: date('2025-07-03T11:00:00Z'),
        end: date('2025-07-03T12:00:00Z'),
      });
      await flushEffect();
      await flushDebounce();

      expect(dataSource.persistEvents.mock.calls.length).to.equal(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('should keep the clipboard when a cut paste is rejected', () => {
    const onEventsChange = vi.fn();
    const store = new EventTimelinePremiumStore(
      { ...DEFAULT_PARAMS, events: [eventA, readOnlySuccessor], onEventsChange },
      adapter,
    );

    store.cutEvent('a');
    const result = store.pasteEvent({ start: date('2025-07-03T11:00:00Z') });

    // The paste has no surface of its own, so the rejection shows as a toast.
    expect(result).to.equal(null);
    expect(onEventsChange.mock.calls.length).to.equal(0);
    expect(store.state.copiedEvent).not.to.equal(null);
    expect(store.state.errors).to.have.length(1);
    expect(store.state.errors[0].error.message).to.include('"Blocked successor"');
  });

  it('should cascade on an end-only update', () => {
    const onEventsChange = vi.fn();
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onEventsChange }, adapter);

    // Resize: only the end moves, past the successor's start.
    store.updateEvent({ id: 'a', end: date('2025-07-03T10:30:00Z') });

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const newEvents: SchedulerEvent[] = onEventsChange.mock.lastCall![0];
    const emittedB = newEvents.find((event) => event.id === 'b')!;
    expect(timestampOf(emittedB.start)).to.equal(adapter.getTime(date('2025-07-03T10:30:00Z')));
    expect(timestampOf(emittedB.end)).to.equal(adapter.getTime(date('2025-07-03T11:30:00Z')));
  });

  it('should leave the successor untouched when the predecessor moves earlier', () => {
    const onEventsChange = vi.fn();
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onEventsChange }, adapter);

    store.updateEvent({
      id: 'a',
      start: date('2025-07-03T08:00:00Z'),
      end: date('2025-07-03T09:00:00Z'),
    });

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const newEvents: SchedulerEvent[] = onEventsChange.mock.lastCall![0];
    const emittedB = newEvents.find((event) => event.id === 'b')!;
    expect(timestampOf(emittedB.start)).to.equal(adapter.getTime(date('2025-07-03T10:00:00Z')));
  });

  it('should not cascade when the dependencies feature is disabled', () => {
    const onEventsChange = vi.fn();
    const store = new EventTimelinePremiumStore(
      { events: [eventA, eventB], resources: TEST_RESOURCES, onEventsChange },
      adapter,
    );

    store.updateEvent({
      id: 'a',
      start: date('2025-07-03T11:00:00Z'),
      end: date('2025-07-03T12:00:00Z'),
    });

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const newEvents: SchedulerEvent[] = onEventsChange.mock.lastCall![0];
    const emittedB = newEvents.find((event) => event.id === 'b')!;
    expect(timestampOf(emittedB.start)).to.equal(adapter.getTime(date('2025-07-03T10:00:00Z')));
  });

  it('should keep recurring-endpoint dependencies inert', () => {
    const onEventsChange = vi.fn();
    const dependencies: SchedulerDependency[] = [
      { id: 'dep-r', source: 'a', target: 'r', type: 'FinishToStart' },
    ];
    let store!: EventTimelinePremiumStore<SchedulerEvent, (typeof TEST_RESOURCES)[number]>;
    expect(() => {
      store = new EventTimelinePremiumStore(
        {
          events: [eventA, recurringEvent],
          resources: TEST_RESOURCES,
          dependencies,
          onDependenciesChange: () => {},
          onEventsChange,
        },
        adapter,
      );
    }).toWarnDev(['MUI X Scheduler: The dependency "dep-r" references the recurring event "r".']);

    store.updateEvent({
      id: 'a',
      start: date('2025-07-03T11:00:00Z'),
      end: date('2025-07-03T12:00:00Z'),
    });

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const newEvents: SchedulerEvent[] = onEventsChange.mock.lastCall![0];
    const emittedRecurring = newEvents.find((event) => event.id === 'r')!;
    expect(emittedRecurring.start).to.equal(recurringEvent.start);
  });

  it('should include the cascaded updates in the same persistEvents batch', async () => {
    vi.useFakeTimers();
    try {
      const dataSource = {
        getEvents: async () => [eventA, eventB],
        persistEvents: vi.fn(noopPersistEvents),
      };
      const params = {
        resources: TEST_RESOURCES,
        dependencies: [DEP_AB],
        onDependenciesChange: () => {},
        dataSource,
      };
      const store = new EventTimelinePremiumStore(params, adapter);
      store.updateStateFromParameters(params, adapter);
      await flushEffect();
      await flushDebounce();

      store.updateEvent({
        id: 'a',
        start: date('2025-07-03T11:00:00Z'),
        end: date('2025-07-03T12:00:00Z'),
      });
      await flushEffect();

      expect(dataSource.persistEvents.mock.calls.length).to.equal(1);
      const [batch] = dataSource.persistEvents.mock.lastCall! as unknown as [
        { updated: SchedulerEvent[] },
      ];
      const updatedIds = batch.updated.map((event: SchedulerEvent) => event.id);
      expect(updatedIds).to.have.members(['a', 'b']);
      const persistedA = batch.updated.find((event: SchedulerEvent) => event.id === 'a')!;
      expect(timestampOf(persistedA.start)).to.equal(adapter.getTime(date('2025-07-03T11:00:00Z')));
      expect(timestampOf(persistedA.end)).to.equal(adapter.getTime(date('2025-07-03T12:00:00Z')));
      const persistedB = batch.updated.find((event: SchedulerEvent) => event.id === 'b')!;
      expect(timestampOf(persistedB.start)).to.equal(adapter.getTime(date('2025-07-03T12:00:00Z')));
    } finally {
      vi.useRealTimers();
    }
  });

  it('should return the pasted event when a cut paste cascades into its successor', () => {
    const onEventsChange = vi.fn();
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onEventsChange }, adapter);

    store.cutEvent('a');
    const pastedId = store.pasteEvent({ start: date('2025-07-03T11:00:00Z') });

    // The caller's entry stays first in the batch even though the cascade folded in b.
    expect(pastedId).to.equal('a');
    const events: SchedulerEvent[] = onEventsChange.mock.calls[0][0];
    const successor = events.find((event) => event.id === 'b')!;
    expect(timestampOf(successor.start as string)).to.equal(
      timestampOf('2025-07-03T12:00:00.000Z'),
    );
  });

  it('should emit nothing, not even the dependency cleanup, when a batch with a deletion is vetoed', () => {
    const onEventsChange = vi.fn();
    const onDependenciesChange = vi.fn();
    const orphan = EventBuilder.new().id('d').singleDay('2025-07-04T09:00:00Z').build();
    const store = new EventTimelinePremiumStore(
      {
        ...DEFAULT_PARAMS,
        events: [eventA, readOnlySuccessor, orphan],
        dependencies: [DEP_AB, { id: 'dep-2', source: 'a', target: 'd', type: 'FinishToStart' }],
        onEventsChange,
        onDependenciesChange,
      },
      adapter,
    );

    // Only recurring scope changes build such batches today, so the store method is
    // called directly.
    const result = (store as any).updateEvents({
      deleted: ['d'],
      updated: [
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
      ],
    });

    expect(result.rejection).not.to.equal(null);
    expect(onEventsChange.mock.calls.length).to.equal(0);
    expect(onDependenciesChange.mock.calls.length).to.equal(0);
  });

  it('should emit the cascade and the dependency cleanup once each for a batch with a deletion', () => {
    const onEventsChange = vi.fn();
    const onDependenciesChange = vi.fn();
    const orphan = EventBuilder.new().id('d').singleDay('2025-07-04T09:00:00Z').build();
    const store = new EventTimelinePremiumStore(
      {
        ...DEFAULT_PARAMS,
        events: [eventA, eventB, orphan],
        dependencies: [DEP_AB, { id: 'dep-2', source: 'a', target: 'd', type: 'FinishToStart' }],
        onEventsChange,
        onDependenciesChange,
      },
      adapter,
    );

    (store as any).updateEvents({
      deleted: ['d'],
      updated: [
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
      ],
    });

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const events: SchedulerEvent[] = onEventsChange.mock.calls[0][0];
    expect(events.map((event) => event.id)).to.deep.equal(['a', 'b']);
    expect(timestampOf(events[1].start as string)).to.equal(
      timestampOf('2025-07-03T12:00:00.000Z'),
    );
    expect(onDependenciesChange.mock.calls.length).to.equal(1);
    expect(onDependenciesChange.mock.calls[0][0]).to.deep.equal([DEP_AB]);
  });

  it('should keep a pushed all-day successor all-day and day-aligned once serialized', () => {
    const onEventsChange = vi.fn();
    const allDayA = EventBuilder.new()
      .id('a')
      .span('2025-07-03T00:00:00', '2025-07-03T23:59:59.999', { allDay: true })
      .build();
    const allDayB = EventBuilder.new()
      .id('b')
      .span('2025-07-04T00:00:00', '2025-07-04T23:59:59.999', { allDay: true })
      .build();
    const store = new EventTimelinePremiumStore(
      { ...DEFAULT_PARAMS, events: [allDayA, allDayB], onEventsChange },
      adapter,
    );

    store.updateEvent({
      id: 'a',
      start: date('2025-07-05T00:00:00'),
      end: date('2025-07-05T23:59:59.999'),
      allDay: true,
    });

    const events: SchedulerEvent[] = onEventsChange.mock.calls[0][0];
    const successor = events.find((event) => event.id === 'b')!;
    // Serialization drops the milliseconds; the model stays all-day on the pushed day.
    expect(successor.allDay).to.equal(true);
    expect(successor.start).to.equal('2025-07-06T00:00:00');
    expect(successor.end).to.equal('2025-07-06T23:59:59');
  });
});
