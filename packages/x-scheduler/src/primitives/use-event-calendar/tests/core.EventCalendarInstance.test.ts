import { getAdapter } from '@mui/x-scheduler/primitives/utils/adapter/getAdapter';
import * as warnModule from '@base-ui-components/utils/warn';
import {
  DEFAULT_PREFERENCES,
  DEFAULT_PREFERENCES_MENU_CONFIG,
  DEFAULT_VIEW,
  DEFAULT_VIEWS,
  EventCalendarInstance,
} from '../EventCalendarInstance';
import { buildEvent, getIds } from './utils';
import { CalendarView } from '../../models';

vi.mock('@base-ui-components/utils/warn', () => ({
  warn: vi.fn(),
}));

const adapter = getAdapter();
const DEFAULT_PARAMS = { events: [] };

describe('Core - EventCalendarInstance', () => {
  describe('create', () => {
    it('initializes default state', () => {
      const { store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      expect(store.state.view).to.equal(DEFAULT_VIEW);
      expect(store.state.views).to.deep.equal(DEFAULT_VIEWS);
      expect(store.state.resources).to.deep.equal([]);
      expect(store.state.ampm).to.equal(true);
      expect(store.state.showCurrentTimeIndicator).to.equal(true);
      expect(store.state.preferences).to.deep.equal(DEFAULT_PREFERENCES);
      expect(store.state.preferencesMenuConfig).to.deep.equal(DEFAULT_PREFERENCES_MENU_CONFIG);

      const expectedToday = adapter.startOfDay(adapter.date());
      expect(store.state.visibleDate).toEqualDateTime(expectedToday);
    });

    it('keeps provided events array', () => {
      const events = [
        buildEvent(
          '1',
          'Event 1',
          adapter.date('2025-08-01T08:00:00Z'),
          adapter.date('2025-08-01T09:00:00Z'),
        ),
        buildEvent(
          '2',
          'Event 2',
          adapter.date('2025-09-01T08:00:00Z'),
          adapter.date('2025-09-01T09:00:00Z'),
        ),
      ];

      const { store } = EventCalendarInstance.create({ events }, adapter);

      expect(store.state.events).to.have.length(2);
      expect(store.state.events[0].title).to.equal('Event 1');
      expect(store.state.events[1].title).to.equal('Event 2');
      expect(store.state.events).to.equal(events);
    });
  });

  describe('updater', () => {
    it('syncs partial state from new parameters (events/resources/views/flags/ampm/indicator)', () => {
      const { store, updater } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      const newParams = {
        events: [
          buildEvent(
            '1',
            'Test Event',
            adapter.date('2025-07-01T10:00:00Z'),
            adapter.date('2025-07-01T11:00:00Z'),
          ),
        ],
        resources: [
          { id: 'r1', name: 'Resource 1' },
          { id: 'r2', name: 'Resource 2' },
        ],
        views: ['day', 'week'] as CalendarView[],
        areEventsDraggable: true,
        areEventsResizable: true,
        ampm: false,
        showCurrentTimeIndicator: false,
      };

      updater(newParams, adapter);
      expect(getIds(store.state.events)).to.deep.equal(['1']);
      expect(getIds(store.state.resources)).to.deep.equal(['r1', 'r2']);
      expect(store.state.views).to.deep.equal(['day', 'week']);
      expect(store.state.areEventsDraggable).to.equal(true);
      expect(store.state.areEventsResizable).to.equal(true);
      expect(store.state.ampm).to.equal(false);
      expect(store.state.showCurrentTimeIndicator).to.equal(false);
    });

    it('respects controlled `view` (updates to new value)', () => {
      const { store, updater } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, view: 'day' },
        adapter,
      );

      updater({ ...DEFAULT_PARAMS, view: 'month' }, adapter);

      expect(store.state.view).to.equal('month');
    });

    it('respects controlled `visibleDate` (updates to new value)', () => {
      const initial = adapter.date('2025-07-05T00:00:00Z');
      const { store, updater } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, visibleDate: initial },
        adapter,
      );

      const next = adapter.date('2025-07-10T00:00:00Z');
      updater({ ...DEFAULT_PARAMS, visibleDate: next }, adapter);

      expect(store.state.visibleDate).toEqualDateTime(next);
    });

    it('does not change `view` if not included in new parameters', () => {
      const { store, updater } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, view: 'month' },
        adapter,
      );

      updater({ ...DEFAULT_PARAMS, resources: [{ id: 'r1', name: 'Resource 1' }] }, adapter);

      expect(store.state.view).to.equal('month');
    });

    it('does not change `visibleDate` if not included in new parameters', () => {
      const initialVisibleDate = adapter.date('2025-07-01T00:00:00Z');
      const { store, updater } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, visibleDate: initialVisibleDate },
        adapter,
      );

      updater(
        {
          ...DEFAULT_PARAMS,
          resources: [{ id: 'r1', name: 'Resource 1' }],
        },
        adapter,
      );

      expect(store.state.visibleDate).toEqualDateTime(initialVisibleDate);
    });

    it('keeps initial defaults and warns if default props change after mount', () => {
      const defaultDate = adapter.date('2025-07-15T00:00:00Z');
      const defaultView = 'month';

      const warnSpy = vi.spyOn(warnModule, 'warn').mockImplementation(() => {});

      const { store, updater } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, defaultView, defaultVisibleDate: defaultDate },
        adapter,
      );

      updater(
        {
          ...DEFAULT_PARAMS,
          resources: [{ id: 'r1', name: 'Resource 1' }],
          defaultView: 'day',
          defaultVisibleDate: adapter.date('2025-12-30T00:00:00Z'),
        },
        adapter,
      );

      expect(warnSpy).toHaveBeenCalled();
      expect(store.state.view).to.equal(defaultView);
      expect(store.state.visibleDate).toEqualDateTime(defaultDate);
    });

    it('keeps consistent state when switching from uncontrolled → controlled `view` (warns in dev)', () => {
      const { store, updater } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, defaultView: 'week' },
        adapter,
      );

      const warnSpy = vi.spyOn(warnModule, 'warn').mockImplementation(() => {});

      updater({ ...DEFAULT_PARAMS, view: 'day' }, adapter);

      expect(warnSpy).toHaveBeenCalled();
      expect(store.state.view).to.equal('day');
    });

    it('keeps consistent state when switching from uncontrolled → controlled `visible date` (warns in dev)', () => {
      const { store, updater } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, defaultVisibleDate: adapter.date('2025-07-05T00:00:00Z') },
        adapter,
      );

      const warnSpy = vi.spyOn(warnModule, 'warn').mockImplementation(() => {});

      const newDate = adapter.date('2025-07-10T00:00:00Z');
      updater({ ...DEFAULT_PARAMS, visibleDate: newDate }, adapter);

      expect(warnSpy).toHaveBeenCalled();
      expect(store.state.visibleDate).toEqualDateTime(newDate);
    });

    it('warns and keeps current value when switching from controlled → uncontrolled `view`', () => {
      const { store, updater } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, view: 'day' },
        adapter,
      );
      const warnSpy = vi.spyOn(warnModule, 'warn').mockImplementation(() => {});

      updater(
        {
          ...DEFAULT_PARAMS,
          resources: [{ id: 'r1', name: 'Resource 1' }],
        },
        adapter,
      );

      expect(warnSpy).toHaveBeenCalled();
      expect(store.state.view).to.equal('day');
    });

    it('warns and keeps current value when switching from controlled → uncontrolled `visibleDate`', () => {
      const initial = adapter.date('2025-07-05T00:00:00Z');
      const { store, updater } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, visibleDate: initial },
        adapter,
      );
      const warnSpy = vi.spyOn(warnModule, 'warn').mockImplementation(() => {});

      updater(
        {
          ...DEFAULT_PARAMS,
          resources: [{ id: 'r1', name: 'Resource 1' }],
        },
        adapter,
      );

      expect(warnSpy).toHaveBeenCalled();
      expect(store.state.visibleDate).toEqualDateTime(initial);
    });
  });
});
