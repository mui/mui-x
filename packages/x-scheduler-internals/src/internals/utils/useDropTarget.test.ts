import {
  adapter,
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
      // A UTC weekly series on Fridays, displayed on Thursday July 3 in New York: extending
      // only the end with scope 'all' must not read the displayed start as a day move.
      const builder = utcJuly4AllDayBuilder()
        .id('holiday')
        .recurrent('WEEKLY')
        .withDisplayTimezone('America/New_York');
      const event = builder.build();
      const occurrence = builder.toOccurrence();
      const onEventsChange = vi.fn();
      const store = new storeClass.Value(
        {
          resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
          events: [event],
          displayTimezone: 'America/New_York',
          onEventsChange,
        },
        adapter,
      );

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
          start: occurrence.displayTimezone.start.value,
          end: adapter.addDays(occurrence.displayTimezone.end.value, 1),
        },
      );
      store.selectRecurringEventScope('all');

      const updated = onEventsChange.mock.lastCall![0].find(
        (item: SchedulerEvent) => item.id === 'holiday',
      );
      expect(updated.start).to.equal(event.start);
      expect(updated.rrule).to.deep.equal(event.rrule);
      expect(updated.end).to.not.equal(event.end);
    });

    it('should keep the untouched start of an edited all-day occurrence resized from another timezone', () => {
      // A UTC all-day event displayed on July 3 in New York: extending only the end while the
      // occurrence is armed must keep the edited occurrence's start on July 4 in UTC.
      const builder = utcJuly4AllDayBuilder().id('holiday').withDisplayTimezone('America/New_York');
      const occurrence = builder.toOccurrence();
      const store = new storeClass.Value(
        {
          resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
          events: [builder.build()],
          displayTimezone: 'America/New_York',
          onEventsChange: vi.fn(),
        },
        adapter,
      );
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
          start: occurrence.displayTimezone.start.value,
          end: adapter.addDays(occurrence.displayTimezone.end.value, 1),
        },
      );

      const edited = store.state.editingOccurrence!.occurrence as SchedulerEventOccurrence;
      expect(edited.dataTimezone.start).to.equal(occurrence.dataTimezone.start);
      expect(edited.displayTimezone.start).to.equal(occurrence.displayTimezone.start);
      expect(edited.dataTimezone.end.timestamp).to.not.equal(occurrence.dataTimezone.end.timestamp);
    });

    it('should resend both bounds when the drop toggles all-day off', () => {
      // A UTC all-day event displayed from July 3 00:00 in New York, dropped on the time grid at
      // that same instant: the displayed start is unchanged but the stored one (20:00 that
      // evening) would end up after the new end.
      const builder = utcJuly4AllDayBuilder().id('holiday').withDisplayTimezone('America/New_York');
      const occurrence = builder.toOccurrence();
      const onEventsChange = vi.fn();
      const store = new storeClass.Value(
        {
          resources: [ResourceBuilder.new().id('r1').title('Resource 1').build()],
          events: [builder.build()],
          displayTimezone: 'America/New_York',
          onEventsChange,
        },
        adapter,
      );
      const start = occurrence.displayTimezone.start.value;
      const end = adapter.addHours(start, 1);

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
          start,
          end,
        },
        () => ({ allDay: false }),
      );

      const updated = onEventsChange.mock.lastCall![0].find(
        (item: SchedulerEvent) => item.id === 'holiday',
      );
      expect(updated.allDay).to.not.equal(true);
      expect(adapter.date(updated.start, 'UTC')).toEqualDateTime(
        adapter.date('2025-07-03T04:00:00', 'UTC'),
      );
      expect(adapter.date(updated.end, 'UTC')).toEqualDateTime(
        adapter.date('2025-07-03T05:00:00', 'UTC'),
      );
    });
  });
});
