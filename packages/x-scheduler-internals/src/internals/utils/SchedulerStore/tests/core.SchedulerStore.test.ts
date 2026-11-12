import {
  createDate,
  EventBuilder,
  ResourceBuilder,
  startOfDay,
  storeClasses,
} from 'test/utils/scheduler';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { describe, it, expect, onTestFinished, vi } from 'vitest';
import {
  schedulerEventSelectors,
  schedulerNowSelectors,
  schedulerResourceSelectors,
} from '../../../../scheduler-selectors';

const MS_PER_DAY = 86_400_000;

const DEFAULT_PARAMS = {
  events: [] as SchedulerEvent[],
  resources: [ResourceBuilder.new().build()],
};

storeClasses.forEach((storeClass) => {
  describe(`Core - ${storeClass.name}`, () => {
    describe('create', () => {
      it('should keep provided events array', () => {
        const event1 = EventBuilder.new().build();
        const event2 = EventBuilder.new().build();
        const events = [event1, event2];

        const store = new storeClass.Value({ ...DEFAULT_PARAMS, events });

        expect(schedulerEventSelectors.idList(store.state)).to.deep.equal([event1.id, event2.id]);
        expect(schedulerEventSelectors.processedEvent(store.state, event1.id)!.title).to.equal(
          event1.title,
        );
        expect(schedulerEventSelectors.processedEvent(store.state, event2.id)!.title).to.equal(
          event2.title,
        );
        expect(schedulerEventSelectors.modelList(store.state)).to.equal(events);
      });

      it('should set visibleDate to today in the display timezone when defaultVisibleDate is not provided', () => {
        const displayTimezone = 'Pacific/Kiritimati';
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, displayTimezone });

        const expectedToday = startOfDay(new Date(), displayTimezone);

        expect(store.state.visibleDate.getTime()).to.equal(expectedToday.getTime());
      });

      it('should start today at the end of the gap when the display timezone skips midnight', () => {
        vi.useFakeTimers();
        onTestFinished(() => {
          vi.useRealTimers();
        });
        // Santiago skips from 00:00 to 01:00 on September 8th, 2024.
        vi.setSystemTime(new Date('2024-09-08T12:00:00Z'));
        const store = new storeClass.Value({
          ...DEFAULT_PARAMS,
          displayTimezone: 'America/Santiago',
        });

        expect(store.state.visibleDate.getTime()).to.equal(Date.parse('2024-09-08T04:00:00Z'));
      });

      it('should move `nowTimestamp` and the current day every minute', () => {
        vi.useFakeTimers();
        onTestFinished(() => {
          vi.useRealTimers();
        });
        vi.setSystemTime(new Date('2025-07-03T23:59:30Z'));
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, displayTimezone: 'UTC' });

        // The first tick lands on the next minute, the following ones a minute apart.
        vi.advanceTimersByTime(30_000);
        expect(store.state.nowTimestamp).to.equal(Date.parse('2025-07-04T00:00:00Z'));
        expect(schedulerNowSelectors.nowDayNumber(store.state)).to.equal(
          Date.UTC(2025, 6, 4) / MS_PER_DAY,
        );

        vi.advanceTimersByTime(60_000);
        expect(store.state.nowTimestamp).to.equal(Date.parse('2025-07-04T00:01:00Z'));
      });
    });

    describe('updater', () => {
      it('should sync partial state from new parameters (events/resources/flags/ampm/indicator)', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);
        const event = EventBuilder.new().build();

        const newParams = {
          events: [event],
          resources: [
            { id: 'r1', title: 'Resource 1' },
            { id: 'r2', title: 'Resource 2' },
          ],
          areEventsDraggable: true,
          areEventsResizable: true,
          showCurrentTimeIndicator: false,
        };

        store.updateStateFromParameters(newParams);

        expect(schedulerEventSelectors.idList(store.state)).to.deep.equal([event.id]);
        expect(schedulerResourceSelectors.idList(store.state)).to.deep.equal(['r1', 'r2']);

        expect(store.state.areEventsDraggable).to.equal(true);
        expect(store.state.areEventsResizable).to.equal(true);
        expect(store.state.showCurrentTimeIndicator).to.equal(false);
      });

      it('should respect controlled `visibleDate` (updates to new value)', () => {
        const initial = createDate('2025-07-05T00:00:00Z');
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, visibleDate: initial });

        const next = createDate('2025-07-10T00:00:00Z');
        store.updateStateFromParameters({ ...DEFAULT_PARAMS, visibleDate: next });

        expect(store.state.visibleDate).toEqualDateTime(next);
      });

      it('should keep initial defaults and warns if default props change after mount', () => {
        const defaultDate = createDate('2025-07-15T00:00:00Z');

        const store = new storeClass.Value({ ...DEFAULT_PARAMS, defaultVisibleDate: defaultDate });

        expect(() => {
          store.updateStateFromParameters({
            ...DEFAULT_PARAMS,
            resources: [{ id: 'r1', title: 'Resource 1' }],
            defaultVisibleDate: createDate('2025-12-30T00:00:00Z'),
          });
        }).toWarnDev(['MUI X Scheduler: A component is changing the default visibleDate state']);

        expect(store.state.visibleDate).toEqualDateTime(defaultDate);
      });

      it('should keep consistent state when switching from uncontrolled → controlled `visible date` (warns in dev)', () => {
        const store = new storeClass.Value({
          ...DEFAULT_PARAMS,
          defaultVisibleDate: createDate('2025-07-05T00:00:00Z'),
        });

        const newDate = createDate('2025-07-10T00:00:00Z');
        expect(() => {
          store.updateStateFromParameters({ ...DEFAULT_PARAMS, visibleDate: newDate });
        }).toWarnDev('MUI X Scheduler: A component is changing the uncontrolled visibleDate state');

        expect(store.state.visibleDate).toEqualDateTime(newDate);
      });

      it('should warn and keep current value when switching from controlled → uncontrolled `visibleDate`', () => {
        const visibleDate = createDate('2025-07-05T00:00:00Z');
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, visibleDate });

        expect(() => {
          store.updateStateFromParameters({
            ...DEFAULT_PARAMS,
            resources: [{ id: 'r1', title: 'Resource 1' }],
            visibleDate: undefined,
          });
        }).toWarnDev('MUI X Scheduler: A component is changing the controlled visibleDate state');

        expect(store.state.visibleDate).toEqualDateTime(visibleDate);
      });

      it('should keep the same `nowTimestamp` when a parameter changes', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);
        const before = store.state.nowTimestamp;

        store.updateStateFromParameters({
          ...DEFAULT_PARAMS,
          displayTimezone: 'America/New_York',
          showCurrentTimeIndicator: false,
        });

        expect(store.state.nowTimestamp).to.equal(before);
      });

      it('should read the current day in the new display timezone', () => {
        vi.useFakeTimers();
        onTestFinished(() => {
          vi.useRealTimers();
        });
        // Still July 2nd in New York.
        vi.setSystemTime(new Date('2025-07-03T02:00:00Z'));
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, displayTimezone: 'UTC' });
        expect(schedulerNowSelectors.nowDayNumber(store.state)).to.equal(
          Date.UTC(2025, 6, 3) / MS_PER_DAY,
        );

        store.updateStateFromParameters({ ...DEFAULT_PARAMS, displayTimezone: 'America/New_York' });

        expect(schedulerNowSelectors.nowDayNumber(store.state)).to.equal(
          Date.UTC(2025, 6, 2) / MS_PER_DAY,
        );
      });
    });

    describe('selection', () => {
      // No selectable type is registered in the base package, so the union is empty:
      // the cast mirrors how augmenting packages produce selections.
      const selectionA = { type: 'a', id: 1 } as never;
      const selectionB = { type: 'b', id: 1 } as never;

      it('should keep one selection across types and skip the write when unchanged', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.setSelection(selectionA);
        expect(store.state.selection).to.equal(selectionA);

        // Selecting an entity of another type replaces the previous selection.
        store.setSelection(selectionB);
        expect(store.state.selection).to.equal(selectionB);

        // A value-equal selection does not write.
        const stateBefore = store.state;
        store.setSelection({ type: 'b', id: 1 } as never);
        expect(store.state).to.equal(stateBefore);

        store.setSelection(null);
        expect(store.state.selection).to.equal(null);
      });
    });

    describe('occurrence highlight', () => {
      const highlight = { resourceId: 'a', range: { start: 1, end: 2 } };

      it('should store the highlight and skip the write when the value is equal', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.setOccurrenceHighlight(highlight);
        expect(store.state.occurrenceHighlight).to.equal(highlight);

        const stateBefore = store.state;
        store.setOccurrenceHighlight({ resourceId: 'a', range: { start: 1, end: 2 } });
        expect(store.state).to.equal(stateBefore);

        store.setOccurrenceHighlight(null);
        expect(store.state.occurrenceHighlight).to.equal(null);
      });

      it('should clear the highlight when the visible date changes', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);
        store.setOccurrenceHighlight(highlight);

        store.goToDate(adapter.date('2025-07-14T00:00:00Z', 'default'), {} as any);

        expect(store.state.occurrenceHighlight).to.equal(null);
      });
    });

    describe('errors', () => {
      // Pinned to a minute boundary: the store schedules its `nowTimestamp`
      // tick for the next one, counted from wherever the clock starts. On the real
      // time a run in the last seconds of a minute lets these tests advance across
      // the boundary and pick up a state write they do not test. Keep the advances
      // below one minute.
      const { clock } = createRenderer({
        clock: 'fake',
        clockConfig: new Date(2012, 4, 3, 14, 30, 0, 0),
      });

      const failure = { code: 'somethingWentWrongError' } as const;
      const rejection = { code: 'eventNotLoadedError' } as const;

      it('should stack repeated non-transient errors and keep them until dismissed', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.pushUserFacingError(failure);
        const secondKey = store.pushUserFacingError(failure);

        expect(store.state.errors).to.have.length(2);

        store.dismissError(secondKey);
        expect(store.state.errors).to.have.length(1);
      });

      it('should dismiss only the error with the given key and keep the order of the others', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.pushUserFacingError(failure);
        const secondKey = store.pushUserFacingError(rejection);
        store.pushUserFacingError({ code: 'eventChangedWhileConfirmingError' });
        store.dismissError(secondKey);

        expect(store.state.errors.map((entry) => entry.code)).to.deep.equal([
          'somethingWentWrongError',
          'eventChangedWhileConfirmingError',
        ]);
      });

      it('should keep every error when dismissing a key that does not exist', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.pushUserFacingError(failure);
        store.pushUserFacingError(rejection);
        const [first, second] = store.state.errors;
        store.dismissError('does-not-exist');

        expect(store.state.errors).to.have.length(2);
        expect(store.state.errors[0]).to.equal(first);
        expect(store.state.errors[1]).to.equal(second);
      });

      it('should replace a transient error with the same code instead of stacking it', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.pushUserFacingError(rejection, { transient: true });
        store.pushUserFacingError(rejection, { transient: true });

        expect(store.state.errors).to.have.length(1);
      });

      it('should replace a transient error with the same code and equal params', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.pushUserFacingError(
          { code: 'readOnlyEventMovedError', params: { title: 'A' } },
          { transient: true },
        );
        store.pushUserFacingError(
          { code: 'readOnlyEventMovedError', params: { title: 'A' } },
          { transient: true },
        );

        expect(store.state.errors).to.have.length(1);
      });

      it('should not replace a transient error with the same code but other params', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.pushUserFacingError(
          { code: 'readOnlyEventMovedError', params: { title: 'A' } },
          { transient: true },
        );
        store.pushUserFacingError(
          { code: 'readOnlyEventMovedError', params: { title: 'B' } },
          { transient: true },
        );

        expect(store.state.errors.map((entry) => entry.params)).to.deep.equal([
          { title: 'A' },
          { title: 'B' },
        ]);
      });

      it('should not replace a non-transient error with a transient one with the same code', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.pushUserFacingError(failure);
        store.pushUserFacingError(failure, { transient: true });

        expect(store.state.errors).to.have.length(2);
      });

      it('should auto-dismiss a transient error and leave the non-transient ones alone', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.pushUserFacingError(failure);
        store.pushUserFacingError(rejection, { transient: true });
        expect(store.state.errors).to.have.length(2);

        clock.tick(5000);

        expect(store.state.errors.map((entry) => entry.code)).to.deep.equal([
          'somethingWentWrongError',
        ]);
      });

      it('should refresh the auto-dismiss timer when a transient error is replaced', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        store.pushUserFacingError(rejection, { transient: true });
        clock.tick(3000);
        store.pushUserFacingError(rejection, { transient: true });

        // 3s after the replacement the original timer would have fired.
        clock.tick(3000);
        expect(store.state.errors).to.have.length(1);

        clock.tick(2000);
        expect(store.state.errors).to.have.length(0);
      });

      it('should cancel the auto-dismiss timer when a transient error is dismissed manually', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        const transientKey = store.pushUserFacingError(rejection, { transient: true });
        store.dismissError(transientKey);
        const laterKey = store.pushUserFacingError(failure);

        const stateBefore = store.state;
        clock.tick(5000);

        expect(store.state.errors).to.have.length(1);
        expect(store.state.errors[0].key).to.equal(laterKey);
        // The canceled timer must not even produce a state write.
        expect(store.state).to.equal(stateBefore);
      });

      it('should log the original error to the console without storing it', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        expect(() => {
          store.pushUserFacingError(failure, { error: new Error('Failed to fetch') });
        }).toErrorDev(
          'MUI X Scheduler: The user was shown the `somethingWentWrongError` error, caused by: Error: Failed to fetch',
        );

        expect(store.state.errors).to.deep.equal([{ code: 'somethingWentWrongError', key: '1' }]);
      });

      it('should log a rejection without a value', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS);

        expect(() => {
          store.pushUserFacingError(failure, { error: undefined });
        }).toErrorDev('MUI X Scheduler: The user was shown the `somethingWentWrongError` error');
      });
    });
  });
});
