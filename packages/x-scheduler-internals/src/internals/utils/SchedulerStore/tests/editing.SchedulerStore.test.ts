import { adapter, ResourceBuilder, storeClasses } from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { schedulerOtherSelectors } from '../../../../scheduler-selectors';
import { processDate } from '../../../../process-date';
import { getOccurrenceKey, getRecurringOccurrenceKey } from '../../event-utils';

const DEFAULT_PARAMS = {
  events: [] as SchedulerEvent[],
  resources: [ResourceBuilder.new().build()],
};

const RRULE = { freq: 'DAILY' } as any;

// A minimal edited occurrence of a recurring series (only the fields `repointEditingOccurrence` reads).
function armRecurringOccurrence(store: any) {
  const editedOccurrence = {
    id: 'standup',
    key: 'standup::2025-07-07',
    displayTimezone: {
      start: processDate(adapter.date('2025-07-07T09:00:00Z', 'default'), adapter),
      end: processDate(adapter.date('2025-07-07T10:00:00Z', 'default'), adapter),
      rrule: RRULE,
    },
  } as any;
  store.startEditing(editedOccurrence, 'armed');
}

storeClasses.forEach((storeClass) => {
  describe(`Editing - ${storeClass.name}`, () => {
    // `repointEditingOccurrence` is private; it runs as part of confirming a recurring scope change from
    // the armed state. Exercised directly here to pin the key re-derivation and `rrule` clearing.
    describe('repointEditingOccurrence', () => {
      const newStart = adapter.date('2025-07-08T09:30:00Z', 'default');
      const newEnd = adapter.date('2025-07-08T10:30:00Z', 'default');

      it('should re-point an `only-this` detach to a non-recurring key and clear the rrule', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
        armRecurringOccurrence(store);

        (store as any).repointEditingOccurrence('detached-event', newStart, newEnd, false);

        const occurrence = schedulerOtherSelectors.editingOccurrence(store.state)!;
        expect(occurrence.id).to.equal('detached-event');
        // A detached one-off keys by the plain event id (no `::day` suffix)...
        expect(occurrence.key).to.equal(getOccurrenceKey('detached-event'));
        expect(occurrence.key).to.not.contain('::');
        // ...and drops its recurrence rule, so the toolbar's Delete removes it directly instead of
        // reopening the recurring scope dialog.
        expect(occurrence.displayTimezone.rrule).to.equal(undefined);
        expect(occurrence.displayTimezone.start.value).toEqualDateTime(newStart);
        expect(occurrence.displayTimezone.end.value).toEqualDateTime(newEnd);
      });

      it('should re-point a `this-and-following` change to a recurring key and keep the rrule', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
        armRecurringOccurrence(store);

        (store as any).repointEditingOccurrence('following-event', newStart, newEnd, true);

        const occurrence = schedulerOtherSelectors.editingOccurrence(store.state)!;
        expect(occurrence.id).to.equal('following-event');
        // The new series still keys per-occurrence (event id + day)...
        expect(occurrence.key).to.equal(
          getRecurringOccurrenceKey('following-event', newStart, adapter),
        );
        expect(occurrence.key).to.contain('::');
        // ...and stays recurring, so its Delete keeps offering the scope dialog.
        expect(occurrence.displayTimezone.rrule).to.equal(RRULE);
        expect(occurrence.displayTimezone.start.value).toEqualDateTime(newStart);
        expect(occurrence.displayTimezone.end.value).toEqualDateTime(newEnd);
      });

      it('should be a no-op when nothing is being edited', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);

        (store as any).repointEditingOccurrence('detached-event', newStart, newEnd, false);

        expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
      });
    });
  });
});
