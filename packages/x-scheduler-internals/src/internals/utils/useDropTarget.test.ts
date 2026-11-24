import {
  addDays,
  addHours,
  createDate,
  EventBuilder,
  EventTimelinePremiumStoreWithFeatures,
  premiumStoreClasses,
  ResourceBuilder,
  utcJuly4AllDayBuilder,
} from 'test/utils/scheduler';
import type { SchedulerEvent, SchedulerEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { SchedulerStoreInContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { processEvent } from '@mui/x-scheduler-internals/process-event';
import { describe, it, expect, vi } from 'vitest';
import {
  applyExternalDragOccurrencePlaceholder,
  applyInternalDragOrResizeOccurrencePlaceholder,
} from './useDropTarget';

describe('applyInternalDragOrResizeOccurrencePlaceholder - all-day days without midnight', () => {
  it('should drop an all-day predecessor on a day without midnight without pushing its successor', () => {
    // America/Havana springs forward at midnight on March 9th, 2025: that day starts at 01:00.
    // Dropped there, a one-day event still ends at the start of March 10th, so a successor on
    // March 10th keeps its day.
    const onEventsChange = vi.fn();
    const predecessor = EventBuilder.new()
      .id('a')
      .span('2025-03-07', '2025-03-08', { allDay: true })
      .withDisplayTimezone('America/Havana');
    const store = new EventTimelinePremiumStoreWithFeatures({
      resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
      events: [
        predecessor.build(),
        EventBuilder.new().id('b').span('2025-03-10', '2025-03-11', { allDay: true }).build(),
      ],
      dependencies: [{ id: 'dep', source: 'a', target: 'b', type: 'FinishToStart' }],
      displayTimezone: 'America/Havana',
      onEventsChange,
      onDependenciesChange: () => {},
    });
    const occurrence = predecessor.toOccurrence();

    applyInternalDragOrResizeOccurrencePlaceholder(
      store as unknown as SchedulerStoreInContext<any, any>,
      {
        type: 'internal-drag',
        surfaceType: 'timeline',
        eventId: 'a',
        occurrenceKey: occurrence.key,
        originalOccurrence: occurrence,
        allDay: occurrence.allDay ?? false,
        sourceResourceId: null,
        resourceId: null,
        start: createDate('2025-03-09T12:00:00', 'America/Havana').getTime(),
        end: createDate('2025-03-10T12:00:00', 'America/Havana').getTime(),
      },
    );

    const events: SchedulerEvent[] = onEventsChange.mock.lastCall![0];
    const movedA = events.find((item) => item.id === 'a')!;
    const successorB = events.find((item) => item.id === 'b')!;
    expect(movedA.start).to.equal('2025-03-09');
    expect(movedA.end).to.equal('2025-03-10');
    expect(successorB.start).to.equal('2025-03-10');
  });
});

premiumStoreClasses.forEach((storeClass) => {
  describe(`applyInternalDragOrResizeOccurrencePlaceholder - ${storeClass.name}`, () => {
    it('should snap a timeline drop of an all-day occurrence to whole days', () => {
      const builder = utcJuly4AllDayBuilder().id('holiday').withDisplayTimezone('UTC');
      const occurrence = builder.toOccurrence();
      const onEventsChange = vi.fn();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [builder.build()],
        displayTimezone: 'UTC',
        onEventsChange,
      });

      // Dragged by a day and a half: the day under the start, with the day count of the event.
      applyInternalDragOrResizeOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'internal-drag',
          surfaceType: 'timeline',
          eventId: 'holiday',
          occurrenceKey: occurrence.key,
          originalOccurrence: occurrence,
          allDay: occurrence.allDay ?? false,
          sourceResourceId: null,
          resourceId: null,
          start: createDate('2025-07-05T12:00:00Z').getTime(),
          end: createDate('2025-07-06T12:00:00Z').getTime(),
        },
      );

      const updated = onEventsChange.mock.lastCall![0].find(
        (item: SchedulerEvent) => item.id === 'holiday',
      );
      expect(updated.start).to.equal('2025-07-05');
      expect(updated.end).to.equal('2025-07-06');
    });

    it('should keep one day when an all-day occurrence is resized into its own day on the timeline', () => {
      const builder = utcJuly4AllDayBuilder().id('holiday').withDisplayTimezone('UTC');
      const occurrence = builder.toOccurrence();
      const onEventsChange = vi.fn();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [builder.build()],
        displayTimezone: 'UTC',
        onEventsChange,
      });

      applyInternalDragOrResizeOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'internal-resize',
          surfaceType: 'timeline',
          eventId: 'holiday',
          occurrenceKey: occurrence.key,
          originalOccurrence: occurrence,
          allDay: occurrence.allDay ?? false,
          sourceResourceId: null,
          resourceId: null,
          start: occurrence.start.epochMilliseconds,
          end: createDate('2025-07-04T15:00:00Z').getTime(),
        },
      );

      // The end snaps to the start of the next day, the bound the occurrence already has.
      expect(onEventsChange.mock.calls.length).to.equal(0);
    });

    it('should keep the days of a timed event spanning days when it is dragged on the day grid', () => {
      // Tuesday 09:00 to Thursday 17:00, rendered in the day grid, dragged one day later.
      const builder = EventBuilder.new()
        .id('offsite')
        .span('2025-07-01T09:00:00Z', '2025-07-03T17:00:00Z')
        .withDisplayTimezone('UTC');
      const occurrence = builder.toOccurrence();
      const onEventsChange = vi.fn();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [builder.build()],
        displayTimezone: 'UTC',
        onEventsChange,
      });

      applyInternalDragOrResizeOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'internal-drag',
          surfaceType: 'day-grid',
          eventId: 'offsite',
          occurrenceKey: occurrence.key,
          originalOccurrence: occurrence,
          allDay: true,
          sourceResourceId: null,
          resourceId: null,
          start: createDate('2025-07-02T09:00:00Z').getTime(),
          end: createDate('2025-07-04T17:00:00Z').getTime(),
        },
        () => ({ allDay: true }),
      );

      const updated = onEventsChange.mock.lastCall![0].find(
        (item: SchedulerEvent) => item.id === 'offsite',
      );
      expect(updated.allDay).to.equal(true);
      expect(updated.start).to.equal('2025-07-02');
      expect(updated.end).to.equal('2025-07-05');
    });

    it('should make a timed event dropped on the day grid a one-day all-day event', () => {
      // Monday 22:00 to Tuesday 02:00, dropped on Wednesday July 9th: the day cell hands the drop
      // the day it covers.
      const builder = EventBuilder.new()
        .id('late')
        .span('2025-07-07T22:00:00Z', '2025-07-08T02:00:00Z')
        .withDisplayTimezone('UTC');
      const occurrence = builder.toOccurrence();
      const onEventsChange = vi.fn();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [builder.build()],
        displayTimezone: 'UTC',
        onEventsChange,
      });

      applyInternalDragOrResizeOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'internal-drag',
          surfaceType: 'day-grid',
          eventId: 'late',
          occurrenceKey: occurrence.key,
          originalOccurrence: occurrence,
          allDay: occurrence.allDay ?? false,
          sourceResourceId: null,
          resourceId: null,
          start: createDate('2025-07-09T00:00:00Z').getTime(),
          end: createDate('2025-07-10T00:00:00Z').getTime(),
        },
        () => ({ allDay: true }),
      );

      const updated = onEventsChange.mock.lastCall![0].find(
        (item: SchedulerEvent) => item.id === 'late',
      );
      expect(updated.allDay).to.equal(true);
      expect(updated.start).to.equal('2025-07-09');
      expect(updated.end).to.equal('2025-07-10');
      expect(() => processEvent(updated, 'UTC')).not.to.throw();
    });

    it('should make a timed event without duration dropped on the day grid a one-day all-day event', () => {
      const builder = EventBuilder.new()
        .id('reminder')
        .span('2025-07-07T00:00:00Z', '2025-07-07T00:00:00Z')
        .withDisplayTimezone('UTC');
      const occurrence = builder.toOccurrence();
      const onEventsChange = vi.fn();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [builder.build()],
        displayTimezone: 'UTC',
        onEventsChange,
      });

      applyInternalDragOrResizeOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'internal-drag',
          surfaceType: 'day-grid',
          eventId: 'reminder',
          occurrenceKey: occurrence.key,
          originalOccurrence: occurrence,
          allDay: true,
          sourceResourceId: null,
          resourceId: null,
          start: createDate('2025-07-09T00:00:00Z').getTime(),
          end: createDate('2025-07-09T00:00:00Z').getTime(),
        },
        () => ({ allDay: true }),
      );

      const updated = onEventsChange.mock.lastCall![0].find(
        (item: SchedulerEvent) => item.id === 'reminder',
      );
      expect(updated.start).to.equal('2025-07-09');
      expect(updated.end).to.equal('2025-07-10');
    });

    it('should give an external all-day drop at least one day on the day grid', () => {
      const onEventsChange = vi.fn();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [],
        displayTimezone: 'UTC',
        onEventsChange,
      });

      applyExternalDragOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'external-drag',
          surfaceType: 'day-grid',
          resourceId: null,
          start: createDate('2025-07-09T00:00:00Z').getTime(),
          end: createDate('2025-07-09T01:00:00Z').getTime(),
          eventData: { id: 'dropped', title: 'Dropped', allDay: true, duration: 60 },
        },
      );

      const created: SchedulerEvent = onEventsChange.mock.lastCall![0][0];
      expect(created.allDay).to.equal(true);
      expect(created.start).to.equal('2025-07-09');
      expect(created.end).to.equal('2025-07-10');
    });

    it('should keep the untouched start of a recurring all-day occurrence resized from another timezone', () => {
      // An all-day weekly series on Fridays displayed in New York: extending only the end with
      // scope 'all' must not read the start as a day move.
      const builder = utcJuly4AllDayBuilder()
        .id('holiday')
        .recurrent('WEEKLY')
        .withDisplayTimezone('America/New_York');
      const event = builder.build();
      const occurrence = builder.toOccurrence();
      const onEventsChange = vi.fn();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [event],
        displayTimezone: 'America/New_York',
        onEventsChange,
      });

      applyInternalDragOrResizeOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'internal-resize',
          surfaceType: 'day-grid',
          eventId: 'holiday',
          occurrenceKey: occurrence.key,
          originalOccurrence: occurrence,
          allDay: occurrence.allDay ?? false,
          sourceResourceId: null,
          resourceId: null,
          start: occurrence.start.epochMilliseconds,
          // One more day.
          end: addDays(new Date(occurrence.end.epochMilliseconds), 1).getTime(),
        },
      );
      store.selectRecurringEventScope('all');

      const updated = onEventsChange.mock.lastCall![0].find(
        (item: SchedulerEvent) => item.id === 'holiday',
      );
      expect(updated.start).to.equal(event.start);
      expect(updated.rrule).to.deep.equal(event.rrule);
      expect(updated.end).to.equal('2025-07-06');
    });

    it('should keep the untouched start of an edited all-day occurrence resized from another timezone', () => {
      // An all-day event on July 4th displayed in New York: extending only the end while the
      // occurrence is armed must keep the edited occurrence's start on July 4th.
      const builder = utcJuly4AllDayBuilder().id('holiday').withDisplayTimezone('America/New_York');
      const occurrence = builder.toOccurrence();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [builder.build()],
        displayTimezone: 'America/New_York',
        onEventsChange: vi.fn(),
      });
      store.startEditing(occurrence, 'armed');

      applyInternalDragOrResizeOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'internal-resize',
          surfaceType: 'day-grid',
          eventId: 'holiday',
          occurrenceKey: occurrence.key,
          originalOccurrence: occurrence,
          allDay: occurrence.allDay ?? false,
          sourceResourceId: null,
          resourceId: null,
          start: occurrence.start.epochMilliseconds,
          // One more day.
          end: addDays(new Date(occurrence.end.epochMilliseconds), 1).getTime(),
        },
      );

      const edited = store.state.editingOccurrence!.occurrence as SchedulerEventOccurrence;
      expect(edited.start).to.equal(occurrence.start);
      // July 6th 00:00 in New York.
      expect(new Date(edited.end.epochMilliseconds).toISOString()).to.equal(
        '2025-07-06T04:00:00.000Z',
      );
    });

    it('should resend both bounds when the drop toggles all-day off', () => {
      // An all-day event on July 4th displayed in New York, dropped on the time grid at its first
      // instant: both bounds are written in New York, the timezone the event moves to.
      const builder = utcJuly4AllDayBuilder().id('holiday').withDisplayTimezone('America/New_York');
      const occurrence = builder.toOccurrence();
      const onEventsChange = vi.fn();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [builder.build()],
        displayTimezone: 'America/New_York',
        onEventsChange,
      });
      const start = new Date(occurrence.start.epochMilliseconds);
      const end = addHours(start, 1);

      applyInternalDragOrResizeOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'internal-drag',
          surfaceType: 'time-grid',
          eventId: 'holiday',
          occurrenceKey: occurrence.key,
          originalOccurrence: occurrence,
          allDay: occurrence.allDay ?? false,
          sourceResourceId: null,
          resourceId: null,
          start: start.getTime(),
          end: end.getTime(),
        },
        () => ({ allDay: false }),
      );

      const updated = onEventsChange.mock.lastCall![0].find(
        (item: SchedulerEvent) => item.id === 'holiday',
      );
      expect(updated.allDay).to.not.equal(true);
      expect(updated.timezone).to.equal('America/New_York');
      expect(updated.start).to.equal('2025-07-04T00:00:00');
      expect(updated.end).to.equal('2025-07-04T01:00:00');
    });

    it('should make the armed occurrence timed when it is dropped into the time grid', () => {
      const builder = utcJuly4AllDayBuilder().id('holiday').withDisplayTimezone('UTC');
      const occurrence = builder.toOccurrence();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [builder.build()],
        displayTimezone: 'UTC',
        onEventsChange: vi.fn(),
      });
      store.startEditing(occurrence, 'armed');
      const start = createDate('2025-07-04T10:00:00Z');

      applyInternalDragOrResizeOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'internal-drag',
          surfaceType: 'time-grid',
          eventId: 'holiday',
          occurrenceKey: occurrence.key,
          originalOccurrence: occurrence,
          allDay: occurrence.allDay ?? false,
          sourceResourceId: null,
          resourceId: null,
          start: start.getTime(),
          end: addHours(start, 1).getTime(),
        },
        () => ({ allDay: false }),
      );

      // The form opened from the armed toolbar reads these: the dropped times, not whole days.
      const edited = store.state.editingOccurrence!.occurrence as SchedulerEventOccurrence;
      expect(edited.allDay).to.equal(false);
      expect(edited.start.toPlainDateTime().toString()).to.equal('2025-07-04T10:00:00');
      expect(edited.end.toPlainDateTime().toString()).to.equal('2025-07-04T11:00:00');
    });
  });
});
