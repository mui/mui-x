import { renderHook, act } from '@mui/internal-test-utils';
import { DateTime } from 'luxon';
import { spy } from 'sinon';
import { useEventCalendar } from './useEventCalendar';
import { getAdapter } from '../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

describe('useDateNavigation', () => {
  const adapter = getAdapter();

  describe('Method: goToPreviousVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-01T00:00:00Z');
      const targetDate = adapter.addDays(DateTime.fromISO('2025-07-01T00:00:00Z'), 3);
      const siblingVisibleDateGetter = spy(() => targetDate);

      const { result } = renderHook(() =>
        useEventCalendar({ ...DEFAULT_PARAMS, view: 'day', visibleDate, onVisibleDateChange }),
      );

      act(() => result.current.instance.setViewConfig({ siblingVisibleDateGetter }));
      act(() => result.current.instance.goToPreviousVisibleDate({} as any));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(targetDate);
      expect(siblingVisibleDateGetter.lastCall.lastArg).toEqual(-1);
    });
  });

  describe('Method: goToNextVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-01T00:00:00Z');
      const targetDate = adapter.addDays(DateTime.fromISO('2025-07-01T00:00:00Z'), 3);
      const siblingVisibleDateGetter = spy(() => targetDate);

      const { result } = renderHook(() =>
        useEventCalendar({ ...DEFAULT_PARAMS, view: 'day', visibleDate, onVisibleDateChange }),
      );

      act(() => result.current.instance.setViewConfig({ siblingVisibleDateGetter }));
      act(() => result.current.instance.goToNextVisibleDate({} as any));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(targetDate);
      expect(siblingVisibleDateGetter.lastCall.lastArg).toEqual(1);
    });
  });
});
