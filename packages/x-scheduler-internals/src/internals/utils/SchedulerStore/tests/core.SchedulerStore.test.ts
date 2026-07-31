import { adapter, EventBuilder, ResourceBuilder, storeClasses } from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import {
  schedulerEventSelectors,
  schedulerResourceSelectors,
} from '../../../../scheduler-selectors';

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

        const store = new storeClass.Value({ ...DEFAULT_PARAMS, events }, adapter);

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
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, displayTimezone }, adapter);

        const expectedToday = adapter.startOfDay(adapter.now(displayTimezone));

        expect(store.state.visibleDate).toEqualDateTime(expectedToday);
        expect(adapter.getTimezone(store.state.visibleDate)).to.equal(displayTimezone);
      });
    });

    describe('updater', () => {
      it('should sync partial state from new parameters (events/resources/flags/ampm/indicator)', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS, adapter);
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

        store.updateStateFromParameters(newParams, adapter);

        expect(schedulerEventSelectors.idList(store.state)).to.deep.equal([event.id]);
        expect(schedulerResourceSelectors.idList(store.state)).to.deep.equal(['r1', 'r2']);

        expect(store.state.areEventsDraggable).to.equal(true);
        expect(store.state.areEventsResizable).to.equal(true);
        expect(store.state.showCurrentTimeIndicator).to.equal(false);
      });

      it('should respect controlled `visibleDate` (updates to new value)', () => {
        const initial = adapter.date('2025-07-05T00:00:00Z', 'default');
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, visibleDate: initial }, adapter);

        const next = adapter.date('2025-07-10T00:00:00Z', 'default');
        store.updateStateFromParameters({ ...DEFAULT_PARAMS, visibleDate: next }, adapter);

        expect(store.state.visibleDate).toEqualDateTime(next);
      });

      it('should not change `visibleDate` if not included in new parameters', () => {
        const initialVisibleDate = adapter.date('2025-07-01T00:00:00Z', 'default');
        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, visibleDate: initialVisibleDate },
          adapter,
        );

        store.updateStateFromParameters(
          {
            ...DEFAULT_PARAMS,
            resources: [{ id: 'r1', title: 'Resource 1' }],
            visibleDate: store.state.visibleDate,
          },
          adapter,
        );

        expect(store.state.visibleDate).toEqualDateTime(initialVisibleDate);
      });

      it('should keep initial defaults and warns if default props change after mount', () => {
        const defaultDate = adapter.date('2025-07-15T00:00:00Z', 'default');

        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, defaultVisibleDate: defaultDate },
          adapter,
        );

        expect(() => {
          store.updateStateFromParameters(
            {
              ...DEFAULT_PARAMS,
              resources: [{ id: 'r1', title: 'Resource 1' }],
              defaultVisibleDate: adapter.date('2025-12-30T00:00:00Z', 'default'),
            },
            adapter,
          );
        }).toWarnDev(['MUI X Scheduler: A component is changing the default visibleDate state']);

        expect(store.state.visibleDate).toEqualDateTime(defaultDate);
      });

      it('should keep consistent state when switching from uncontrolled → controlled `visible date` (warns in dev)', () => {
        const store = new storeClass.Value(
          {
            ...DEFAULT_PARAMS,
            defaultVisibleDate: adapter.date('2025-07-05T00:00:00Z', 'default'),
          },
          adapter,
        );

        const newDate = adapter.date('2025-07-10T00:00:00Z', 'default');
        expect(() => {
          store.updateStateFromParameters({ ...DEFAULT_PARAMS, visibleDate: newDate }, adapter);
        }).toWarnDev('MUI X Scheduler: A component is changing the uncontrolled visibleDate state');

        expect(store.state.visibleDate).toEqualDateTime(newDate);
      });

      it('should warn and keep current value when switching from controlled → uncontrolled `visibleDate`', () => {
        const visibleDate = adapter.date('2025-07-05T00:00:00Z', 'default');
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, visibleDate }, adapter);

        expect(() => {
          store.updateStateFromParameters(
            {
              ...DEFAULT_PARAMS,
              resources: [{ id: 'r1', title: 'Resource 1' }],
              visibleDate: undefined,
            },
            adapter,
          );
        }).toWarnDev('MUI X Scheduler: A component is changing the controlled visibleDate state');

        expect(store.state.visibleDate).toEqualDateTime(visibleDate);
      });

      it('should keep the same `nowUpdatedEveryMinute` reference when a non-timezone parameter changes', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS, adapter);
        const before = store.state.nowUpdatedEveryMinute;

        store.updateStateFromParameters(
          { ...DEFAULT_PARAMS, showCurrentTimeIndicator: false },
          adapter,
        );

        expect(store.state.nowUpdatedEveryMinute).to.equal(before);
      });

      it('should recompute `nowUpdatedEveryMinute` when the display timezone changes', () => {
        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, displayTimezone: 'default' },
          adapter,
        );
        const before = store.state.nowUpdatedEveryMinute;

        store.updateStateFromParameters(
          { ...DEFAULT_PARAMS, displayTimezone: 'America/New_York' },
          adapter,
        );

        expect(store.state.nowUpdatedEveryMinute).to.not.equal(before);
        expect(adapter.getTimezone(store.state.nowUpdatedEveryMinute)).to.equal('America/New_York');
      });
    });

    describe('selection', () => {
      // No selectable type is registered in the base package, so the union is empty:
      // the cast mirrors how augmenting packages produce selections.
      const selectionA = { type: 'a', id: 1 } as never;
      const selectionB = { type: 'b', id: 1 } as never;

      it('should keep one selection across types and skip the write when unchanged', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS, adapter);

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

    describe('errors', () => {
      it('should stack repeated non-transient errors and keep them until dismissed', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS, adapter);

        store.pushError(new Error('boom'));
        const secondKey = store.pushError(new Error('boom'));

        expect(store.state.errors).to.have.length(2);

        store.dismissError(secondKey);
        expect(store.state.errors).to.have.length(1);
      });

      it('should replace a transient error carrying the same message instead of stacking it', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS, adapter);

        store.pushError(new Error('rejected'), { transient: true });
        store.pushError(new Error('rejected'), { transient: true });

        expect(store.state.errors).to.have.length(1);
      });

      it('should not replace a non-transient error with a transient one carrying the same message', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS, adapter);

        store.pushError(new Error('boom'));
        store.pushError(new Error('boom'), { transient: true });

        expect(store.state.errors).to.have.length(2);
      });

      it('should auto-dismiss a transient error and leave the non-transient ones alone', () => {
        vi.useFakeTimers();
        try {
          const store = new storeClass.Value(DEFAULT_PARAMS, adapter);

          store.pushError(new Error('boom'));
          store.pushError(new Error('rejected'), { transient: true });
          expect(store.state.errors).to.have.length(2);

          vi.advanceTimersByTime(5000);

          expect(store.state.errors).to.have.length(1);
          expect(store.state.errors[0].error.message).to.equal('boom');
        } finally {
          vi.useRealTimers();
        }
      });

      it('should refresh the auto-dismiss timer when a transient error is replaced', () => {
        vi.useFakeTimers();
        try {
          const store = new storeClass.Value(DEFAULT_PARAMS, adapter);

          store.pushError(new Error('rejected'), { transient: true });
          vi.advanceTimersByTime(3000);
          store.pushError(new Error('rejected'), { transient: true });

          // 3s after the replacement the original timer would have fired.
          vi.advanceTimersByTime(3000);
          expect(store.state.errors).to.have.length(1);

          vi.advanceTimersByTime(2000);
          expect(store.state.errors).to.have.length(0);
        } finally {
          vi.useRealTimers();
        }
      });

      it('should cancel the auto-dismiss timer when a transient error is dismissed manually', () => {
        vi.useFakeTimers();
        try {
          const store = new storeClass.Value(DEFAULT_PARAMS, adapter);

          const transientKey = store.pushError(new Error('rejected'), { transient: true });
          store.dismissError(transientKey);
          const laterKey = store.pushError(new Error('kept'));

          const stateBefore = store.state;
          vi.advanceTimersByTime(5000);

          expect(store.state.errors).to.have.length(1);
          expect(store.state.errors[0].key).to.equal(laterKey);
          // The canceled timer must not even produce a state write.
          expect(store.state).to.equal(stateBefore);
        } finally {
          vi.useRealTimers();
        }
      });
    });
  });
});
