import { adapter } from 'test/utils/scheduler';
import { SchedulerEvent } from '@mui/x-scheduler-headless/models';
import { storeClasses, buildEvent } from './utils';
import { schedulerEventSelectors, schedulerResourceSelectors } from '../../../scheduler-selectors';

const DEFAULT_PARAMS = { events: [] as SchedulerEvent[] };

storeClasses.forEach((storeClass) => {
  describe(`Core - ${storeClass.name}`, () => {
    describe('create', () => {
      it('should keep provided events array', () => {
        const events = [
          buildEvent(
            '1',
            'Event 1',
            adapter.date('2025-08-01T08:00:00Z', 'default'),
            adapter.date('2025-08-01T09:00:00Z', 'default'),
          ),
          buildEvent(
            '2',
            'Event 2',
            adapter.date('2025-09-01T08:00:00Z', 'default'),
            adapter.date('2025-09-01T09:00:00Z', 'default'),
          ),
        ];

        const store = new storeClass.Value({ events }, adapter);

        expect(schedulerEventSelectors.idList(store.state)).to.deep.equal(['1', '2']);
        expect(schedulerEventSelectors.processedEvent(store.state, '1')!.title).to.equal('Event 1');
        expect(schedulerEventSelectors.processedEvent(store.state, '2')!.title).to.equal('Event 2');
        expect(schedulerEventSelectors.modelList(store.state)).to.equal(events);
      });

      it('should interpret defaultVisibleDate in the render timezone', () => {
        const timezone = 'Pacific/Kiritimati';
        const defaultVisibleDate = adapter.date('2025-07-01T00:00:00', 'default');

        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, defaultVisibleDate, timezone },
          adapter,
        );

        const expected = adapter.setTimezone(defaultVisibleDate, timezone);
        expect(store.state.visibleDate).toEqualDateTime(expected);
        expect(adapter.getTimezone(store.state.visibleDate)).toBe(timezone);
      });

      it('should set visibleDate to today in the render timezone when defaultVisibleDate is not provided', () => {
        const timezone = 'Pacific/Kiritimati';
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, timezone }, adapter);

        const expectedToday = adapter.startOfDay(adapter.now(timezone));

        expect(store.state.visibleDate).toEqualDateTime(expectedToday);
        expect(store.state.timezone).to.equal(timezone);
      });
    });

    describe('updater', () => {
      it('should sync partial state from new parameters (events/resources/flags/ampm/indicator)', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS, adapter);

        const newParams = {
          events: [
            buildEvent(
              '1',
              'Test Event',
              adapter.date('2025-07-01T10:00:00Z', 'default'),
              adapter.date('2025-07-01T11:00:00Z', 'default'),
            ),
          ],
          resources: [
            { id: 'r1', title: 'Resource 1' },
            { id: 'r2', title: 'Resource 2' },
          ],
          areEventsDraggable: true,
          areEventsResizable: true,
          showCurrentTimeIndicator: false,
        };

        store.updateStateFromParameters(newParams, adapter);

        expect(schedulerEventSelectors.idList(store.state)).to.deep.equal(['1']);
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
        }).toWarnDev(['Scheduler: A component is changing the default visibleDate state']);

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
        }).toWarnDev('Scheduler: A component is changing the uncontrolled visibleDate state');

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
        }).toWarnDev('Scheduler: A component is changing the controlled visibleDate state');

        expect(store.state.visibleDate).toEqualDateTime(visibleDate);
      });
    });
  });
});
