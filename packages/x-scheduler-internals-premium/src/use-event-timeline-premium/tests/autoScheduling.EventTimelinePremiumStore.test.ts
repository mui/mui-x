import { spy } from 'sinon';
import { describe, expect, it, vi } from 'vitest';
import { adapter, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { DEBOUNCE_MS } from '../../internals/utils/queue';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const TEST_RESOURCES = [ResourceBuilder.new().id('r1').title('Resource 1').build()];
const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').build();
const eventB = EventBuilder.new()
  .id('b')
  .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
  .build();
const recurringEvent = EventBuilder.new().id('r').recurrent('DAILY').build();

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
const noopPersistEvents = async () => ({ success: true });
const flushEffect = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('Auto-scheduling - EventTimelinePremiumStore', () => {
  it('should emit onEventsChange once with the cascaded events included', () => {
    const onEventsChange = spy();
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onEventsChange }, adapter);

    store.updateEvent({
      id: 'a',
      start: date('2025-07-03T11:00:00Z'),
      end: date('2025-07-03T12:00:00Z'),
    });

    expect(onEventsChange.calledOnce).to.equal(true);
    const newEvents: SchedulerEvent[] = onEventsChange.lastCall.firstArg;
    const emittedA = newEvents.find((event) => event.id === 'a')!;
    const emittedB = newEvents.find((event) => event.id === 'b')!;
    expect(timestampOf(emittedA.end)).to.equal(adapter.getTime(date('2025-07-03T12:00:00Z')));
    expect(timestampOf(emittedB.start)).to.equal(adapter.getTime(date('2025-07-03T12:00:00Z')));
    expect(timestampOf(emittedB.end)).to.equal(adapter.getTime(date('2025-07-03T13:00:00Z')));
  });

  it('should clamp a successor dropped before its predecessor within the same emission', () => {
    const onEventsChange = spy();
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onEventsChange }, adapter);

    store.updateEvent({
      id: 'b',
      start: date('2025-07-03T09:30:00Z'),
      end: date('2025-07-03T10:30:00Z'),
      title: 'Moved b',
    });

    expect(onEventsChange.calledOnce).to.equal(true);
    const newEvents: SchedulerEvent[] = onEventsChange.lastCall.firstArg;
    const emittedB = newEvents.find((event) => event.id === 'b')!;
    // Clamped to the predecessor's end, keeping the rest of the user's entry.
    expect(timestampOf(emittedB.start)).to.equal(adapter.getTime(date('2025-07-03T10:00:00Z')));
    expect(timestampOf(emittedB.end)).to.equal(adapter.getTime(date('2025-07-03T11:00:00Z')));
    expect(emittedB.title).to.equal('Moved b');
  });

  it('should reject the batch when the cascade would move a read-only event', () => {
    const onEventsChange = spy();
    const readOnlySuccessor = EventBuilder.new()
      .id('b')
      .readOnly()
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .build();
    const store = new EventTimelinePremiumStore(
      { ...DEFAULT_PARAMS, events: [eventA, readOnlySuccessor], onEventsChange },
      adapter,
    );

    store.updateEvent({
      id: 'a',
      start: date('2025-07-03T11:00:00Z'),
      end: date('2025-07-03T12:00:00Z'),
    });

    // Atomic veto: nothing is applied, and the rejection surfaces as a toast.
    expect(onEventsChange.callCount).to.equal(0);
    expect(store.state.errors).to.have.length(1);
    expect(store.state.errors[0].error.message).to.include('read-only');
  });

  it('should keep the clipboard when a cut paste is rejected', () => {
    const onEventsChange = spy();
    const readOnlySuccessor = EventBuilder.new()
      .id('b')
      .readOnly()
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .build();
    const store = new EventTimelinePremiumStore(
      { ...DEFAULT_PARAMS, events: [eventA, readOnlySuccessor], onEventsChange },
      adapter,
    );

    store.cutEvent('a');
    const result = store.pasteEvent({ start: date('2025-07-03T11:00:00Z') });

    expect(result).to.equal(null);
    expect(onEventsChange.callCount).to.equal(0);
    expect(store.state.copiedEvent).not.to.equal(null);
  });

  it('should cascade on an end-only update', () => {
    const onEventsChange = spy();
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onEventsChange }, adapter);

    // Resize: only the end moves, past the successor's start.
    store.updateEvent({ id: 'a', end: date('2025-07-03T10:30:00Z') });

    expect(onEventsChange.calledOnce).to.equal(true);
    const newEvents: SchedulerEvent[] = onEventsChange.lastCall.firstArg;
    const emittedB = newEvents.find((event) => event.id === 'b')!;
    expect(timestampOf(emittedB.start)).to.equal(adapter.getTime(date('2025-07-03T10:30:00Z')));
    expect(timestampOf(emittedB.end)).to.equal(adapter.getTime(date('2025-07-03T11:30:00Z')));
  });

  it('should leave the successor untouched when the predecessor moves earlier', () => {
    const onEventsChange = spy();
    const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onEventsChange }, adapter);

    store.updateEvent({
      id: 'a',
      start: date('2025-07-03T08:00:00Z'),
      end: date('2025-07-03T09:00:00Z'),
    });

    expect(onEventsChange.calledOnce).to.equal(true);
    const newEvents: SchedulerEvent[] = onEventsChange.lastCall.firstArg;
    const emittedB = newEvents.find((event) => event.id === 'b')!;
    expect(timestampOf(emittedB.start)).to.equal(adapter.getTime(date('2025-07-03T10:00:00Z')));
  });

  it('should not cascade when the dependencies feature is disabled', () => {
    const onEventsChange = spy();
    const store = new EventTimelinePremiumStore(
      { events: [eventA, eventB], resources: TEST_RESOURCES, onEventsChange },
      adapter,
    );

    store.updateEvent({
      id: 'a',
      start: date('2025-07-03T11:00:00Z'),
      end: date('2025-07-03T12:00:00Z'),
    });

    expect(onEventsChange.calledOnce).to.equal(true);
    const newEvents: SchedulerEvent[] = onEventsChange.lastCall.firstArg;
    const emittedB = newEvents.find((event) => event.id === 'b')!;
    expect(timestampOf(emittedB.start)).to.equal(adapter.getTime(date('2025-07-03T10:00:00Z')));
  });

  it('should keep recurring-endpoint dependencies inert', () => {
    const onEventsChange = spy();
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

    expect(onEventsChange.calledOnce).to.equal(true);
    const newEvents: SchedulerEvent[] = onEventsChange.lastCall.firstArg;
    const emittedRecurring = newEvents.find((event) => event.id === 'r')!;
    expect(emittedRecurring.start).to.equal(recurringEvent.start);
  });

  it('should include the cascaded updates in the same persistEvents batch', async () => {
    vi.useFakeTimers();
    try {
      const dataSource = {
        getEvents: async () => [eventA, eventB],
        persistEvents: spy(noopPersistEvents),
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
      await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

      store.updateEvent({
        id: 'a',
        start: date('2025-07-03T11:00:00Z'),
        end: date('2025-07-03T12:00:00Z'),
      });
      await flushEffect();

      expect(dataSource.persistEvents.calledOnce).to.equal(true);
      const batch = dataSource.persistEvents.lastCall.firstArg;
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
});
