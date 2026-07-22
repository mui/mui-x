import {
  adapter,
  EventBuilder,
  premiumStoreClasses,
  ResourceBuilder,
  storeClasses,
} from 'test/utils/scheduler';
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

        (store as any).repointEditingOccurrence(
          'detached-event',
          newStart,
          newEnd,
          false,
          'default',
        );

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

        (store as any).repointEditingOccurrence(
          'following-event',
          newStart,
          newEnd,
          true,
          'default',
        );

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

      it('should derive the recurring key from the data timezone, not the display-timezone start', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
        armRecurringOccurrence(store);

        // 23:00 on the 8th in America/New_York is 03:00 UTC on the 9th: the display and data days differ.
        const displayStart = adapter.date('2025-07-08T23:00:00', 'America/New_York');
        const displayEnd = adapter.addHours(displayStart, 1);

        (store as any).repointEditingOccurrence(
          'following-event',
          displayStart,
          displayEnd,
          true,
          'UTC',
        );

        const occurrence = schedulerOtherSelectors.editingOccurrence(store.state)!;
        // Rendered keys expand in the data timezone, so the repointed key must match the data-tz day...
        expect(occurrence.key).to.equal(
          getRecurringOccurrenceKey(
            'following-event',
            adapter.setTimezone(displayStart, 'UTC'),
            adapter,
          ),
        );
        // ...and must not use the display-timezone day, which differs here.
        expect(occurrence.key).to.not.equal(
          getRecurringOccurrenceKey('following-event', displayStart, adapter),
        );
      });

      it('should be a no-op when nothing is being edited', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);

        (store as any).repointEditingOccurrence(
          'detached-event',
          newStart,
          newEnd,
          false,
          'default',
        );

        expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
      });
    });
  });
});

// A recurring scope change must only re-point the surface when the armed occurrence is the resized one.
premiumStoreClasses.forEach((storeClass) => {
  describe(`Editing recurring scope - ${storeClass.name}`, () => {
    const RECURRING_EVENT = EventBuilder.new()
      .id('standup')
      .startAt('2025-07-07T09:00:00Z')
      .endAt('2025-07-07T10:00:00Z')
      .recurrent('DAILY')
      .build();

    const dayA = adapter.date('2025-07-07T09:00:00Z', 'default');
    const dayB = adapter.date('2025-07-08T09:00:00Z', 'default');

    function createStore() {
      // `onEventsChange` keeps the (controlled) `events` prop update from warning as ignored.
      return new storeClass.Value(
        { ...DEFAULT_PARAMS, events: [RECURRING_EVENT], onEventsChange: () => {} },
        adapter,
      );
    }

    function armOccurrence(store: any, occurrenceStart: ReturnType<typeof adapter.date>) {
      store.startEditing(
        {
          id: 'standup',
          key: getRecurringOccurrenceKey('standup', occurrenceStart, adapter),
          displayTimezone: {
            start: processDate(occurrenceStart, adapter),
            end: processDate(adapter.addHours(occurrenceStart, 1), adapter),
            rrule: RRULE,
          },
        } as any,
        'armed',
      );
    }

    it('should keep the armed occurrence when a different occurrence is resized', () => {
      const store = createStore();
      const armedKey = getRecurringOccurrenceKey('standup', dayA, adapter);
      armOccurrence(store, dayA);

      // Resize occurrence B (the 8th), then confirm the scope.
      store.updateRecurringEvent({
        occurrenceStart: dayB,
        changes: {
          id: 'standup',
          start: adapter.addMinutes(dayB, 30),
          end: adapter.addMinutes(dayB, 90),
        },
      });
      store.selectRecurringEventScope('this-and-following');

      const occurrence = schedulerOtherSelectors.editingOccurrence(store.state)!;
      expect(occurrence.id).to.equal('standup');
      expect(occurrence.key).to.equal(armedKey);
    });

    it('should re-point when the armed occurrence itself is resized', () => {
      const store = createStore();
      const armedKey = getRecurringOccurrenceKey('standup', dayA, adapter);
      armOccurrence(store, dayA);

      const resizedStart = adapter.addMinutes(dayA, 30);
      const resizedEnd = adapter.addMinutes(dayA, 90);
      // Resize occurrence A (the armed one), then confirm the scope.
      store.updateRecurringEvent({
        occurrenceStart: dayA,
        changes: { id: 'standup', start: resizedStart, end: resizedEnd },
      });
      store.selectRecurringEventScope('this-and-following');

      const occurrence = schedulerOtherSelectors.editingOccurrence(store.state)!;
      // The occurrence followed the resize onto the freshly-split event: new key, updated times.
      expect(occurrence.key).to.not.equal(armedKey);
      expect(occurrence.displayTimezone.start.value).toEqualDateTime(resizedStart);
      expect(occurrence.displayTimezone.end.value).toEqualDateTime(resizedEnd);
    });
  });
});
