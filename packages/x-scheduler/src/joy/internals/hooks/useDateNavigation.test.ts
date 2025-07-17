import { renderHook, act } from '@mui/internal-test-utils';
import { DateTime } from 'luxon';
import { spy } from 'sinon';
import { useDateNavigation } from './useDateNavigation';
import { getAdapter } from '../../../primitives/utils/adapter/getAdapter';

describe('useDateNavigation', () => {
  const adapter = getAdapter();

  it('should go to next day', () => {
    const setVisibleDate = spy();
    const visibleDate = DateTime.fromISO('2025-07-01T00:00:00Z');
    const { result } = renderHook(() =>
      useDateNavigation({ visibleDate, setVisibleDate, view: 'day' }),
    );
    act(() => result.current.onNextClick());
    expect(setVisibleDate.firstCall.args[0].toMillis()).to.equal(
      DateTime.fromISO('2025-07-02T00:00:00Z').toMillis(),
    );
  });

  it('should go to previous day', () => {
    const setVisibleDate = spy();
    const visibleDate = DateTime.fromISO('2025-07-01T00:00:00Z');
    const { result } = renderHook(() =>
      useDateNavigation({ visibleDate, setVisibleDate, view: 'day' }),
    );
    act(() => result.current.onPreviousClick());
    expect(setVisibleDate.firstCall.args[0].toMillis()).to.equal(
      adapter.addDays(visibleDate, -1).toMillis(),
    );
  });

  it('should go to next week (start of next week, Sunday)', () => {
    const setVisibleDate = spy();
    const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z'); // Thursday
    const { result } = renderHook(() =>
      useDateNavigation({ visibleDate, setVisibleDate, view: 'week' }),
    );
    act(() => result.current.onNextClick());
    const startOfWeek = adapter.startOfWeek(visibleDate);
    expect(setVisibleDate.firstCall.args[0].toMillis()).to.equal(
      startOfWeek.plus({ weeks: 1 }).toMillis(),
    );
  });

  it('should go to previous week (start of previous week, Sunday)', () => {
    const setVisibleDate = spy();
    const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z'); // Thursday
    const { result } = renderHook(() =>
      useDateNavigation({ visibleDate, setVisibleDate, view: 'week' }),
    );
    act(() => result.current.onPreviousClick());
    const startOfWeek = adapter.startOfWeek(visibleDate);
    expect(setVisibleDate.firstCall.args[0].toMillis()).to.equal(
      startOfWeek.plus({ weeks: -1 }).toMillis(),
    );
  });

  it('should go to next month (start of next month)', () => {
    const setVisibleDate = spy();
    const visibleDate = DateTime.fromISO('2025-07-15T00:00:00Z');
    const { result } = renderHook(() =>
      useDateNavigation({ visibleDate, setVisibleDate, view: 'month' }),
    );
    act(() => result.current.onNextClick());
    const startOfMonth = adapter.startOfMonth(visibleDate);
    expect(setVisibleDate.firstCall.args[0].toMillis()).to.equal(
      startOfMonth.plus({ months: 1 }).toMillis(),
    );
  });

  it('should go to previous month (start of previous month)', () => {
    const setVisibleDate = spy();
    const visibleDate = DateTime.fromISO('2025-07-15T00:00:00Z');
    const { result } = renderHook(() =>
      useDateNavigation({ visibleDate, setVisibleDate, view: 'month' }),
    );
    act(() => result.current.onPreviousClick());
    const startOfMonth = adapter.startOfMonth(visibleDate);
    expect(setVisibleDate.firstCall.args[0].toMillis()).to.equal(
      startOfMonth.plus({ months: -1 }).toMillis(),
    );
  });

  it('should go to next agenda period (12 days)', () => {
    const setVisibleDate = spy();
    const visibleDate = DateTime.fromISO('2025-07-01T00:00:00Z');
    const { result } = renderHook(() =>
      useDateNavigation({ visibleDate, setVisibleDate, view: 'agenda' }),
    );
    act(() => result.current.onNextClick());
    expect(setVisibleDate.firstCall.args[0].toMillis()).to.equal(
      adapter.addDays(visibleDate, 12).toMillis(),
    );
  });

  it('should go to previous agenda period (12 days)', () => {
    const setVisibleDate = spy();
    const visibleDate = DateTime.fromISO('2025-07-13T00:00:00Z');
    const { result } = renderHook(() =>
      useDateNavigation({ visibleDate, setVisibleDate, view: 'agenda' }),
    );
    act(() => result.current.onPreviousClick());
    expect(setVisibleDate.firstCall.args[0].toMillis()).to.equal(
      adapter.addDays(visibleDate, -12).toMillis(),
    );
  });
});
