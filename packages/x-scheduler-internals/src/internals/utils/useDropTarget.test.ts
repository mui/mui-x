import {
  adapter,
  premiumStoreClasses,
  ResourceBuilder,
  utcJuly4AllDayBuilder,
} from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
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
  });
});
