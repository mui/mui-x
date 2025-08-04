import { renderHook, act } from '@mui/internal-test-utils';
import { DateTime } from 'luxon';
import { spy } from 'sinon';
import { useEventCalendar } from './useEventCalendar';
import { getAdapter } from '../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

describe('useDateNavigation', () => {
  const adapter = getAdapter();

  describe('Method: goToPreviousVisibleDate', () => {
    it('should go to previous day when used in the day view', () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-01T00:00:00Z');

      const { result } = renderHook(() =>
        useEventCalendar({ ...DEFAULT_PARAMS, view: 'day', visibleDate, onVisibleDateChange }),
      );

      act(() => result.current.instance.goToPreviousVisibleDate({} as any));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(visibleDate, -1),
      );
    });

    it('should go to start of previous week when used in the week view', () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z'); // Thursday

      const { result } = renderHook(() =>
        useEventCalendar({ ...DEFAULT_PARAMS, view: 'week', visibleDate, onVisibleDateChange }),
      );

      act(() => result.current.instance.goToPreviousVisibleDate({} as any));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addWeeks(adapter.startOfWeek(visibleDate), -1),
      );
    });

    it('should go to start of previous month when used in the month view', () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-15T00:00:00Z');

      const { result } = renderHook(() =>
        useEventCalendar({ ...DEFAULT_PARAMS, view: 'month', visibleDate, onVisibleDateChange }),
      );

      act(() => result.current.instance.goToPreviousVisibleDate({} as any));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addMonths(adapter.startOfMonth(visibleDate), -1),
      );
    });

    it('should go to previous agenda period (12 days) when used in the agenda view', () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-01T00:00:00Z');

      const { result } = renderHook(() =>
        useEventCalendar({ ...DEFAULT_PARAMS, view: 'agenda', visibleDate, onVisibleDateChange }),
      );

      act(() => result.current.instance.goToPreviousVisibleDate({} as any));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(visibleDate, -12),
      );
    });
  });

  describe('Method: goToNextVisibleDate', () => {
    it('should go to next day when used in the day view', () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-01T00:00:00Z');

      const { result } = renderHook(() =>
        useEventCalendar({ ...DEFAULT_PARAMS, view: 'day', visibleDate, onVisibleDateChange }),
      );

      act(() => result.current.instance.goToNextVisibleDate({} as any));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(visibleDate, 1),
      );
    });

    it('should go to start of next week when used in the week view', () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z'); // Thursday

      const { result } = renderHook(() =>
        useEventCalendar({ ...DEFAULT_PARAMS, view: 'week', visibleDate, onVisibleDateChange }),
      );

      act(() => result.current.instance.goToNextVisibleDate({} as any));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addWeeks(adapter.startOfWeek(visibleDate), 1),
      );
    });

    it('should go to start of next month when used in the month view', () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-15T00:00:00Z');

      const { result } = renderHook(() =>
        useEventCalendar({ ...DEFAULT_PARAMS, view: 'month', visibleDate, onVisibleDateChange }),
      );

      act(() => result.current.instance.goToNextVisibleDate({} as any));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addMonths(adapter.startOfMonth(visibleDate), 1),
      );
    });

    it('should go to next agenda period (12 days) when used in the agenda view', () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-01T00:00:00Z');

      const { result } = renderHook(() =>
        useEventCalendar({ ...DEFAULT_PARAMS, view: 'agenda', visibleDate, onVisibleDateChange }),
      );

      act(() => result.current.instance.goToNextVisibleDate({} as any));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(visibleDate, 12),
      );
    });
  });
});
