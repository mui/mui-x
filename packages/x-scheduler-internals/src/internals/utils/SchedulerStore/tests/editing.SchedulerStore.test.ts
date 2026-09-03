import {
  adapter,
  EventBuilder,
  utcJuly4AllDayBuilder,
  premiumStoreClasses,
  ResourceBuilder,
  storeClasses,
} from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { EventCalendarStore } from '@mui/x-scheduler-internals/use-event-calendar';
import { EventCalendarPremiumStore } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import { schedulerRecurringEventsPlugin } from '@mui/x-scheduler-internals-premium/internals';
import { processEvent } from '@mui/x-scheduler-internals/process-event';
import { vi, describe, it, expect } from 'vitest';
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
  const start = processDate(adapter.date('2025-07-07T09:00:00Z', 'default'), adapter);
  const end = processDate(adapter.date('2025-07-07T10:00:00Z', 'default'), adapter);
  const editedOccurrence = {
    id: 'standup',
    key: 'standup::2025-07-07',
    displayTimezone: { start, end, rrule: RRULE },
    // Present on every real occurrence: without it the repoint skips the data-timezone
    // identity branch these tests are about.
    dataTimezone: { timezone: 'default', start, end, rrule: RRULE },
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

        (store as any).repointEditingOccurrence({
          eventId: 'detached-event',
          start: newStart,
          end: newEnd,
          isRecurring: false,
          dataStart: newStart,
          dataEnd: newEnd,
        });

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

        (store as any).repointEditingOccurrence({
          eventId: 'following-event',
          start: newStart,
          end: newEnd,
          isRecurring: true,
          dataStart: newStart,
          dataEnd: newEnd,
        });

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

        (store as any).repointEditingOccurrence({
          eventId: 'following-event',
          start: displayStart,
          end: displayEnd,
          isRecurring: true,
          dataStart: adapter.setTimezone(displayStart, 'UTC'),
          dataEnd: adapter.setTimezone(displayEnd, 'UTC'),
        });

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

        (store as any).repointEditingOccurrence({
          eventId: 'detached-event',
          start: newStart,
          end: newEnd,
          isRecurring: false,
          dataStart: newStart,
          dataEnd: newEnd,
        });

        expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
      });
    });

    // The edited occurrence is a snapshot; nothing re-checks that it is still rendered. Left behind
    // by a navigation, its action toolbar would edit or delete an event that is off screen.
    describe('navigation', () => {
      const uiEvent = {} as any;

      it('should stop editing when the visible date changes', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
        armRecurringOccurrence(store);

        store.goToDate(adapter.date('2025-07-14T00:00:00Z', 'default'), uiEvent);

        expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
      });

      it('should stop editing when a controlled visible date changes', () => {
        const parameters = {
          ...DEFAULT_PARAMS,
          visibleDate: adapter.date('2025-07-07T00:00:00Z', 'default'),
        };
        const store = new storeClass.Value(parameters, adapter);
        armRecurringOccurrence(store);

        store.updateStateFromParameters(
          { ...parameters, visibleDate: adapter.date('2025-07-14T00:00:00Z', 'default') },
          adapter,
        );

        expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
      });

      it('should keep editing when the parameters update without navigating', () => {
        const parameters = {
          ...DEFAULT_PARAMS,
          visibleDate: adapter.date('2025-07-07T00:00:00Z', 'default'),
        };
        const store = new storeClass.Value(parameters, adapter);
        armRecurringOccurrence(store);

        // A fresh date object holding the same instant is not a navigation.
        store.updateStateFromParameters(
          { ...parameters, visibleDate: adapter.date('2025-07-07T00:00:00Z', 'default') },
          adapter,
        );

        expect(schedulerOtherSelectors.editingOccurrence(store.state)).not.to.equal(null);
      });
    });

    describe('startEditing one-shot invariant', () => {
      function buildOccurrence() {
        return {
          id: 'standup',
          key: 'standup::2025-07-07',
          displayTimezone: {
            start: processDate(adapter.date('2025-07-07T09:00:00Z', 'default'), adapter),
            end: processDate(adapter.date('2025-07-07T10:00:00Z', 'default'), adapter),
          },
        } as any;
      }

      it('should not re-run `onEventEditingStart` when the occurrence is already open in the surface', () => {
        const onEventEditingStart = vi.fn();
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const occurrence = buildOccurrence();

        expect(store.startEditing(occurrence)).to.equal(true);
        expect(store.startEditing(occurrence)).to.equal(true);

        expect(onEventEditingStart.mock.calls.length).to.equal(1);
      });

      it('should run `onEventEditingStart` again when the previous start was canceled', () => {
        const onEventEditingStart = vi.fn((_occurrence: any, eventDetails: any) =>
          eventDetails.cancel(),
        );
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const occurrence = buildOccurrence();

        expect(store.startEditing(occurrence)).to.equal(false);
        expect(store.startEditing(occurrence)).to.equal(false);

        expect(onEventEditingStart.mock.calls.length).to.equal(2);
      });

      it('should run `onEventEditingStart` when the armed occurrence opens the surface', () => {
        const onEventEditingStart = vi.fn();
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const occurrence = buildOccurrence();

        store.startEditing(occurrence, 'armed');
        expect(onEventEditingStart.mock.calls.length).to.equal(0);

        store.setEditingMode('edit');
        expect(onEventEditingStart.mock.calls.length).to.equal(1);
      });
    });

    describe('`onEventEditingStart` positioning anchor', () => {
      function buildOccurrence() {
        return {
          id: 'standup',
          key: 'standup::2025-07-07',
          displayTimezone: {
            start: processDate(adapter.date('2025-07-07T09:00:00Z', 'default'), adapter),
            end: processDate(adapter.date('2025-07-07T10:00:00Z', 'default'), adapter),
          },
        } as any;
      }

      it('should expose the trigger as `anchor` when no dedicated anchor is provided', () => {
        const onEventEditingStart = vi.fn();
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const trigger = document.createElement('button');

        store.startEditing(buildOccurrence(), 'edit', undefined, trigger);

        expect(onEventEditingStart.mock.lastCall?.[1].trigger).to.equal(trigger);
        expect(onEventEditingStart.mock.lastCall?.[1].anchor).to.equal(trigger);
      });

      it('should expose the dedicated anchor without replacing the trigger', () => {
        const onEventEditingStart = vi.fn();
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const trigger = document.createElement('button');
        const anchor = document.createElement('div');

        store.startEditing(buildOccurrence(), 'edit', undefined, trigger, anchor);

        expect(onEventEditingStart.mock.lastCall?.[1].trigger).to.equal(trigger);
        expect(onEventEditingStart.mock.lastCall?.[1].anchor).to.equal(anchor);
      });

      it('should forward the dedicated anchor when the armed occurrence opens the surface', () => {
        const onEventEditingStart = vi.fn();
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const trigger = document.createElement('button');
        const anchor = document.createElement('div');

        store.startEditing(buildOccurrence(), 'armed');
        store.setEditingMode('edit', undefined, trigger, anchor);

        expect(onEventEditingStart.mock.lastCall?.[1].trigger).to.equal(trigger);
        expect(onEventEditingStart.mock.lastCall?.[1].anchor).to.equal(anchor);
      });
    });
  });
});

