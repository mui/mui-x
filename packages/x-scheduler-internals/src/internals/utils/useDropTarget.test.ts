import {
  addDays,
  addHours,
  createDate,
  premiumStoreClasses,
  ResourceBuilder,
  utcJuly4AllDayBuilder,
} from 'test/utils/scheduler';
import type { SchedulerEvent, SchedulerEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { SchedulerStoreInContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { describe, it, expect, vi } from 'vitest';
import { applyInternalDragOrResizeOccurrencePlaceholder } from './useDropTarget';

premiumStoreClasses.forEach((storeClass) => {
  describe(`applyInternalDragOrResizeOccurrencePlaceholder - ${storeClass.name}`, () => {
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
          sourceResourceId: null,
          resourceId: null,
          start: occurrence.start.timestamp,
          // One more day.
          end: addDays(new Date(occurrence.end.timestamp), 1).getTime(),
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
          sourceResourceId: null,
          resourceId: null,
          start: occurrence.start.timestamp,
          // One more day.
          end: addDays(new Date(occurrence.end.timestamp), 1).getTime(),
        },
      );

      const edited = store.state.editingOccurrence!.occurrence as SchedulerEventOccurrence;
      expect(edited.start).to.equal(occurrence.start);
      // July 6th 00:00 in New York.
      expect(new Date(edited.end.timestamp).toISOString()).to.equal('2025-07-06T04:00:00.000Z');
    });

    it('should resend both bounds when the drop toggles all-day off', () => {
      // An all-day event on July 4th displayed in New York, dropped on the time grid at its first
      // instant: both bounds are written as instants.
      const builder = utcJuly4AllDayBuilder().id('holiday').withDisplayTimezone('America/New_York');
      const occurrence = builder.toOccurrence();
      const onEventsChange = vi.fn();
      const store = new storeClass.Value({
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
        events: [builder.build()],
        displayTimezone: 'America/New_York',
        onEventsChange,
      });
      const start = new Date(occurrence.start.timestamp);
      const end = addHours(start, 1);

      applyInternalDragOrResizeOccurrencePlaceholder(
        store as unknown as SchedulerStoreInContext<any, any>,
        {
          type: 'internal-drag',
          surfaceType: 'time-grid',
          eventId: 'holiday',
          occurrenceKey: occurrence.key,
          originalOccurrence: occurrence,
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
      // July 4th 00:00 in New York.
      expect(createDate(updated.start, 'UTC')).toEqualDateTime(
        createDate('2025-07-04T04:00:00', 'UTC'),
      );
      expect(createDate(updated.end, 'UTC')).toEqualDateTime(
        createDate('2025-07-04T05:00:00', 'UTC'),
      );
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
      expect(edited.start.plainDateTime.toString()).to.equal('2025-07-04T10:00:00');
      expect(edited.end.plainDateTime.toString()).to.equal('2025-07-04T11:00:00');
    });
  });
});