// A recurring scope change re-points the surface only when the armed occurrence is the changed one,
// and drops it when an in-place change moves that occurrence off its day or edits the rule.
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
          dataTimezone: {
            timezone: 'default',
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

    it('should keep the data-timezone identity in sync when the armed occurrence is resized', () => {
      const store = createStore();
      armOccurrence(store, dayA);

      const resizedStart = adapter.addMinutes(dayA, 30);
      const resizedEnd = adapter.addMinutes(dayA, 90);
      store.updateRecurringEvent({
        occurrenceStart: dayA,
        changes: { id: 'standup', start: resizedStart, end: resizedEnd },
      });
      store.selectRecurringEventScope('this-and-following');

      // A later edit or delete of the still-armed occurrence targets this identity:
      // left stale, it would anchor the operation on the pre-resize occurrence.
      const occurrence = schedulerOtherSelectors.editingOccurrence(store.state) as any;
      expect(occurrence.dataTimezone.start.value).toEqualDateTime(resizedStart);
      expect(occurrence.dataTimezone.end.value).toEqualDateTime(resizedEnd);
    });

    it("should disarm when a scope 'all' change moves the armed occurrence to another day", () => {
      const store = createStore();
      armOccurrence(store, dayB);

      // The pattern decides where the series lands after an in-place day move, so
      // re-keying onto the changed day could anchor the toolbar on a sibling — and a
      // follow-up Delete would exDate the wrong day.
      const movedStart = adapter.addHours(dayB, 25);
      const movedEnd = adapter.addHours(movedStart, 1);
      store.updateRecurringEvent({
        occurrenceStart: dayB,
        changes: { id: 'standup', start: movedStart, end: movedEnd },
      });
      store.selectRecurringEventScope('all');

      expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
    });

    it("should keep the armed occurrence on a same-day scope 'all' time change", () => {
      const store = createStore();
      const armedKey = getRecurringOccurrenceKey('standup', dayB, adapter);
      armOccurrence(store, dayB);

      const movedStart = adapter.addHours(dayB, 1);
      const movedEnd = adapter.addHours(movedStart, 1);
      store.updateRecurringEvent({
        occurrenceStart: dayB,
        changes: { id: 'standup', start: movedStart, end: movedEnd },
      });
      store.selectRecurringEventScope('all');

      const occurrence = schedulerOtherSelectors.editingOccurrence(store.state) as any;
      expect(occurrence.key).to.equal(armedKey);
      expect(occurrence.dataTimezone.start.value).toEqualDateTime(movedStart);
      expect(occurrence.displayTimezone.rrule).to.not.equal(undefined);
    });

    it("should keep the armed occurrence on an end-only same-day scope 'all' change", () => {
      const store = createStore();
      const armedKey = getRecurringOccurrenceKey('standup', dayB, adapter);
      armOccurrence(store, dayB);

      // A resize handle or the dialog can submit a single bound; the untouched start
      // keeps the occurrence's own data-timezone identity.
      const extendedEnd = adapter.addHours(dayB, 3);
      store.updateRecurringEvent({
        occurrenceStart: dayB,
        changes: { id: 'standup', end: extendedEnd },
      });
      store.selectRecurringEventScope('all');

      const occurrence = schedulerOtherSelectors.editingOccurrence(store.state) as any;
      expect(occurrence.key).to.equal(armedKey);
      expect(occurrence.dataTimezone.start.value).toEqualDateTime(dayB);
      expect(occurrence.dataTimezone.end.value).toEqualDateTime(extendedEnd);
    });

    it("should disarm when an end-only scope 'all' change pushes the armed occurrence past its day", () => {
      const store = createStore();
      armOccurrence(store, dayB);

      store.updateRecurringEvent({
        occurrenceStart: dayB,
        changes: { id: 'standup', end: adapter.addHours(dayB, 25) },
      });
      store.selectRecurringEventScope('all');

      expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
    });

    // A store whose host feeds every change back into the controlled `events` prop.
    function createControlledStore(events: any[]) {
      let store: any;
      const parameters = {
        ...DEFAULT_PARAMS,
        events,
        onEventsChange: (nextEvents: any[]) =>
          store.updateStateFromParameters({ ...parameters, events: nextEvents }, adapter),
      };
      store = new storeClass.Value(parameters, adapter);
      return store;
    }

    it("should open the editor on the split series' rewritten rule", () => {
      const countedEvent = EventBuilder.new()
        .id('standup')
        .startAt('2025-07-07T09:00:00Z')
        .endAt('2025-07-07T10:00:00Z')
        .recurrent('DAILY', { count: 10 })
        .build();
      const store = createControlledStore([countedEvent]);
      const fourth = adapter.addDays(dayA, 3);
      armOccurrence(store, fourth);

      store.updateRecurringEvent({
        occurrenceStart: fourth,
        changes: {
          id: 'standup',
          start: adapter.addMinutes(fourth, 30),
          end: adapter.addMinutes(fourth, 90),
        },
      });
      store.selectRecurringEventScope('this-and-following');
      // Edit from the still-armed toolbar.
      store.setEditingMode('edit');

      // Seven occurrences remain from the fourth: the editor must seed that count, not the
      // original series' ten the armed snapshot was taken with.
      const occurrence = schedulerOtherSelectors.editingOccurrence(store.state) as any;
      expect(occurrence.id).to.not.equal('standup');
      expect(occurrence.displayTimezone.rrule.count).to.equal(7);
      expect(occurrence.dataTimezone.rrule.count).to.equal(7);
    });

    it("should open the editor on the split series' realigned BYDAY", () => {
      const weeklyEvent = EventBuilder.new()
        .id('standup')
        .startAt('2025-07-07T09:00:00Z')
        .endAt('2025-07-07T10:00:00Z')
        .recurrent('WEEKLY')
        .build();
      const store = createControlledStore([weeklyEvent]);
      const secondMonday = adapter.addDays(dayA, 7);
      armOccurrence(store, secondMonday);

      // Move the second Monday to Tuesday with "this and following".
      const movedStart = adapter.addDays(secondMonday, 1);
      store.updateRecurringEvent({
        occurrenceStart: secondMonday,
        changes: { id: 'standup', start: movedStart, end: adapter.addHours(movedStart, 1) },
      });
      store.selectRecurringEventScope('this-and-following');
      store.setEditingMode('edit');

      const occurrence = schedulerOtherSelectors.editingOccurrence(store.state) as any;
      expect(occurrence.dataTimezone.rrule.byDay).to.deep.equal(['TU']);
      expect(occurrence.displayTimezone.rrule.byDay).to.deep.equal(['TU']);
    });

    it("should disarm when a scope 'all' change removes the recurrence", () => {
      const store = createStore();
      armOccurrence(store, dayA);

      // "Does not repeat" sends an explicit `rrule: undefined`.
      store.updateRecurringEvent({
        occurrenceStart: dayA,
        changes: { id: 'standup', rrule: undefined },
      });
      store.selectRecurringEventScope('all');

      expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
    });

    describe('viewed from another timezone', () => {
      // A 23:00 UTC daily series viewed from Tokyo renders at 08:00 the next Tokyo day.
      const lateBuilder = EventBuilder.new()
        .id('late')
        .withDataTimezone('UTC')
        .span('2025-07-07T23:00:00', '2025-07-07T23:30:00')
        .recurrent('DAILY')
        .withDisplayTimezone('Asia/Tokyo');

      function armTokyoOccurrence() {
        const store = new storeClass.Value(
          {
            ...DEFAULT_PARAMS,
            events: [lateBuilder.build()],
            displayTimezone: 'Asia/Tokyo',
            onEventsChange: () => {},
          },
          adapter,
        );
        const base = lateBuilder.toOccurrence('2025-07-08T23:00:00Z') as any;
        const armed = {
          ...base,
          key: getRecurringOccurrenceKey('late', base.dataTimezone.start.value, adapter),
        };
        store.startEditing(armed, 'armed');
        return { store, armed };
      }

      function moveArmedWithScopeAll(
        store: any,
        armed: any,
        startInTokyo: string,
        endInTokyo: string,
      ) {
        store.updateRecurringEvent({
          occurrenceStart: armed.dataTimezone.start.value,
          changes: {
            id: 'late',
            start: adapter.date(startInTokyo, 'Asia/Tokyo'),
            end: adapter.date(endInTokyo, 'Asia/Tokyo'),
          },
        });
        store.selectRecurringEventScope('all');
      }

      it('should keep the armed occurrence when it stays on its day in both timezones', () => {
        const { store, armed } = armTokyoOccurrence();

        // 07:00 Tokyo July 9th is 22:00 UTC July 8th: same day on both sides.
        moveArmedWithScopeAll(store, armed, '2025-07-09T07:00:00', '2025-07-09T07:30:00');

        const occurrence = schedulerOtherSelectors.editingOccurrence(store.state) as any;
        expect(occurrence.key).to.equal(armed.key);
      });

      it('should disarm when the occurrence changes day in the data timezone only', () => {
        const { store, armed } = armTokyoOccurrence();

        // 10:00 Tokyo July 9th is still the displayed Tokyo day, but 01:00 UTC July 9th
        // leaves the occurrence's own July 8th: a display-day comparison would keep it.
        moveArmedWithScopeAll(store, armed, '2025-07-09T10:00:00', '2025-07-09T10:30:00');

        expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
      });

      it('should disarm when the occurrence changes day in the display timezone only', () => {
        const { store, armed } = armTokyoOccurrence();

        // 19:00 Tokyo July 8th is 10:00 UTC July 8th: same data day, but the displayed day
        // moved from July 9th to July 8th, which can flip the rule's display projection.
        moveArmedWithScopeAll(store, armed, '2025-07-08T19:00:00', '2025-07-08T19:30:00');

        expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
      });
    });

    it("should disarm when a scope 'all' change edits the recurrence rule", () => {
      const store = createStore();
      armOccurrence(store, dayA);

      // A new rule re-expands the series in place: the armed day may no longer be an
      // occurrence, so the surface is dropped instead of re-keyed.
      store.updateRecurringEvent({
        occurrenceStart: dayA,
        changes: { id: 'standup', rrule: { freq: 'WEEKLY' } as any },
      });
      store.selectRecurringEventScope('all');

      expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
    });

    it('should re-point a rename-only scope change onto the detached event', () => {
      const store = createStore();
      const armedKey = getRecurringOccurrenceKey('standup', dayA, adapter);
      armOccurrence(store, dayA);

      // A rename carries no start/end in the changes.
      store.updateRecurringEvent({
        occurrenceStart: dayA,
        changes: { id: 'standup', title: 'Renamed standup' },
      });
      store.selectRecurringEventScope('only-this');

      const occurrence = schedulerOtherSelectors.editingOccurrence(store.state) as any;
      // The occurrence moved onto the detached one-off event, keeping its own times.
      expect(occurrence.id).to.not.equal('standup');
      expect(occurrence.key).to.not.equal(armedKey);
      expect(occurrence.displayTimezone.rrule).to.equal(undefined);
      expect(occurrence.displayTimezone.start.value).toEqualDateTime(dayA);
      expect(occurrence.displayTimezone.end.value).toEqualDateTime(adapter.addHours(dayA, 1));
      expect(occurrence.dataTimezone.rrule).to.equal(undefined);
      expect(occurrence.dataTimezone.start.timestamp).to.equal(adapter.getTime(dayA));
      expect(occurrence.dataTimezone.end.value).toEqualDateTime(adapter.addHours(dayA, 1));
    });

    it('should keep the data-timezone identity on a rename-only scope change from another timezone', () => {
      // A UTC all-day weekly series whose display bounds normalize to the previous
      // New York day; the second occurrence is armed so 'this-and-following' splits.
      const weeklyBuilder = utcJuly4AllDayBuilder()
        .id('weekly-tz')
        .recurrent('WEEKLY')
        .withDisplayTimezone('America/New_York');
      const store = new storeClass.Value(
        { ...DEFAULT_PARAMS, events: [weeklyBuilder.build()], onEventsChange: () => {} },
        adapter,
      );
      const base = weeklyBuilder.toOccurrence('2025-07-11T00:00:00Z') as any;
      // `toOccurrence` generates a random render key; the repoint matches on the
      // expansion key, which derives from the data-timezone day.
      const armed = {
        ...base,
        key: getRecurringOccurrenceKey('weekly-tz', base.dataTimezone.start.value, adapter),
      };
      store.startEditing(armed, 'armed');

      store.updateRecurringEvent({
        occurrenceStart: armed.dataTimezone.start.value,
        changes: { id: 'weekly-tz', title: 'Renamed weekly' },
      });
      store.selectRecurringEventScope('this-and-following');

      const occurrence = schedulerOtherSelectors.editingOccurrence(store.state) as any;
      // The split series expands keyed off the data-timezone day (July 11th); the
      // display bounds sit on July 10th and cannot stand in for the identity.
      expect(occurrence.id).to.not.equal('weekly-tz');
      expect(occurrence.key).to.equal(
        getRecurringOccurrenceKey(occurrence.id, armed.dataTimezone.start.value, adapter),
      );
      expect(occurrence.dataTimezone.start.timestamp).to.equal(
        adapter.getTime(adapter.date('2025-07-11T00:00:00', 'UTC')),
      );
      expect(occurrence.dataTimezone.timezone).to.equal('UTC');
      // A 'this-and-following' split stays recurring.
      expect(occurrence.displayTimezone.rrule).to.not.equal(undefined);
      expect(occurrence.dataTimezone.rrule).to.not.equal(undefined);
    });

    it('should keep a cross-timezone deleted occurrence excluded after the events round-trip through strings', () => {
      // A daily 21:00 New York series stored as instant strings: the stored exDate
      // must re-parse onto the same data-timezone day it excludes.
      const nyEvent = EventBuilder.new()
        .id('ny-daily')
        .withDataTimezone('America/New_York')
        .singleDay('2025-02-02T02:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1 })
        .build();
      let latestEvents: SchedulerEvent[] = [nyEvent];
      const store = new storeClass.Value(
        {
          ...DEFAULT_PARAMS,
          events: latestEvents,
          onEventsChange: (events: SchedulerEvent[]) => {
            latestEvents = events;
          },
        },
        adapter,
      );

      // Delete the March 1st (New York) occurrence — March 2nd 02:00Z.
      store.deleteRecurringEvent({
        occurrenceStart: adapter.date('2025-03-02T02:00:00Z', 'default'),
        eventId: 'ny-daily',
        onSubmit: () => {},
      });
      store.selectRecurringEventScope('only-this');

      // Reprocess the serialized model the way a fresh mount would.
      const reprocessed = processEvent(
        latestEvents[0],
        'default',
        adapter,
        schedulerRecurringEventsPlugin,
      );
      const visibleStart = adapter.date('2025-02-27T00:00:00Z', 'default');
      const days = schedulerRecurringEventsPlugin
        .getOccurrencesForVisibleDays(
          reprocessed,
          visibleStart,
          adapter.addDays(visibleStart, 4),
          adapter,
          'default',
        )
        .map((occurrence) =>
          adapter.formatByString(occurrence.dataTimezone.start.value, 'yyyy-MM-dd'),
        );

      expect(days).to.include('2025-02-28');
      expect(days).to.not.include('2025-03-01');
    });
  });
});

[
  { name: 'EventCalendarStore', Value: EventCalendarStore },
  { name: 'EventCalendarPremiumStore', Value: EventCalendarPremiumStore },
].forEach((storeClass) => {
  describe(`Editing view navigation - ${storeClass.name}`, () => {
    it('should stop editing when the view changes', () => {
      const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
      armRecurringOccurrence(store);

      store.setView('month', {} as any);

      expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
    });

    it('should stop editing when a controlled view changes', () => {
      const parameters = { ...DEFAULT_PARAMS, view: 'week' as const };
      const store = new storeClass.Value(parameters, adapter);
      armRecurringOccurrence(store);

      store.updateStateFromParameters({ ...parameters, view: 'month' as const }, adapter);

      expect(schedulerOtherSelectors.editingOccurrence(store.state)).to.equal(null);
    });
  });
});
